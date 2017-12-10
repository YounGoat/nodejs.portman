'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    , assert = require('assert')

    /* NPM */
    , noda = require('noda')
    
    /* in-package */
    , seekUsable = noda.inRequire('lib/seekUsable')
    ;

describe('seekUsable', () => {
    it('seek >=80', (done) => {
        seekUsable('>=80', (err, port) => {
            assert(port);
            done();
        });
    });

});