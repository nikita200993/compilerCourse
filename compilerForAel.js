const Path = require("path");
const aelGrammar = require(Path.resolve(__dirname, "grammars", "ael.js"));
const {Program, Assignment, Print, While, Identifier, NumericalLiteral, ExpressionFactory} = require("./ast.js");
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
                return ExpressionFactory.createBinaryExpr(op.sourceString, left.ast(), right.ast());
            },

            Exp_minus(left, op, right)
            {
                return ExpressionFactory.createBinaryExpr(op.sourceString, left.ast(), right.ast());
            },

            Term_times(left, op, right)
            {
                return ExpressionFactory.createBinaryExpr(op.sourceString, left.ast(), right.ast());
            },

            Term_divide(left, op, right)
            {
                return ExpressionFactory.createBinaryExpr(op.sourceString, left.ast(), right.ast());
            },

            PowerTerm_power(left, op, right)
            {
                return ExpressionFactory.createBinaryExpr(op.sourceString, left.ast(), right.ast());
            },

            Factor_negate(op, expr)
            {
                return ExpressionFactory.createUnaryExpr(op.sourceString, expr.ast());
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
