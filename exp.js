const Ohm = require("ohm-js");
require("./lessonOne.js")

Ohm.grammar(`AelExtended <: Ael {
    Statement += while "(" Exp ")" "{" (Statement ";")+ "}"
    while = "while" ~alnum
    id := ~print ~while letter alnum*
}`)