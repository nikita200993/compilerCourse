const Ohm = require("ohm-js");
const IkiGrammar = require("../grammars/iki.js");

function _throw()
{
    throw new Error("Unsupported operation exception");
}

class Program
{

    constructor(body)
    {
        this.body = body
    }
}

class AssignmentStmt
{

    constructor(id, expr)
    {
        this.id = id;
        this.expr = expr;
    }
}

class DeclarationStmt
{

    constructor(id, type)
    {
        this.id = id;
        this.type = type;
    }
}

class ReadStmt
{

    constructor(varExprList)
    {
        this.varExprList = varExprList;
    }
}

class WriteStmt
{

    constructor(exprList)
    {
        this.exprList = exprList;
    }
}

class WhileStmt
{

    constructor(condition, block)
    {
        this.condition = condition;
        this.block = block;
    }
}

class Type
{
    constructor(name)
    {
        this.name = name;
    }

    static forName(str)
    {
        switch (str) {
            case "int":
                return INT;
            case "bool":
                return BOOL;
            default:
                throw new Error("Not a type");
        }
    }

    static areBooleanOperands(leftOperandType, rightOperandType) {
        return leftOperandType == Type.BOOL && rightOperandType == Type.BOOL;
    }

    static areIntOperands(leftOperandType, rightOperandType) {
        return leftOperandType == Type.INT && rightOperandType == Type.INT;
    }
    
    static areAnyOperands(leftOperandType, rightOperandType) {
        return true;
    }
    
    static isBoolOperand(operandType) {
        return operandType == Type.BOOL;
    }
    
    static isIntOperand(operandType) {
        return operandType == Type.BOOL;
    }

    toString()
    {
        return this.name;
    }
}

Type.INT = new Type("int");
Type.BOOL = new Type("bool");

class Expression
{

    constructor()
    {
        _throw();
    }

    get precendence()
    {
        _throw();
    }

    get type()
    {
        if (!this.type) {
            throw new Error("Infer type before calling getter");
        } else {
            return this.type;
        }
    }


    inferType(idsToType)
    {
        _throw();
    }
}

class UnaryExpression extends Expression
{

    constructor(expr, op)
    {
        this.expr = expr;
        this.op = op;
    }

    get precendence()
    {
        return this.op.precendence;
    }

    // override if operator changes type
    inferType(idsToType)
    {
        this.type = this.op.getResultType();
        this.expr.inferType(idsToType);
        return this.type;
    }

    checkType()
    {
        if (!this.type) {
            throw new Error("Infer types before doing type check");
        } else if (!this.op.isAppliciableTo(this.expr.type)) {
            throw new Error(`${this.op} can't be applied to type ${this.expr.type}`)
        }
    }
}

class BinaryExpression extends Expression
{

    constructor(leftOperand, rightOperand, op)
    {
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
        this.op = op;
    }

    get precendence()
    {
        return this.op.precendence;
    }

    inferType(idsToType)
    {
        this.leftOperand.inferType(idsToType);
        this.rightOperand.inferType(idsToType);
        this.type = this.op.getResultType();
        return this.type;
    }

    checkType()
    {
        if (!this.op.isAppliciableTo(this.leftOperand.type, this.rightOperand.type)) {
            throw new Error(
                `${this.op} can't be applied to type (${this.leftOperand.type}, ${this.rightOperand.type})`
            );
        }
    }
}

class VarExpression extends Expression
{

    constructor(id)
    {
        this.id = id;
    }

    get precendence()
    {
        Operator.getHighestPrecendence();
    }

    inferType(idsToType)
    {
        if (!idsToType[this.id]) {
            throw new Error(`Identifier = ${this.id} is used before declaration`)
        }
        this.type = idsToType[this.id];
    }
}

class IntLiteral extends Expression
{

    constructor(value)
    {
        this.value = value;
        this.type = Type.INT;
    }

    get precendence()
    {
        Operator.getHighestPrecendence();
    }

    inferType(idsMap)
    {
        this.type;
    }
}

class BoolLiteral extends Expression
{

    constructor(value)
    {
        this.value = value;
        this.type = Type.BOOL;
    }

    get precendence()
    {
        Operator.getHighestPrecendence();
    }

    inferType(idsMap)
    {
        return this.type;
    }
}

class Operator
{

    constructor(name, precendence)
    {
        this.name = name;
        this.precendence = precendence;
        this.resultType = Type.INT;
    }

    static getHighestPrecendence()
    {
        return 7;
    }

    static getBinaryOperationForName(name)
    {
        switch (name) {
            case Operator.OR.name:
                return Operator.OR;
            case Operator.AND.name:
                return Operator.AND;
            case Operator.EQ, name:
                return Operator.EQ;
            case Operator.NEQ.name:
                return Operator.NEQ;
            case Operator.LE.name:
                return Operator.LE;
            case Operator.LEQ.name:
                return Operator.LEQ;
            case Operator.RE.name:
                return Operator.RE;
            case Operator.REQ.name:
                return Operator.REQ;
            case Operator.ADD.name:
                return Operator.ADD;
            case Operator.SUB.name:
                return Operator.SUB;
            case Operator.MUL.name:
                return Operator.MUL;
            case Operator.DIV.name:
                return Operator.DIV;
            case Operator.REM.name:
                return Operator.REM;
            default:
                throw new Error(`No binary operator for symbol ${name}`);
        }
    }

    static getUnaryOperatorForName(name)
    {
        switch (name) {
            case Operator.MINUS.name:
                return Operator.MINUS;
            case Operator.NOT.name:
                return Operator.NOT;
            default:
                throw new Error(`No unary operator for symbol ${name}`);
        }
    }

    getPrecendence()
    {
        this.precendence;
    }

    getResultType()
    {
        return this.resultType;
    }

    isAppliciableTo(leftOperandType, rightOperandType) {
        if (leftOperandType == Type.INT && rightOperandType == Type.INT) {
            return true;
        } else {
            return false;
        }
    }
}

Operator.OR = new Operator("or", 1);
Operator.AND = new Operator("and", 2);
Operator.EQ = new Operator("==", 3);
Operator.NEQ = new Operator("!=", 3);
Operator.LE = new Operator(">", 3);
Operator.LEQ = new Operator(">=", 3);
Operator.RE = new Operator("<", 3);
Operator.REQ = new Operator("<=", 3);
Operator.ADD = new Operator("+", 4);
Operator.SUB = new Operator("-", 4);
Operator.MUL = new Operator("*", 5);
Operator.DIV = new Operator("/", 5);
Operator.REM = new Operator("%", 5);
Operator.NOT = new Operator("not", 6);
Operator.MINUS = new Operator("-", 6);
Operator.TOP = 7

Operator.OR.resultType = Type.BOOL;
Operator.AND.resultType = Type.BOOL;
Operator.NOT.resultType = Type.BOOL;
Operator.EQ.resultType = Type.BOOL;
Operator.NEQ.resultType = Type.BOOL;
Operator.LE.resultType = Type.BOOL;
Operator.LEQ.resultType = Type.BOOL;
Operator.RE.resultType = Type.BOOL;
Operator.REQ.resultType = Type.BOOL;

Operator.OR.isAppliciableTo = Type.areBooleanOperands;
Operator.AND.isAppliciableTo = Type.areBooleanOperands;
Operator.EQ.isAppliciableTo = Type.areAnyOperands;
Operator.NEQ.isAppliciableTo = Type.areAnyOperands;
Operator.NOT.isAppliciableTo = Type.isBoolOperand;
Operator.MINUS.isAppliciableTo = Type.isIntOperand;
