const CORRECT_USAGE = '`.ban @user [@additionalUser(s)]`';

function usage(message) {
    message.channel.send('**Proper Usage:**\n' + CORRECT_USAGE);
}

(function() {
    module.exports.ban = function(message, logger, targets) {
        if (targets.size === 0) {
            logger.debug('Ban: Handling incorrect usage');
            usage(message);
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
                    logger.error('Error banning ' + targetValue.username + ' (' + targetKey + ') from ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send('Error banning ' + targetValue.username + ' (' + targetKey + '). Does Miku have that permission?');
                });
        }
    }
}());
