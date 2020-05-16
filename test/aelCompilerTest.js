const expect = require("chai").expect;
const aelGrammar = require("../lessonOne.js")
const interpreterModule = require("../interpreter");
const astBuilder = require("../compilerForAel")
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
                    while (i + 1) {
                        i = i - 1;
                        j = j + i;
                    }
                `);
                expect(match.succeeded()).to.be.true;
                interpreter(match).exec();
                expect(memory.get("j")).equal(2);
            }
        )
    }
)

describe(
    "aelCompilerTest",
    function ()
    {
        it(
            "checking ast building",
            function ()
            {
                const match = aelGrammar.match(`
                    i = 4;
                    while (i) {
                        print i;
                        i = i - 1;
                        a = i ** 2 * 3 + 4 * (5 + 6) * j;
                        print a;
                    }
                `)
                expect(match.succeeded()).to.be.true;
                expect(() => astBuilder(match).ast().analyze()).to.Throw(
                    Error,
                    "Identifier j has not been declared."
                )
            }
        )
    }
)