(function() {
    module.exports.kick = function(logger, targets, channel) {
        for (var [key, value] of targets) {
            channel.members.get(key).kick()
              .then(() => {
                  logger.info('Kick: Kicked ' + value.username + ' (' + key + ')');
                  channel.send(value.username + ' (' + key + ') has been kicked.');
              })
              .catch(() => {
                  logger.error('Error kicking ' + value.username + ' (' + key + ')');
                  channel.send('Error kicking ' + value.username + ' (' + key + ')');
              });
        }
    }
}());
