let Discord = require('discord.js');
let logger = require('winston');
let mysql = require('mysql');
let auth = require('./auth.json');
let commands = require('./commands');
let experience = require('./experience');
let help = require('./help');
let someone = require('./someone');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = process.argv[2];

// Initialize Discord Bot
logger.info('Connecting to Miku...');
let client = new Discord.Client();
client.login(auth.token);
client.once('ready', function (evt) {
    logger.info(`Connection to Miku successful! Logged in as: ${client.user.tag}`);
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

client.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `h.`
    if (message.author.id !== client.user.id && !message.author.bot) {
        let command_selector = 'hm.';
        if (message.content.substring(0, command_selector.length) === command_selector) {
            let args = message.content.substring(command_selector.length).split(/ +/);
            let cmd = args[0];

            // Remove the command from the arguments
            args = args.splice(1);
            switch (cmd) {
                case 'ban':
                    logger.info('Miku: ' + message.author.username + ' (' + message.author.id +
                        ') has banned user(s) from ' + message.guild.name + ' (' + message.guild.id + ')');
                    commands.ban.execute(message, logger, message.mentions.users);
                    break;
                case 'help':
                    if (args[0]) {
                        let command = args[0];
                        logger.verbose('Miku: ' + message.author.username + ' (' + message.author.id +
                            ') has requested help with "' + command + '"');
                        message.channel.send(commands[command].help());
                    } else {
                        logger.verbose('Miku: ' + message.author.username + ' (' + message.author.id +
                            ') has requested generic help');
                        help.bulkHelp(message, logger);
                    }
                    break;
                case 'kick':
                    logger.info('Miku: ' + message.author.username + ' (' + message.author.id +
                        ') has kicked user(s) from ' + message.guild.name + ' (' + message.guild.id + ')');
                    commands.kick.execute(message, logger, message.mentions.users);
                    break;
                case 'roll':
                    logger.verbose('Miku: Dice rolled by ' + message.author.username + ' (' + message.author.id + ')');
                    commands.roll.execute(message, logger, args);
                    break;
            }
        } else {
            // Give xp to the user
            experience.message(message, logger, connection);

            // Mention a random person in the current text channel
            if (message.content.includes('@someone')) {
                logger.info('Miku: ' + message.author.username + '(' + message.author.id + ') mentioned @someone');
                someone.mention(message, logger);
            }
        }
    }
});
