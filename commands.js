let roll = require('./commands/roll.js');
let someone = require('./commands/someone.js');
let kick = require('./commands/kick.js');
let ban = require('./commands/ban.js');

// @someone
(function() {
	module.exports.someone = function(message, logger) {
		return someone.someone(message, logger);
	}
}());

// h.ban
(function() {
	module.exports.ban = function(message, logger, targets) {
		return ban.ban(message, logger, targets);
	}
}());

// h.kick
(function() {
	module.exports.kick = function(message, logger, targets) {
		return kick.kick(message, logger, targets);
	}
}());

// h.roll
(function() {
	module.exports.roll = function(message, logger, args) {
		roll.roll(message, logger, args);
	}
}());
