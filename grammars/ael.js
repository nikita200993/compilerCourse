const Ohm = require("ohm-js");

const aelGrammar = Ohm.grammar(`Ael {
    Program        = (Statement  | WhileStatement)+
    Statement      = id "=" Exp ";"                                           --assign
                   | print Exp ";"                                            --print
    WhileStatement = while "(" Exp ")" "{" (Statement  | WhileStatement)+ "}"
    Exp            = Exp "+" Term                                             --plus
                   | Exp "-" Term                                             --minus
                   | Term
    Term           = Term "*" PowerTerm                                       --times
                   | Term "/" PowerTerm                                       --divide
                   | PowerTerm
    PowerTerm      = Factor "**" PowerTerm                                    --power
                   | Factor
    Factor         = "-" Primary                                              --negate
                   | Primary
    Primary        = "(" Exp ")"                                              --parens
                   | number
                   | id
    number         = digit+
    print          = "print" ~alnum
    while          = "while" ~alnum
    id             = ~(print | while) letter alnum*
  }`);
  
module.exports = aelGrammar;