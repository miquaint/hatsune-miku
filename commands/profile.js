let Discord = require('discord.js');
let fs = require('fs');
let txt2png = require('text2png');
const CORRECT_USAGE = '`profile [@user]`';
const START_LEVEL = 1;
const EXP_RESET = 0;
const LEVEL_SCALING = 24;
const EXP_MODIFIER = 3; // This is used to allow users to change leveling slower or faster on their servers

function usage() {
    return 'Proper Usage of **Profile**:\n' + CORRECT_USAGE;
}

function newUser(message, logger, connection, target = null) {
    let user = target !== null ? target : message.author;

    logger.verbose('Profile: ' + user.username + ' (' + user.id + ') is a new user! Adding them to the database...');

    let sql = 'INSERT INTO users VALUES (?, ?, ?, ?, ?)';
    connection.query(sql, [user.id, START_LEVEL, EXP_RESET, EXP_RESET, (LEVEL_SCALING + START_LEVEL) * EXP_MODIFIER],
        function(error, results, fields) {
            if (error) {
                logger.error('Profile: Error adding new user:\n' + error.stack);
                return;
            }

            logger.verbose('Profile: ' + user.username + ' (' + user.id + ') successfully added to the users database');
        });

    return [{level: START_LEVEL, total_exp: EXP_RESET, current_exp: EXP_RESET,
        required_exp: (LEVEL_SCALING + START_LEVEL) * EXP_MODIFIER}];
}

function generateProfile(message, logger, client, results, target = null) {
    let profile_info = results[0];
    let user = target !== null ? target : message.author;
    fs.writeFile('img/profile_level.png', txt2png(profile_info.level.toString(), {
        backgroundColor: 'black',
        color: 'cyan',
        font: '200px AbsolutePink',
        localFontName: 'AbsolutePink',
        localFontPath: 'fonts/Absolute Pink - Personal Use.otf',
        padding: 15
    }), function (error) {
        if (error) {
            logger.error('Profile: Error creating image for profile:\n' + error.stack);
        }

        const embed = new Discord.RichEmbed()
            .setAuthor(user.username, 'attachment://profile_level.png')
            .setColor(0x00AE86)
            .addField(profile_info.current_exp + '/' + profile_info.required_exp + ' EXP', 'Total Experience: '
                + profile_info.total_exp)
            .setThumbnail(user.avatarURL)
            .setTitle('Level: ' + profile_info.level);

        message.channel.send({
            embed,
            files: [{
                attachment: 'img/profile_level.png',
                name: 'profile_level.png'
            }]
        });
    });
}

function profile(message, logger, connection, client, target) {
    let sql = 'SELECT * FROM users WHERE id = ?';
    // Check if the user wanted their profile or another profile
    if (target.size === 0) {
        connection.query(sql, [message.author.id], function(error, results, fields) {
            if (error) {
                logger.warning('Profile: Error identifying user for profile:\n' + error.stack);
                return;
            }

            if (results.length === 0) {
                // Since the results were empty, populate them with the new user data
                results = newUser(message, logger, connection);
            }

            generateProfile(message, logger, client, results);
        });
    } else {
        // Get the target's key
        userKey = target.keys().next().value;
        connection.query(sql, [target.get(userKey).id], function(error, results, fields) {
            if (error) {
                logger.warning('Profile: Error identifying user for profile:\n' + error.stack);
                return;
            }

            if (results.length === 0) {
                // Since the results were empty, populate them with the new user data
                results = newUser(message, logger, connection, target.get(userKey));
            }

            generateProfile(message, logger, client, results, target.get(userKey));
        });
    }
}

(function() {
    module.exports.name = 'profile';

    module.exports.help = function() {
        return usage();
    };

    module.exports.dm = function(message, logger, connection, client, target) {
        profile(message, logger, connection, client, target);
    };

    module.exports.guild = function(message, logger, connection, client, target) {
        profile(message, logger, connection, client, target);
    };
}());
