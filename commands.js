let ban = require('./commands/ban.js');
let kick = require('./commands/kick.js');
let purge = require('./commands/purge.js');
let roll = require('./commands/roll.js');

(function() {
	// ban
	module.exports.ban = ban;

	// kick
	module.exports.kick = kick;

	//purge
	module.exports.purge = purge;

	// roll
	module.exports.roll = roll;
}());
