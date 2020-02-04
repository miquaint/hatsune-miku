const CORRECT_USAGE = '`purge <numMessages>`';

function usage() {
    return 'Proper Usage of **Purge**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'purge';

    module.exports.help = function() {
        return usage() + '\n\n**numMessages:** The number of messages to purge between 1 and 99';
    };

    module.exports.dm = function(message, logger) {
        message.channel.send('I can\'t purge messages from a DM.');
    };

    module.exports.guild = function(message, logger, args) {
        if (message.member.permissions.has("MANAGE_MESSAGES")) {
            // Check # and type of arguments
            let wrongNumArguments = (args.length !== 1);
            let numToPurge = Number(args[0]);
            if (wrongNumArguments || isNaN(numToPurge)) {
                logger.debug('Purge: Handling incorrect usage');
                message.channel.send(usage());
                return;
            }

            // Check argument types
            if (numToPurge < 1 || numToPurge > 99) {
                logger.debug('Purge: Handling invalid number of messages');
                message.channel.send('Error: Number of messages must be between 1 and 99.');
                return;
            }

            message.channel.bulkDelete(numToPurge + 1)
                .catch((err) => {
                    logger.warning('Purge: Error purging messages from ' + message.channel.name + ' (' +
                        message.channel.id + ')\n' + err.stack);
                    message.channel.send('Error purging the most recent ' + numToPurge
                        + ' messages. Do you and Miku have that permission?');
                });
        } else {
            logger.verbose('Purge: ' + message.author.username + ' (' + message.author.id
                + ') attempted to purge messages from a server they are not allowed to.');
            message.author.createDM()
                .then((response) => {
                    response.send('You don\'t have the correct permissions (MANAGE_MESSAGES) to purge messages from **'
                        + message.guild.name + ' - ' + message.channel.name + '**.');
                })
                .catch((err) => {
                    logger.warning('Purge: Error scolding ' + message.author.username + ' (' + message.author.id
                        + ') for attempting to purge messages from ' + message.guild.name + ' (' + message.guild.id
                        + ' ) - ' + message.channel.name + ' (' + message.channel.id
                        + ') when they don\t have the permission\n' + err.stack);
                });
        }
    };
}());
