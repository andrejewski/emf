
"use strict";

class Actor {
	constructor(dispatcher) {
		this._dispatcher = dispatcher;
	}

	fire(source, actionType, action) {
		this._dispatch(this._package(source, actionType, action));
	}

	_package(source, actionType, action) {
		if(action === void 0) {
			if(actionType === void 0) {
				action = source;
				actionType = source = null;
			} else {
				action = actionType;
				actionType = source;
				source = null;
			}
		}
		var payload = {action: action};
		if(source) payload.source = source;
		if(actionType) payload.actionType = actionType;
		return payload;
	}

	_dispatch(payload) {
		this._dispatcher.dispatch(payload);
	}
}

module.exports = Actor;
