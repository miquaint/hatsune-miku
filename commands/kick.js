const CORRECT_USAGE = '`kick <@user> [@additionalUser(s)]`';

function usage() {
    return 'Proper Usage of **Kick**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'kick';

    module.exports.help = function() {
        return usage() + '\n\n**@user:** The user to kick from the server (make sure you are mentioning them)' +
            '\n**@additionalUser(s):** Any additional users to kick from the server (make sure you are mentioning them)';
    };

    module.exports.dm = function(message, logger) {
        message.channel.send('You can\t kick people from a DM. Perhaps you want to block them?');
    };

    module.exports.guild = function(message, logger, targets) {
        if (message.member.permissions.has("KICK_MEMBERS")) {
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
                        logger.verbose('Kick: Kicked ' + targetValue.username + ' (' + targetKey + ') from '
                            + message.guild.name + ' (' + message.guild.id + ')');
                        message.channel.send(targetValue.username + ' (' + targetKey + ') has been kicked.');
                    })
                    .catch((err) => {
                        logger.warning('Kick: Error kicking ' + targetValue.username + ' (' + targetKey + ') from '
                            + message.guild.name + ' (' + message.guild.id + ')\n' + err.stack);
                        message.channel.send('Error kicking ' + targetValue.username + ' (' + targetKey
                            + '). Do you and Miku have that permission?');
                    });
            }
        } else {
            logger.verbose('Kick: ' + message.author.username + ' (' + message.author.id
                + ') attempted to kick a user from a server they are not allowed to.');
            message.author.createDM()
                .then((response) => {
                    response.send('You don\'t have the correct permissions (KICK_MEMBERS) to kick users from **'
                        + message.guild.name + '**.');
                })
                .catch((err) => {
                    logger.warning('Kick: Error scolding ' + message.author.username + ' (' + message.author.id
                        + ') for attempting to kick someone from ' + message.guild.name + ' ('
                        + message.guild.id + ') when they don\'t have the permission\n' + err.stack);
                });
        }
    };
}());
