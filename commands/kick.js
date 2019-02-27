const CORRECT_USAGE = '`.kick @user [@additionalUser(s)]`';

function usage(message) {
    message.channel.send('**Proper Usage:**\n' + CORRECT_USAGE);
}

(function() {
    module.exports.kick = function(message, logger, targets) {
        if (targets.size === 0) {
            logger.debug('Kick: Handling incorrect usage');
            usage(message);
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
                    logger.error('Error kicking ' + targetValue.username + ' (' + targetKey + ') from ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send('Error kicking ' + targetValue.username + ' (' + targetKey + '). Does Miku have that permission?');
                });
        }
    }
}());
