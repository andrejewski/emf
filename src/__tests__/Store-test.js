
jest.dontMock('../Store');
jest.dontMock('../Dispatcher');
jest.dontMock('events');

jest.autoMockOff();
__DEV__ = true;

describe('Store', function() {

	var Store = require('../Store'),
		Dispatcher = require('../Dispatcher');

	var store,
		dispatcher;

	beforeEach(function() {
		dispatcher = new Dispatcher();
		store = new Store(dispatcher);
	});

	it('should set initial state', function() {
		expect(store.state).toEqual(store.getInitialState());
	});

	it('should handle all payloads through #onDispatch()', function() {
		var pay1 = {sat: 1890},
			pay2 = {act: 'Kevin Spacey'};

		var cb = store.onDispatch = jest.genMockFunction();
		dispatcher.dispatch(pay1);
		dispatcher.dispatch(pay2);

		expect(cb.mock.calls.length).toBe(2);
		expect(cb.mock.calls[0][0]).toBe(pay1);
		expect(cb.mock.calls[1][0]).toBe(pay2);
	});

	it('should bucket certain payloads to methods', function() {
		var pay1 = {source: 'view', sat: 1890},
			pay2 = {actionType: 'view', act: 'Kevin Spacey'};

		store.onViewSource = jest.genMockFunction();
		store.onViewAction = jest.genMockFunction();

		dispatcher.dispatch(pay1);
		expect(store.onViewSource.mock.calls.length).toBe(1);
		expect(store.onViewSource.mock.calls[0][0]).toBe(pay1);

		dispatcher.dispatch(pay2);
		expect(store.onViewAction.mock.calls.length).toBe(1);
		expect(store.onViewAction.mock.calls[0][0]).toBe(pay2);
	});

	it('should handle change listeners correctly', function() {
		var listener = jest.genMockFunction();
		store.addChangeListener(listener);
		store.emitChange();
		expect(listener.mock.calls.length).toBe(1);

		store.removeChangeListener(listener);
		store.emitChange();
		expect(listener.mock.calls.length).toBe(1);
	});

	it('should return plain state via #toJSON()', function() {
		expect(store.state).toBe(store.toJSON());
	});

});