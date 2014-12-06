
"use strict";

var FluxDispatcher = require('flux').Dispatcher;

class Dispatcher extends FluxDispatcher {

	waitFor(ids) {
		super(ids.map(function(id) {
			return id._dispatchToken || id;
		}));
	}

}

module.exports = Dispatcher;
