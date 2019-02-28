const CORRECT_USAGE = '`kick [@user] (@additionalUser(s))`';

function usage() {
    return 'Proper Usage of **Kick**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'kick';

    module.exports.help = function() {
        return usage() + '\n\n**@user:** The user to kick from the server (make sure you are mentioning them)' +
            '\n**@additionalUser(s):** Any additional users to kick from the server (make sure you are mentioning them)';
    };

    module.exports.execute = function(message, logger, targets) {
        if (targets.size === 0) {
            logger.debug('Kick: Handling incorrect usage');
            message.channel.send(usage());
            return;
        }
        for (var [key, value] of targets) {
            let targetKey = key;
            let targetValue = value;
            message.channel.members.get(targetKey).kick()
                .then(() => {
                    logger.info('Kick: Kicked ' + targetValue.username + ' (' + targetKey + ') from ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send(targetValue.username + ' (' + targetKey + ') has been kicked.');
                })
                .catch(() => {
                    logger.warning('Kick: Error kicking ' + targetValue.username + ' (' + targetKey + ') from ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send('Error kicking ' + targetValue.username + ' (' + targetKey + '). Does Miku have that permission?');
                });
        }
    };
}());
