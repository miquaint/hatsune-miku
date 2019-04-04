let ban = require('./commands/ban.js');
let kick = require('./commands/kick.js');
let profile = require('./commands/profile.js');
let purge = require('./commands/purge.js');
let roll = require('./commands/roll.js');

(function() {
	// ban
	module.exports.ban = ban;

	// kick
	module.exports.kick = kick;

	// profile
    module.exports.profile = profile;

	//purge
	module.exports.purge = purge;

	// roll
	module.exports.roll = roll;
}());
