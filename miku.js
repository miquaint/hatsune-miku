// let Discord = require('discord.io');
let Discord = require('discord.js');
let logger = require('winston');
let mysql = require('mysql');
let auth = require('./auth.json');
let commands = require('./commands.js');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = process.argv[2];

// Initialize Discord Bot
logger.info('Connecting to Miku...');
let client = new Discord.Client({
    fetchAllMembers: true
});
client.login(auth.token);
client.once('ready', function (evt) {
    logger.info(`Connection to Miku successful! Logged in as: ${client.user.tag}`);
});

// Connect to the mySQL server
logger.info('Connection to mySQL database...');
let con = mysql.createConnection({
    host: auth.mysql_host,
    user: auth.mysql_user,
    password: auth.mysql_pass,
    database: auth.mysql_db
});
con.connect(function(err) {
    if (err) {
        logger.error('Error connecting to mySQL database: ' + err.stack);
        return;
    }
    logger.info('Connection to mySQL database successful! Connected as id ' + con.threadId);
});

client.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `h.`
    if (message.content.substring(0, 2) === 'h.') {
        let args = message.content.substring(2).split(/ +/);
        let cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'roll':
                logger.info('Miku: Dice rolled by ' + message.author.username + '(' + message.author.id + ')');
                message.reply(commands.roll(logger, message.author.id, args));
                break;
        }
    } else {
        //TODO: Experience system
        if (message.content.includes('@someone')) {
            logger.info('Miku: ' + message.author.username + '(' + message.author.id + ') mentioned @someone');
            message.channel.send(commands.someone(logger, client, message));
        }
    }
});
