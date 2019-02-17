let roll = require('./commands/roll.js');

(function() {
	module.exports.roll = function(logger, userID, args) {
		return roll.roll(logger, userID, args);
	}
}());
