const Path = require("path");
const aelGrammar = require(Path.resolve(__dirname, "lessonOne.js"));

class Program
{

    constructor(body)
    {
        this.body = body;
    }
}

class Assignment
{

    constructor(id, expression)
    {
        this.id = id;
        this.expression = expression;
    }
}

class Print
{

    constructor(expression)
    {
        this.expression = expression;
    }
}

class While
{

    constructor(condition, body)
    {
        this.condition = condition;
        this.body = body;
    }
}

class BinaryExp
{

    constructor(left, op, right)
    {
        Object.assign(this, { left, op, right });
    }
}

class UnaryExp
{

    constructor(op, operand)
    {
        this.op = op;
        this.operand = operand;
    }
}

class NumericalLiteral
{

    constructor(value)
    {
        this.value = value;
    }
}

class Identifier
{

    constructor(name)
    {
        this.name = name;
    }
}

const astBuilder = aelGrammar.createSemantics()
    .addOperation(
        "ast",
        {
            Program(body) {
                return body.ast();
            },
            
            Statement_assign(id, eq, expr, _semicolon) {
                return new Assignment(id.sourceString, expr.ast());
            },

            Statement_print(_print, expr, _semicolon) {
                return new Print(expr.ast());
            },

            Exp_plus(left, op, right) {
                return new BinaryExp(left.ast(), op, right.ast());
            },

            Exp_minus(left, op, right) {
                return new BinaryExp(left.ast(), op, right.ast());
            },

            Term_times(left, op, right) {
                return new BinaryExp(left.ast(), op, right.ast());
            },

            Term_divide(left, op, right) {
                return new BinaryExp(left.ast(), op, right.ast());
            },

            PowerTerm_power(left, op, rigth) {
                return BinaryExp(left.ast(), op, right.ast());
            },

            Factor_negate(op, expr) {
                return new UnaryExp(op, expr.ast());
            },

            Primary_parens(_openParen, expr, _closeParen) {
                return new expr.ast();
            },

            number(_chars) {
                return new NumericalLiteral(+this.sourceString);
            },

            id(_first, _rest) {
                return new Identifier(this.sourceString);
            }
        }
    )