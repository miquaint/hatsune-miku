const CORRECT_USAGE = '`ban <@user> [@additionalUser(s)]`';

function usage() {
    return 'Proper Usage of **Ban**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'ban';

    module.exports.help = function() {
        return usage() + '\n\n**@user:** The user to ban from the server (make sure you are mentioning them)' +
            '\n**@additionalUser(s):** Any additional users to ban from the server (make sure you are mentioning them)';
    };

    module.exports.dm = function(message, logger) {
        message.channel.send('You can\t ban people from a DM. Perhaps you want to block them?');
    };

    module.exports.guild = function(message, logger, targets) {
        if (message.member.permissions.has("BAN_MEMBERS")) {
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
                        logger.verbose('Ban: Banned ' + targetValue.username + ' (' + targetKey + ') from  '
                            + message.guild.name + ' (' + message.guild.id + ')');
                        message.channel.send(targetValue.username + ' (' + targetKey + ') has been banned.');
                    })
                    .catch((err) => {
                        logger.warning('Ban: Error banning ' + targetValue.username + ' (' + targetKey + ') from '
                            + message.guild.name + ' (' + message.guild.id + ')\n' + err.stack);
                        message.channel.send('Error banning ' + targetValue.username + ' (' + targetKey
                            + '). Do you and Miku have that permission?');
                    });
            }
        } else {
            logger.verbose('Ban: ' + message.author.username + ' (' + message.author.id
                + ') attempted to ban a user from a server they are not allowed to.');
            message.author.createDM()
                .then((response) => {
                    response.send('You don\'t have the correct permissions (BAN_MEMBERS) to ban users from **'
                        + message.guild.name + '**.');
                })
                .catch((err) => {
                    logger.warning('Ban: Error scolding ' + message.author.username + ' (' + message.author.id
                        + ') for attempting to ban someone from ' + message.guild.name + ' ('
                        + message.guild.id + ') when they don\'t have the permission\n' + err.stack);
                });
        }
    };
}());
