
jest.dontMock('../Actor');

describe('Actor', function() {

	var Actor = require('../Actor'),
		Dispatcher = require('../Dispatcher');

	var actor,
		dispatcher;

	beforeEach(function() {
		dispatcher = new Dispatcher();
		actor = new Actor(dispatcher);
	});

	it('should fire events on dispatcher', function() {
		var action = {message: true};

		actor.fire('tester', 'event', action);

		expect(dispatcher.dispatch.mock.calls.length).toBe(1);
		expect(dispatcher.dispatch.mock.calls[0][0]).toEqual({
			action: action,
			actionType: 'event',
			source: 'tester'
		});

		actor.fire('event', action);

		expect(dispatcher.dispatch.mock.calls.length).toBe(2);
		expect(dispatcher.dispatch.mock.calls[1][0]).toEqual({
			action: action,
			actionType: 'event'
		});

		actor.fire(action);
		
		expect(dispatcher.dispatch.mock.calls.length).toBe(3);
		expect(dispatcher.dispatch.mock.calls[2][0]).toEqual({
			action: action
		});
	});

});
