const expect = require("chai").expect;
const aelGrammar = require("../lessonOne.js")
const interpreterModule = require("../interpreter.js");
const interpreter = interpreterModule.extendedInterpreter;
const memory = interpreterModule.memory;

describe(
    "aelInterpreter test.",
    function ()
    {
        it(
            "checking while loop...",
            function ()
            {
                const match = aelGrammar.match(`
                    i = 3;
                    j = 0;
                    print i;
                    while (i + 1) {
                        i = i - 1;
                        j = j + i;
                    }
                    print j;
                `);
                expect(match.succeeded()).to.be.true;
                interpreter(match).exec();
                console.log(memory);
            }
        )
    }
)