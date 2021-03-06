/**
 * To find an available socket port.
 * @cite https://gist.github.com/mikeal/1840641
 */

'use strict';

const MODULE_REQUIRE = 1
	/* built-in */
	, net = require('net')

	/* NPM */
	, noda = require('noda')
	, PoC = require('jinang/PoC')

	/* in-package */
	, Range = noda.inRequire('lib/Range')
	;

function seekUsable(portRange, callback) {
	let range = null;
	if (arguments.length == 0 || typeof arguments[0] == 'function') {
		portRange = portRange;
	}
	else {
		range = new Range(portRange);
	}

	return PoC(function FOO(done) {
		let port = range.next();
		if (!port) {
			done(new Error('No free port found.'));
		}
		
		var server = net.createServer();
		server.listen(port, (err) => {
			server.once('close', () => done(null, port));
			server.close();
		});
		server.on('error', (err) => {
			FOO(done);
		});	
	}, callback);
}

module.exports = seekUsable;
