const Os = require("os");

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
        const prefix = declaredIds.has(this.id) ? "" : "var ";
        declaredIds.add(this.id);
        return `${indent}${prefix}_${this.id} = ${
            this.expression.generateJavaScriptCode(Operator.NOP)
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
        return `${indent}console.log(${this.expression.generateJavaScriptCode(Operator.NOP)});`;
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
        return `${indent}while (${this.condition.generateJavaScriptCode(Operator.NOP)} > 0) {`
            + Os.EOL
            + this.body.map(
                (value, index, array) => value.generateJavaScriptCode(declaredIds, indent + "    ")
            ).join(Os.EOL)
            + Os.EOL
            + `${indent}}`;
    }
}

class Operator
{

    static get NOP() {
        return 0;
    }

    get priority()
    {
        throw new Error("Unsupported operation");
    }

    get name()
    {
        throw new Error("Unsupported operation");
    }
}

class BinaryExp extends Operator
{

    constructor(left, right)
    {
        super();
        Object.assign(this, { left, right });
    }

    analyze(context)
    {
        this.left.analyze(context);
        this.right.analyze(context);
    }

    generateJavaScriptCode(priority)
    {
        const mainContent = `${this.left.generateJavaScriptCode(this.priority)} ${this.name} ${
            this.right.generateJavaScriptCode(this.priority)
            }`;
        return this.priority >= priority ? mainContent : `(${mainContent})`;
    }

    eval()
    {
        throw new Error("Unsupported operation");
    }
}

class UnaryExp extends Operator
{

    constructor(operand)
    {
        super();
        this.operand = operand;
    }

    analyze(context)
    {
        this.operand.analyze(context);
    }

    generateJavaScriptCode(priority)
    {
        const mainContent = `${this.name}${this.operand.generateJavaScriptCode(this.priority)}`;
        return this.priority >= priority ? mainContent : `(${mainContent})`;
    }

    eval()
    {
        throw new Error("Unsupported operation");
    }
}

class PlusExpression extends BinaryExp
{

    constructor(left, right)
    {
        super(left, right);
    }

    get priority()
    {
        return 1;
    }

    get name()
    {
        return "+";
    }

    eval()
    {
        return this.left.eval() + this.right.eval();
    }
}

class MinusExpression extends BinaryExp
{

    constructor(left, right)
    {
        super(left, right);
    }

    get priority()
    {
        return 1;
    }

    get name()
    {
        return "-";
    }

    eval()
    {
        return this.left.eval() - this.right.eval();
    }
}

class MultiplicationExpression extends BinaryExp
{

    constructor(left, right)
    {
        super(left, right);
    }

    get priority()
    {
        return 2;
    }

    get name()
    {
        return "*";
    }

    eval()
    {
        return this.left.eval() * this.right.eval();
    }
}

class DivisionExpression extends BinaryExp
{

    constructor(left, right)
    {
        super(left, right);
    }

    get priority()
    {
        return 2;
    }

    get name()
    {
        return "/";
    }

    eval()
    {
        return this.left.eval() / this.right.eval();
    }
}

class PowerExpression extends BinaryExp
{

    constructor(left, right)
    {
        super(left, right);
    }

    get priority()
    {
        return 3;
    }

    get name()
    {
        return "**";
    }

    eval()
    {
        return this.left.eval() ** this.right.eval();
    }
}

class UnaryMinusExpression extends UnaryExp
{

    constructor(operand)
    {
        super(operand);
    }

    get priority()
    {
        return 4;
    }

    get name()
    {
        return "-";
    }

    eval()
    {
        return -this.operand.eval();
    }
}



class NumericalLiteral
{

    constructor(value)
    {
        this.value = value;
    }

    analyze(context) { };

    generateJavaScriptCode(_priority)
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

    generateJavaScriptCode(_priority)
    {
        return "_" + this.name;
    }
}


class ExpressionFactory
{

    static createUnaryExpr(op, operand)
    {
        if (op == "-") {
            return new UnaryMinusExpression(operand);
        }
        throw new Error("Illegal operation");
    }

    static createBinaryExpr(op, left, right)
    {
        switch (op) {
            case "+":
                return new PlusExpression(left, right);
            case "-":
                return new MinusExpression(left, right);
            case "*":
                return new MultiplicationExpression(left, right);
            case "/":
                return new DivisionExpression(left, right);
            case "**":
                return new PowerExpression(left, right);
            default:
                throw new Error("Illegal operation");
        }
    }
}

module.exports = {

    Program: Program,

    Assignment: Assignment,

    Print: Print,

    While: While,

    ExpressionFactory: ExpressionFactory,

    NumericalLiteral: NumericalLiteral,

    Identifier: Identifier
}
