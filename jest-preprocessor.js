
var react = require('react-tools');

module.exports = {
	process: function(src) {
		return react.transform(src, {harmony: true});
	}
};
