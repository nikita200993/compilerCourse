const Path = require("path");
const aelGrammar = require(Path.resolve(__dirname, "lessonOne.js"));

const memory = new Map();
const interpreter = aelGrammar.createSemantics().addOperation(
    "exec",
    {
        Program(ss)
        {
            ss.exec();
        },

        Statement_assign(id, _op, expr, _semiColon)
        {
            memory.set(id.sourceString, expr.eval());
        },

        Statement_print(_printNode, expr, _semiColon)
        {
            console.log(expr.eval());
        }
    }
).addOperation(
    "eval",
    {
        Exp_plus(e, _op, t)
        {
            return e.eval() + t.eval();
        },

        Exp_minus(e, _op, t)
        {
            return e.eval() - t.eval();
        },

        Term_times(t, _op, f)
        {
            return t.eval() * f.eval();
        },

        Term_divide(t, _op, f)
        {
            if (+f == 0) throw new Error("Zero division")
            return t.eval() / f.eval();
        },

        Factor_negate(_op, primary)
        {
            return -primary.eval();
        },

        Primary_parens(_open, expr, _close)
        {
            return expr.eval();
        },

        number(_chars)
        {
            return +this.sourceString;
        },

        id(_char, _rest)
        {
            return memory.get(this.sourceString);
        }
    }
);

const extendedInterpreter = aelGrammar.extendSemantics(interpreter);
extendedInterpreter.extendOperation(
    "exec",
    {
        WhileStatement(
            _while,
            _parenOpen,
            exp,
            _parenClose,
            _brackOpen,
            body,
            _brackClose)
        {
            while (exp.eval() > 0) {
                body.exec();
            }
        },
    }
)
extendedInterpreter.extendOperation(
    "eval",
    {
        PowerTerm_power(left, _op, right)
        {
            return left.eval() ** right.eval();
        }
    }
)

module.exports = {
    extendedInterpreter : extendedInterpreter,
    memory : memory
}