const expect = require("chai").expect;
const aelGrammar = require("../grammars/ael.js")
const astBuilder = require("../compilerForAel")

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

        it(
            "checking js code generator 1...",
            function ()
            {
                const match = aelGrammar.match(
                    `
                    i = 3;
                    while (i) {
                        i = i - 1;
                        j = i ** i;
                        print i;
                        while (j) {
                            j = j - 1;
                            print j ** i;
                        }
                    }
                    print j;`
                );
                expect(match.succeeded()).to.be.true;
                const ast = astBuilder(match).ast();
                expect(() => ast.analyze()).not.Throw(Error);
                const jsCode = ast.generateJavaScriptCode();
                expect(jsCode).equal(
                    `var _i = 3;
while (_i > 0) {
    _i = _i - 1;
    var _j = _i ** _i;
    console.log(_i);
    while (_j > 0) {
        _j = _j - 1;
        console.log(_j ** _i);
    }
}
console.log(_j);`)
            }
        )
        it(
            "checking js code generator 2...",
            function ()
            {
                const match = aelGrammar.match(
                    `
                    i = 3;
                    while (i) {
                        i = i - 1;
                        j = i ** i;
                        print (i + j) ** (2 / i * (j + 1));
                    }`
                );
                expect(match.succeeded()).to.be.true;
                const ast = astBuilder(match).ast();
                expect(() => ast.analyze()).not.Throw(Error);
                const jsCode = ast.generateJavaScriptCode();
                expect(jsCode).equal(
                    `var _i = 3;
while (_i > 0) {
    _i = _i - 1;
    var _j = _i ** _i;
    console.log((_i + _j) ** (2 / _i * (_j + 1)));
}`
                )
            }
        )
    }
)