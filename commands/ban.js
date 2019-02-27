(function() {
    module.exports.ban = function(message, logger, targets) {
        for (var [key, value] of targets) {
            let targetKey = key;
            let targetValue = value;
            message.channel.members.get(targetKey).ban()
                .then(() => {
                    logger.info('Ban: Banned ' + targetValue.username + ' (' + targetKey + ') from  ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send(targetValue.username + ' (' + targetKey + ') has been banned.');
                })
                .catch(() => {
                    logger.error('Error banning ' + targetValue.username + ' (' + targetKey + ') from ' + message.guild.name + ' (' + message.guild.id + ')');
                    message.channel.send('Error banning ' + targetValue.username + ' (' + targetKey + '). Does Miku have that permission?');
                });
        }
    }
}());
