const CORRECT_USAGE = '`purge numMessages`';

function usage() {
    return 'Proper Usage of **Purge**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'purge';

    module.exports.help = function() {
        return usage() + '\n\n**numMessages:** The number of messages to purge between 1 and 99';
    };

    module.exports.execute = function(message, logger, args) {
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
            .catch(err => {
                logger.warning('Purge: Error purging messages from ' + message.channel.name + ' (' +
                    message.channel.id + ')');
                message.channel.send('Error purging the most recent ' + numToPurge + ' messages. Do you have the correct permissions.');
            });
    };
}());
