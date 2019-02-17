(function() {
    module.exports.someone = function(logger, client, message) {
        let users = message.channel.members;
        logger.debug(message.channel.members);
        // for (let key in users) {
        //     if (users[key].bot) {
        //         delete users[key];
        //     }
        // }
        // let userID = randomUser(users).id;
        // logger.debug('Someone: Possible @someone targets in next message');
        // logger.debug(users);
        // logger.verbose('Someone: ' + userID + 'was selected as @someone');
        //
        // return '<@' + userID + '> ^';
        //TODO: @someone
        return;
    }
}());

function randomUser(users) {
    let keys = Object.keys(users);
    return users[keys[keys.length * Math.random() << 0]];
}
