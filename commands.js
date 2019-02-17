let roll = require('./commands/roll.js');
let someone = require('./commands/someone.js');

(function() {
	module.exports.roll = function(logger, userID, args) {
		return roll.roll(logger, userID, args);
	}
}());

(function() {
	module.exports.someone = function(logger, client, message) {
		return someone.someone(logger, client, message);
	}
}());
