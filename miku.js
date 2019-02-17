let Discord = require('discord.io');
let logger = require('winston');
let mysql = require('mysql');
let auth = require('./auth.json');
let commands = require('./commands.js');
let experience = require('./experience');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = process.argv[2];

// Initialize Discord Bot
logger.info('Connecting to Miku...');
let bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connection to Miku successful! Logged in as: ' + bot.username + ' (' + bot.id + ')');
});

// Connect to the mySQL server
logger.info('Connection to mySQL database...');
let connection = mysql.createConnection({
    host: auth.mysql_host,
    user: auth.mysql_user,
    password: auth.mysql_pass,
    database: auth.mysql_db
});
connection.connect(function(err) {
    if (err) {
        logger.error('Error connecting to mySQL database: ' + err.stack);
        return;
    }
    logger.info('Connection to mySQL database successful! Connected as id ' + connection.threadId);
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `h.`
    let commandText = 'h.';
    if (message.substring(0, commandText.length) === 'h.') {
        let args = message.substring(commandText.length).split(' ');
        let cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
			case 'roll':
                logger.verbose('Miku: Dice rolled by ' + user + '(' + userID + ')');
				bot.sendMessage({
					to: channelID,
					message: commands.roll(logger, userID, args)
				});
                break;
         }
    } else {
        // Give xp to everyone but the bot itself
        if (userID !== bot.id) {
            experience.message(logger, bot, connection, userID, channelID);
        }
    }
});
