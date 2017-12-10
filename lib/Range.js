'use strict';

const MODULE_REQUIRE = 1
    /* built-in */
    
    /* NPM */
    
    /* in-package */

    /* in-file */
    , papply = function(fn /* , predefined_argument, ... */) {
        let predetermined = Array.from(arguments).slice(1);
        return function() {
            let remainders = Array.from(arguments);
            let args = predetermined.concat(remainders);
            return fn.apply(this, args);
        };
    }

    , coverFn = {
        '!=': (rangePort, realPort) => realPort != rangePort,
        '>=': (rangePort, realPort) => realPort >= rangePort,
        '<=': (rangePort, realPort) => realPort <= rangePort,
        '>' : (rangePort, realPort) => realPort >  rangePort,
        '<' : (rangePort, realPort) => realPort <  rangePort,
        '=' : (rangePort, realPort) => realPort == rangePort,
    }
    ;

function PortRange(rangeCode) {
    if (rangeCode instanceof PortRange) return rangeCode;

    let orRangeJudgers = [];
    
    rangeCode.trim().split(/\|\||,/).forEach((code) => {
        code = code.trim().replace(/([!>=<])\s+/g, '$1').replace(/\s*-\s*/g, '-');
        let fns = [];
        let parts = code.split(/\s+/);
        for (let i = 0; i < parts.length; i++) {
            let part = parts[i];
            let comparator = null;
            [ '!=', '>=', '<=', '>', '<', '=' ].every((sign) => {
                if (part.startsWith(sign)) {
                    comparator = sign;
                }
                return !comparator;
            });

            if (comparator) {
                let rangePort = part.substr(comparator.length);
                if (!/^\d+$/.test(rangePort)) {
                    throw new Error(`Invalid port number: ${rangePort}`);
                }
                fns.push(papply(coverFn[comparator], rangePort));
            }
            else if (/^(\d+)-(\d+)$/.test(part)) {
                fns.push(
                    // This is an IIFE and the return value is an array function.
                    ( (a, b) => /*return*/ (port) => port >= a && port <= b )
                    (parseInt(RegExp.$1), parseInt(RegExp.$2))
                );
            }
            else {
                if (!/^\d+$/.test(part)) {
                    throw new Error(`Invalid port number: ${part}`);
                }
                orRangeJudgers.push(part);
            }
        }
        if (fns.length) {
            orRangeJudgers.push(fns);
        }
    });

    Object.assign(this, { orRangeJudgers, cursor: 0 });
}

/**
 * Whether the range covers the port.
 * @param  {string|number} port
 * @return boolean
 */
PortRange.prototype.covers = function(port) {
    let found = false;
    this.orRangeJudgers.every((judger) => {
        if (judger instanceof Array) {
            let matched = true;
            judger.every(fn => matched = fn(port));
            found = matched;
        }
        else {
            found = (judger == port);
        }
        return !found;
    });
    return found;
};

/**
 * Find the next port in the range.
 * @param  {string|number} [last] begin from the last port (excluded)
 * @return boolean
 */
PortRange.prototype.next = function(last) {
    let port = null;
    if (last) {
        this.cursor = last;
    }
    while (this.cursor < 65536) {
        this.cursor++;
        if (this.covers(this.cursor)) {
            port = this.cursor;
            break;
        }
    }
    return port;
};

PortRange.prototype.reset = function() {
    this.cursor = 0;
};

module.exports = PortRange;