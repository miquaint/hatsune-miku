let Discord = require('discord.js');
let winston = require('winston');
let mysql = require('mysql');
let auth = require('./auth.json');
let commands = require('./commands');
let experience = require('./experience');
let help = require('./help');
let someone = require('./someone');

const DMCHANNELTYPES = ['dm', 'group'];

// Configure logger settings
var logger = winston.createLogger({
    format: winston.format.combine(
      winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.printf(info => `${info.timestamp}\t${info.level}:\t${info.message}`)
    ),
    level: process.argv[2],
    levels: {
        error: 0,
        warning: 1,
        info: 2,
        verbose: 3,
        debug: 4
    },
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
          filename: 'logs/combined.log'
      })
    ]
});
winston.addColors({
    error: 'red',
        warning: 'yellow',
        info: 'blue',
        verbose: 'green',
        debug: 'purple'
});

// Initialize Discord Bot
logger.info('Connecting to Miku...');
let client = new Discord.Client();
client.login(auth.token);
client.once('ready', function (evt) {
    logger.info(`Connection to Miku successful! Logged in as: ${client.user.tag}`);
});

// Connect to the mySQL server
logger.info('Connecting to mySQL database...');
let connection = mysql.createConnection({
    host: auth.mysql_host,
    user: auth.mysql_user,
    password: auth.mysql_pass,
    database: auth.mysql_db
});
connection.connect(function(err) {
    if (err) {
        logger.error('Error connecting to mySQL database:\n' + err.stack);
        return;
    }
    logger.info('Connection to mySQL database successful! Connected as id ' + connection.threadId);
});

client.on('message', message => {
    // Ignore messages from bots
    if (!message.author.bot) {
        let isDM = DMCHANNELTYPES.includes(message.channel.type);

        // Listen for messages that will start with `h.`
        let command_selector = 'h.';
        if (message.content.substring(0, command_selector.length) === command_selector) {
            let args = message.content.substring(command_selector.length).split(/ +/);
            let cmd = args[0];

            // Remove the command from the arguments
            args = args.splice(1);
            switch (cmd) {
                case 'ban':
                    if (isDM) {
                        commands.ban.dm(message);
                    } else {
                        logger.verbose('Miku: ' + message.author.username + ' (' + message.author.id
                          + ') has used the "ban" command in ' + message.guild.name + ' (' + message.guild.id + ')');
                        commands.ban.guild(message, logger, message.mentions.users);
                    }
                    break;
                case 'help':
                    if (args[0]) {
                        let command = args[0];
                        logger.debug('Miku: ' + message.author.username + ' (' + message.author.id
                            + ') has requested help with "' + command + '"');
                        message.channel.send(commands[command].help());
                    } else {
                        logger.debug('Miku: ' + message.author.username + ' (' + message.author.id
                            + ') has requested generic help');
                        help.bulkHelp(message);
                    }
                    break;
                case 'kick':
                    if (isDM) {
                        commands.kick.dm(message);
                    } else {
                        logger.verbose('Miku: ' + message.author.username + ' (' + message.author.id
                          + ') has used the "kick" command in ' + message.guild.name + ' (' + message.guild.id + ')');
                        commands.kick.guild(message, logger, message.mentions.users);
                    }
                    break;
                case 'profile':
                    if (isDM) {
                        commands.profile.dm(message, logger, connection, client);
                    } else {
                        logger.verbose('Miku: ' + message.author.username + ' (' + message.author.id
                          + ') has viewed their profile.');
                        commands.profile.guild(message, logger, connection, client);
                    }
                    break;
                case 'purge':
                    if (isDM) {
                        commands.purge.dm(message);
                    } else {
                        logger.verbose('Miku: ' + message.author.username + ' (' + message.author.id
                          + ') has used the "purge" command in ' + message.guild.name + ' (' + message.guild.id + ')');
                        commands.purge.guild(message, logger, args);
                    }
                    break;
                case 'roll':
                    if (isDM) {
                        commands.roll.dm(message, logger, args);
                    } else {
                        logger.debug('Miku: Dice rolled by ' + message.author.username + ' (' + message.author.id + ')');
                        commands.roll.guild(message, logger, args);
                    }
                    break;
            }
        } else {
            if (!isDM) {
                // Give xp to the user
                experience.message(message, logger, connection);

                // Mention a random person in the current text channel
                if (message.content.includes('@someone')) {
                    logger.verbose('Miku: ' + message.author.username + '(' + message.author.id + ') mentioned @someone');
                    someone.mention(message, logger);
                }
            }
        }
    }
});
