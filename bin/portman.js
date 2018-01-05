#!/usr/bin/env node

'use strict';

const MODULE_REQUIRE = 1
    /* built-in */

    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , seekUsable = noda.inRequire('lib/seekUsable')
    ;

const argv = process.argv.slice(2);

if (argv.length && [ 'seekusable' ].includes(argv[0].toLowerCase())) {
    let rangeCode = argv[1];
    seekUsable(rangeCode).then((port) => {
        console.log(`The minimal usable port is ${port}.`);
    }).catch((err) => {
        console.err(err instanceof Error ? err.message : err);
    })
}
else {
    console.log(noda.inRead('help.txt', 'utf8'));
}