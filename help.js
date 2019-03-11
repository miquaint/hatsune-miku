let commands = require('./commands');

const USAGE = '`help command_name`';

function bulkHelp(message, logger) {
    message.author.createDM()
        .then((response) => {
            let reply = 'For help with a specific command use: ' + USAGE + '\n\n**List of Commands:**```';
            for (var command in commands) {
                reply += '\n' + commands[command].name;
            }
            reply += '```';
            response.send(reply);
        })
        .catch(() => {
            logger.error('Help: Error sending help to ' + message.author.username + ' (' + message.author.id + ')');
        });
}

(function() {
    module.exports.bulkHelp = function(message, logger) {
        return bulkHelp(message, logger);
    }
}());