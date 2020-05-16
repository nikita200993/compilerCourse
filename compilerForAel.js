const Path = require("path");
const Os = require("os");
const aelGrammar = require(Path.resolve(__dirname, "lessonOne.js"));

/*
 Classes of ast nodes
*/
class Program
{

    constructor(body)
    {
        this.body = body;
    }

    analyze()
    {
        const context = new Set();
        this.body.forEach(stmt => stmt.analyze(context));
        return this;
    }

    generateJavaScriptCode()
    {
        const declaredIds = new Set();
        return this.body.map((value, index, array) => value.generateJavaScriptCode(declaredIds, "")).join(Os.EOL);
    }
}

class Assignment
{

    constructor(id, expression)
    {
        this.id = id;
        this.expression = expression;
    }

    analyze(context)
    {
        this.expression.analyze(context);
        context.add(this.id);
    }

    generateJavaScriptCode(declaredIds, indent)
    {
        const prefix = declaredIds.has(this.id.name) ? "" : "var ";
        declaredIds.add(this.id.name);
        return `${indent}${prefix}_${this.id} = ${
            this.expression.generateJavaScriptCode()
            };`;
    }
}

class Print
{

    constructor(expression)
    {
        this.expression = expression;
    }

    analyze(context)
    {
        this.expression.analyze(context);
    }

    generateJavaScriptCode(declaredIds, indent)
    {
        return `${indent}console.log(${this.expression.generateJavaScriptCode()});`;
    }
}

class While
{

    constructor(condition, body)
    {
        this.condition = condition;
        this.body = body;
    }

    analyze(context)
    {
        this.condition.analyze(context);
        this.body.forEach(stmt => stmt.analyze(context));
    }

    generateJavaScriptCode(declaredIds, indent)
    {
        return `${indent}while (${this.condition.generateJavaScriptCode()} > 0) {`
            + Os.EOL
            + this.body.map(
                (value, index, array) => value.generateJavaScriptCode(declaredIds, indent + "    ")
            ).join(Os.EOL)
            + Os.EOL
            + `${indent}}`;
    }
}

class BinaryExp
{

    constructor(left, op, right)
    {
        Object.assign(this, { left, op, right });
    }

    analyze(context)
    {
        this.left.analyze(context);
        this.right.analyze(context);
    }

    generateJavaScriptCode()
    {
        return `(${this.left.generateJavaScriptCode()} ${this.op} ${this.right.generateJavaScriptCode()})`;
    }
}

class UnaryExp
{

    constructor(op, operand)
    {
        this.op = op;
        this.operand = operand;
    }

    analyze(context)
    {
        this.operand.analyze(context);
    }

    generateJavaScriptCode()
    {
        return `(${op}${this.operand.generateJavaScriptCode()})`;
    }
}

class NumericalLiteral
{

    constructor(value)
    {
        this.value = value;
    }

    analyze(context) { };

    generateJavaScriptCode()
    {
        return this.value;
    }
}

class Identifier
{

    constructor(name)
    {
        this.name = name;
    }

    analyze(context)
    {
        if (!context.has(this.name)) {
            throw new Error(`Identifier ${this.name} has not been declared.`)
        }
    }

    generateJavaScriptCode()
    {
        return "_" + this.name;
    }
}

/*
Creating semantics that creates ast.
*/
const astBuilder = aelGrammar.createSemantics()
    .addOperation(
        "ast",
        {
            Program(body)
            {
                return new Program(body.ast());
            },

            WhileStatement(_while, _openParen, exp, _closeParen, _openBrace, block, _closeBrace)
            {
                return new While(exp.ast(), block.ast());
            },

            Statement_assign(id, eq, expr, _semicolon)
            {
                return new Assignment(id.sourceString, expr.ast());
            },

            Statement_print(_print, expr, _semicolon)
            {
                return new Print(expr.ast());
            },

            Exp_plus(left, op, right)
            {
                return new BinaryExp(left.ast(), op.sourceString, right.ast());
            },

            Exp_minus(left, op, right)
            {
                return new BinaryExp(left.ast(), op.sourceString, right.ast());
            },

            Term_times(left, op, right)
            {
                return new BinaryExp(left.ast(), op.sourceString, right.ast());
            },

            Term_divide(left, op, right)
            {
                return new BinaryExp(left.ast(), op.sourceString, right.ast());
            },

            PowerTerm_power(left, op, right)
            {
                return new BinaryExp(left.ast(), op.sourceString, right.ast());
            },

            Factor_negate(op, expr)
            {
                return new UnaryExp(op.sourceString, expr.ast());
            },

            Primary_parens(_openParen, expr, _closeParen)
            {
                return expr.ast();
            },

            number(_chars)
            {
                return new NumericalLiteral(+this.sourceString);
            },

            id(_first, _rest)
            {
                return new Identifier(this.sourceString);
            }
        }
    )


/*
    Exporting ast builder.
*/
module.exports = astBuilder;
