const CORRECT_USAGE = '`purge [numMessages]`';

function usage() {
    return 'Proper Usage of **Purge**:\n' + CORRECT_USAGE;
}

(function() {
    module.exports.name = 'purge';

    module.exports.help = function() {
        return usage() + '\n\n**numMessages:** The number of messages to purge between 1 and 99';
    };

    module.exports.execute = function(message, logger, num_messages) {
        let numToPurge = Number(num_messages);
    };
}());
