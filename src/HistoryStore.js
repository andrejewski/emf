
"use strict";

var Store = require('./Store');

class HistoryStore extends Store {
	constructor(dispatcher) {
		super(dispatcher);
		this.history = [];
		this._historyIndex = 0;
	}

	undoStateChange(slient) {
		if(this._historyIndex === 0) return false;
		this.state = this.history[this._historyIndex++];
		if(!slient) this.emitChange();
	}

	redoStateChange(slient) {
		if(this._historyIndex === this.history.size) return false;
		this.state = this.history[this._historyIndex++];
		if(!slient) this.emitChange();
	}

	gotoInitalState(slient) {
		this.state = this.history.shift();
		if(!slient) this.emitChange();
	}

	gotoFinalState(slient) {
		this.state = this.history.pop();
		if(!slient) this.emitChange();
	}

	_onDispatch(payload) {
		_mutation(function() {
			super(payload)
		});
	}

	mutation(period) {
		var previous = this.state;
		period();

		if(this._mutationChange(previous, this.state)) {
			this.history.push(previous);
			this._historyIndex++;
		}
	}

	mutationChange(previous, current) {
		return !Object.is(previous, current);
	}
}

module.exports = HistoryStore;

