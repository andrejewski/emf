
jest.dontMock('../Dispatcher');

describe('Dispatcher', function() {

	var Dispatcher = require('../Dispatcher');

	var dispatcher;

	beforeEach(function() {
		dispatcher = new Dispatcher();
	});

	it('should accept Store classes in #waitFor()', function(done) {
		var action = {};

		var cbUno = function handle(payload) {
			dispatcher.waitFor(storeDos);
			expect(payload).toBe(action);
			done();
		};
		var tokenUno = dispatcher.register(cbUno);
		var storeUno = {_dispatchToken: tokenUno};

		var cbDos = jest.genMockFunction();
		var tokenDos = dispatcher.register(cbDos);
		var storeDos = {_dispatchToken: tokenDos};

		dispatcher.dispatch(action);
	});

});
