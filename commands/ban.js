const CORRECT_USAGE = '`ban [@user] (@additionalUser(s))`';

function usage() {
    return 'Proper Usage of **Ban**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'ban';

    module.exports.help = function() {
        return usage() + '\n\n**@user:** The user to ban from the server (make sure you are mentioning them)' +
            '\n**@additionalUser(s):** Any additional users to ban from the server (make sure you are mentioning them)';
    };

    module.exports.execute = function(message, logger, targets) {
        if (targets.size === 0) {
            logger.debug('Ban: Handling incorrect usage');
            message.channel.send(usage());
            return;
        }
        for (var [key, value] of targets) {
            let targetKey = key;
            let targetValue = value;
            message.channel.members.get(targetKey).ban()
                .then(() => {
                    logger.info('Ban: Banned ' + targetValue.username + ' (' + targetKey + ') from  ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send(targetValue.username + ' (' + targetKey + ') has been banned.');
                })
                .catch(() => {
                    logger.warning('Ban: Error banning ' + targetValue.username + ' (' + targetKey + ') from ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send('Error banning ' + targetValue.username + ' (' + targetKey + '). Does Miku have that permission?');
                });
        }
    };
}());
