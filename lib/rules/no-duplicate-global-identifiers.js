/**
 * @fileoverview Disallows functions and variables with the same name across all files
 * @author Chuck Wilson
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const declarations = {};

module.exports = {
    meta: {
        docs: {
            description: "Disallows functions and variables with the same name across all files",
            category: "Variables",
            recommended: false,
        },
        messages: {
            duplicateName: "Identifier '{{ duplicateName }}' already defined at " +
                "{{ origFilename }} line {{ origLine }} column {{ origColumn }}",
        },
        schema: [],
        type: 'problem',
    },

    create: function(context) {

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        const relativeOrAbsoluteFilename = (cwd, filename) => {
            if (filename.startsWith(cwd)) {
                return filename.replace(cwd, '.');
            }
            return filename;
        };

        const testIdentifier = (n) => {
            if (n.id) {
                if (declarations[n.id.name]) {
                    const origColumn = declarations[n.id.name].column;
                    const origFilename = declarations[n.id.name].filename;
                    const origLine = declarations[n.id.name].line;
                    context.report({
                        data: {
                            duplicateName: n.id.name,
                            origColumn,
                            origFilename,
                            origLine,
                        },
                        messageId: 'duplicateName',
                        loc: n.loc,
                    });
                    // keep original definition
                    return;
                }
                const filename = relativeOrAbsoluteFilename(
                    context.getCwd(),
                    context.getFilename(),
                );
                declarations[n.id.name] = {
                    column: n.loc.start.column,
                    filename,
                    line: n.loc.start.line,
                };
            }
        };

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            onCodePathStart: function (codePath, node) {
                // at the start of analyzing a code path
                // console.log(context.getSourceCode());
            },
            Program: function (node) {
                // console.log(node.sourceType);
                node.body.forEach((n) => {
                    if (n.declarations) {
                        n.declarations.forEach(testIdentifier);
                    } else {
                        testIdentifier(n);
                    }
                });
            },
        };
    },
};
