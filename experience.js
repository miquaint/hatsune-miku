const START_LEVEL = 1;
const EXP_RESET = 0;
const LEVEL_SCALING = 24;
const EXP_MODIFIER = 3; // This is used to allow users to change leveling slower or faster on their servers

function newUser(message, logger, connection) {
    logger.verbose('Experience: ' + message.author.username + ' (' + message.author.id + ') is a new user! Adding them to the database...');
    let sql = 'INSERT INTO users VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [message.author.id, START_LEVEL, EXP_RESET, EXP_RESET, (LEVEL_SCALING + START_LEVEL) * EXP_MODIFIER],
        function(error, results, fields) {
            if (error) {
                logger.error('Experience: Error adding new user for experience:\n' + error.stack);
                return;
            }

            logger.verbose('Experience: ' + message.author.username + ' (' + message.author.id + ') successfully added to the users database');
    });

    return [{level: START_LEVEL, total_exp: EXP_RESET, current_exp: EXP_RESET,
        required_exp: (LEVEL_SCALING + START_LEVEL) * EXP_MODIFIER}];
}

function gainExp(message, logger, connection, userInfo) {
    // Increase total_exp and current_exp and check to see if the user has leveled up
    userInfo[0].total_exp += EXP_MODIFIER;
    userInfo[0].current_exp += EXP_MODIFIER;
    if (userInfo[0].current_exp >= userInfo[0].required_exp) {
        levelUp(message, logger, userInfo);
    }

    let sql = 'UPDATE users SET level = ?, total_exp = ?, current_exp = ?, required_exp = ? WHERE id = ?';
    connection.query(sql, [userInfo[0].level, userInfo[0].total_exp, userInfo[0].current_exp, userInfo[0].required_exp,
        message.author.id], function(error, results, fields) {
            if (error) {
                logger.warning('Experience: Error giving user experience:\n' + error.stack);
                return;
            }
    });
}

function levelUp(message, logger, userInfo) {
    logger.debug('Experience: ' + message.author.username + ' (' + message.author.id + ') just hit level ' + userInfo[0].level++);
    userInfo[0].current_exp = EXP_RESET;
    userInfo[0].required_exp += (LEVEL_SCALING + userInfo[0].level) * EXP_MODIFIER;
    message.channel.send('Gratz <@' + message.author.id + '>! You reached level **' + userInfo[0].level + '**!');
}

(function() {
    module.exports.message = function(message, logger, connection) {
        let sql = 'SELECT * FROM users WHERE id = ?';
        connection.query(sql, [message.author.id], function(error, results, fields) {
            if (error) {
                logger.warning('Experience: Error identifying user:\n' + error.stack);
                return;
            }

            if (results.length === 0) {
                // Since the results were empty, populate them with the new data
                results = newUser(message, logger, connection);
            }
            gainExp(message, logger, connection, results);
        });
    }
}());
