let roll = require('./commands/roll.js');
let someone = require('./commands/someone.js');
let kick = require('./commands/kick.js');
let ban = require('./commands/ban.js');

// h.roll
(function() {
	module.exports.roll = function(logger, args) {
		return roll.roll(logger, args);
	}
}());

// @someone
(function() {
	module.exports.someone = function(logger, message) {
		return someone.someone(logger, message);
	}
}());

// h.kick
(function() {
	module.exports.kick = function(logger, targets, channel) {
		return kick.kick(logger, targets, channel);
	}
}());

// h.ban
(function() {
	module.exports.ban = function(logger, targets, channel) {
		return ban.ban(logger, targets, channel);
	}
}());
