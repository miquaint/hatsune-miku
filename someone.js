function isBot(value, key, map) {
    if (value.user.bot) {
        map.delete(key);
    }
}

function randomUser(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

(function() {
    module.exports.mention = function(message, logger) {
        let users = message.channel.members;
        users.forEach(isBot);
        let userID = randomUser(users)[0];

        logger.silly('Someone: ' + userID + ' was selected as @someone');
        message.channel.send('<@' + userID + '>, you are @someone ^');
    }
}());
