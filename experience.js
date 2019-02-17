(function() {
    module.exports.message = function(logger, bot, connection, userID, channelID) {
        let sql = 'SELECT * FROM users WHERE id = ?';
        connection.query(sql, [userID], function(error, results, fields) {
            if (error) {
                logger.error('Error identifying user for experience: ' + error.stack);
                return;
            }

            if (results.length === 0) {
                newUser(logger, connection, userID);
                // Since the results were empty, populate them with the new data
                // Same as the values in newUser
                results = [{level: 1, total_exp: 0, current_exp: 0, required_exp: 60}];
            }
            gainExp(logger, bot, connection, userID, channelID, results);
        });
    }
}());

function newUser(logger, connection, userID) {
    logger.verbose('Experience: ' + userID + ' is a new user! Adding them to the database...');
    // level = 1
    // total_exp = 0
    // current_exp = 0
    // required_exp = 60
    let sql = 'INSERT INTO users VALUES (?, 1, 0, 0, 60)';
    connection.query(sql, [userID], function(error, results, fields) {
        if (error) {
            logger.error('Error adding new user for experience: ' + error.stack);
            return;
        }

        logger.verbose('Experience: ' + userID + ' successfully added to the users database');
    });
}

function gainExp(logger, bot, connection, userID, channelID, userInfo) {
    // Increase total_exp and current_exp and check to see if the user has leveled up
    userInfo[0].total_exp++;
    if (++userInfo[0].current_exp >= userInfo[0].required_exp) {
        levelUp();
    }

    let sql = 'UPDATE users SET level = ?, total_exp = ?, current_exp = ?, required_exp = ? WHERE id = ?';
    connection.query(sql, [userInfo[0].level, userInfo[0].total_exp, userInfo[0].current_exp, userInfo[0].required_exp,
      userID], function(error, results, fields) {
        if (error) {
            logger.error('Error giving user experience: ' + error.stack);
            return;
        }

        logger.silly('Experience: ' + userID + ' sent a message that earned them experience');
    });
}

function levelUp(logger, bot, userID, channelID, userInfo) {
    userInfo[0].current_exp = 0;
    userInfo[0].required_exp += 60;
    userInfo[0].level++;
    bot.sendMessage({
        to: channelID,
        message: 'Gratz <@' + userID + '>! You reached level **' + userInfo[0].level + '**!'
    });
    logger.verbose('Experience: ' + userID + ' just hit level ' + userInfo[0].level);
}
