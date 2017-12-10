#	portman
__Socket port manager.__

##	Table of contents

*	[Get Started](#get-started)
*	[API](#api)
* 	[Examples](#examples)
*	[Why portman](#why-portman)
*	[Honorable Dependents](#honorable-dependents)
*	[About](#about)
*	[References](#references)

##	Links

*	[CHANGE LOG](./CHANGELOG.md)
*	[Homepage](https://github.com/YounGoat/nodejs.portman)

##	Get Started

```javascript
const portman = require('portman');

// Seek a useable port within specified ranges.
portman.seekUsable('80 8080 >=9000', (err, port) => {
    // ...
});

const range = new portman.PortRange('7000-8000');
range.covers(7000); // true
range.covers(7001); // true
range.covers(7999); // true
range.covers(8000); // true
range.covers(8001); // false

range.next(); // 7000
range.next(); // 7001

range.next(7600); // 7601
```

##	API

### portman.PortRange

```javascript
const range = new portman.PortRange(rangeCode);
```

The *rangeCode* may be in forms of the followings:  
*   single port  
    `'8080'`
*   ports  
    `'80 443 8080 8443'`
*   port prefixed with comparator  
    `'!=8080'`  
    `'>=8000'`  
    ...  
*   hyphenated ports  
    `'7000 - 8000'`
*   combination of previous  
    `'8080 8443 >=9000'`  
    `'<4000 || >=6000'`  

Methods of class `portman.PortRange`:
*   boolean __range.covers__(string|number *port*)  
    To judge whether the range covers the port.

*   number|null __range.next__()  
    To find the next port in the range.  
    ATTENTION: This method is NOT idempotent.

### portman.seekUsable

This method is used to seek a usable port in the specified range. The word "usable" means the port to seek is both free and avaiable for current user.

```javascript
portman.seekUsable(portRange)
    .then((port) => {
        // ...
    });
```
This is a [PoC](https://www.npmjs.com/package/jinang#poc) method.

##  Examples

Read the unit tests for examples of __portman__:  
*   [portman.PortRange](./test/Range.js)
*   [portman.seekUsable](./test/seekUsable.js)

##  Why *portman*

##  Honorable Dependents

Welcome to be honorable dependents of __portman__!

##  About

For convenience, this package has following names (alias):

*   [portman](https://www.npmjs.com/package/portman)

##  References