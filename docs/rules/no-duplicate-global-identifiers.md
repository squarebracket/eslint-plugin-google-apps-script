# Disallows functions and variables with the same name across all files (no-duplicate-global-identifiers)

Google Apps Script works in a weird way; separate files are in fact all
concatenated together such that they share a global scope. This rule checks
that there aren't any duplicated identifiers across many files, as normally
these would exist in separate scopes.


## Rule Details

This rule detects duplicated identifiers across the top-level scope of all
files.

Examples of **incorrect** code for this rule:

```js
// src/one.js
const someVariable = 'some value';

// src/two.js
const someVariable = 'some other value';
```

Examples of **correct** code for this rule:

```js
// src/one.js
const oneVariable = 'some value';

// src/two.js
const twoVariable = 'some other value';
```

