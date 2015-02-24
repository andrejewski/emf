
"use strict";

var EventEmitter = require('events').EventEmitter;

var changeEvent = 'change';

function cap(str) {
	return str.charAt(0).toUpperCase()+str.slice(1);
}

class Store extends EventEmitter {
	constructor(dispatcher) {
		if(dispatcher) {
			this._dispatcher = dispatcher;
			this._dispatchFunc = this._onDispatch.bind(this);
			this._dispatchToken = dispatcher.register(this._dispatchFunc);
		}
		this.state = this.getInitialState();
	}

	// @override
	getInitialState() {
		return {};
	}

	// @override
	onDispatch(payload, dispatcher) {}

	addChangeListener(callback) {
		this.addListener(changeEvent, callback);
	}

	removeChangeListener(callback) {
		this.removeListener(changeEvent, callback);
	}

	emitChange() {
		this.emit(changeEvent);
	}

	_onDispatch(payload) {
		var dispatcher = this._dispatcher;
		if(payload.source) {
			var fname = "on"+cap(payload.source)+"Source";
			if(this[fname]) this[fname](payload, dispatcher);
		}
		if(payload.actionType) {
			var fname = "on"+cap(payload.actionType)+"Action";
			if(this[fname]) this[fname](payload, dispatcher);
		}
		this.onDispatch(payload, dispatcher);
	}

	toJSON() {
		return this.state;
	}
}

module.exports = Store;
