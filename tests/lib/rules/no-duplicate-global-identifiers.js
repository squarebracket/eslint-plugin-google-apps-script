/**
 * @fileoverview Disallows functions and variables with the same name across all files
 * @author Chuck Wilson
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/no-duplicate-global-identifiers"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var invalidCode = `
var someVar = 'some-val';
var someVar = 'some-other-val';
`;

var ruleTester = new RuleTester();
ruleTester.run("no-duplicate-global-identifiers", rule, {
    valid: [
        {
            code: "var myVar = 'some-val';",
        },
        {
            code: [
                "var one = 'some-val';",
                "var two = 'some-val';",
            ],
        },
    ],
    // This isn't really a real test, it needs to be split into two files (or,
    // more specifically, two different `Program`s).
    invalid: [
        {
            code: [
                `var someVar = 'some-val';`,
                `var someVar = 'some-other-val';`,
                `var someVar = 'last';`
            ],
            errors: [{
                messageId: "duplicateName",
                data: {
                    duplicateName: 'someVar',
                    origColumn: 4,
                    origFilename: '<input>',
                    origLine: 1,
                },
            }, {
                messageId: "duplicateName",
                data: {
                    duplicateName: 'someVar',
                    origColumn: 4,
                    origFilename: '<input>',
                    origLine: 1,
                },
            }],
        },
    ],
});
