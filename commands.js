let ban = require('./commands/ban.js');
let kick = require('./commands/kick.js');
let roll = require('./commands/roll.js');

(function() {
	// ban
	module.exports.ban = ban;

	// kick
	module.exports.kick = kick;

	// roll
	module.exports.roll = roll;
}());
