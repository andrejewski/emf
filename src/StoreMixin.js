
"use strict";

function StoreMixin(stores, pure, fn) {
	if(!fn) {
		fn = pure;
		pure = false;
	}

	var mutate = pure
		? function(ctx, obj) {ctx.replaceState(obj);}
		: function(ctx, obj) {ctx.setState(obj);}

	return {
		getInitialState: function() {
			return fn(this.props);
		},

		componentDidMount: function() {
			var _this = this;
			stores.forEach(function(store) {
				store.addChangeListener(_this._onChange);
			});
		},

		componentWillUnmount: function() {
			var _this = this;
			stores.forEach(function(store) {
				store.removeChangeListener(_this._onChange);
			});
		},

		componentWillReceiveProps: function(nextProps) {
			if(this.isMounted()) mutate(this, fn(nextProps));
		},

		_onChange: function() {
			mutate(this, fn(this.props));
		}
	};
}

module.exports = StoreMixin;
