(function() {
    module.exports.ban = function(logger, targets, channel) {
        for (var [key, value] of targets) {
            channel.members.get(key).ban()
              .then(() => {
                  logger.info('Ban: Banned ' + value.username + ' (' + key + ')');
                  channel.send(value.username + ' (' + key + ') has been banned.');
              })
              .catch(() => {
                  logger.error('Error banning ' + value.username + ' (' + key + ')');
                  channel.send('Error banning ' + value.username + ' (' + key + ')');
              });
        }
    }
}());
