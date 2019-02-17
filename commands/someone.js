(function() {
    module.exports.someone = function(logger, client, message) {
        let users = message.channel.members;
        users.forEach(isBot);
        let userID = randomUser(users)[0];
        logger.debug('Someone: Possible @someone targets in next message');
        logger.debug(users);
        logger.verbose('Someone: ' + userID + ' was selected as @someone');

        return '<@' + userID + '>, you are @someone ^';
    }
}());

function isBot(value, key, map) {
    if (value.user.bot) {
        map.delete(key);
    }
}

function randomUser(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}
