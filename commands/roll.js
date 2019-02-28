const CORRECT_USAGE = '`roll [number_of_dice]d[number_of_sides] ((+/-) flat_value)`';

const MAX_DICE = 1000;
const MAX_DICE_TO_DISPLAY = 100;
const MAX_SIDES = 100000000000;

function usage() {
	return 'Proper Usage of **Roll**:\n' + CORRECT_USAGE;
}

(function() {
	module.exports.name = 'roll';

	module.exports.help = function() {
		return usage() + '\n\n**number_of_dice:** The number of dice to roll' +
			'\n**number_of_sides:** The number of sides on each dice' +
			'\n**(+/-) flat_value:** Add or subtract a value to the result on the dice rolls';
	};

	module.exports.execute = function(message, logger, args) {
		// Check # arguments
		let wrongNumArguments = (args.length !== 1 && args.length !== 3);
		if (wrongNumArguments) {
			logger.debug('Roll: Handling incorrect usage');
			message.channel.send(usage());
			return;
		}

		let indexOfD = args[0].toLowerCase().indexOf('d');
		let numDice = Number(args[0].substring(0, indexOfD));
		let numSides = parseFloat(args[0].substring(indexOfD + 1));
		let hasFlatValue = !!args[2];
		let flatValue = hasFlatValue ? Number(args[2]) : 0;

		// Check argument types
		let noD = indexOfD < 0;
		if (isNaN(numDice) || isNaN(numSides) || isNaN(flatValue) || noD) {
			logger.debug('Roll: Handling incorrect usage');
			message.channel.send(usage());
			return;
		}

		// Check number of dice
		let wrongNumDice = numDice < 0 || numDice > MAX_DICE;
		if (wrongNumDice) {
			logger.debug('Roll: Handling invalid number of dice');
			message.channel.send('Error: Number of dice must be between 1 and 1000.');
			return;
		}

		// Check number of sides
		let wrongNumSides = numSides <= 0 || numSides > MAX_SIDES;
		if (wrongNumSides) {
			logger.debug('Roll: Handling invalid number of sides');
			message.channel.send('Error: Number of sides must be between 1 and 100000000000.');
			return;
		}

		// Check for fractions
		let isFractionalNumSides = numSides % 1 !== 0;
		if (isFractionalNumSides) {
			logger.debug('Roll: Handling fraction of a side');
			message.reply('you can\'t have a fraction of a side. :angry:');
			return;
		}

		// Check for negative flat value (can just use subtraction)
		if (flatValue < 0) {
			logger.debug('Roll: Handling negative flat value');
			message.channel.send('Error: Flat value should be positive (you can just use subtraction).');
			return;
		}

		// 0 for wrong input, 1 for '+', 2 for '-'
		let arithmeticSymbol = 0;
		if (args[1]) {
			switch (args[1]) {
				case '+':
					arithmeticSymbol = 1;
					break;
				case '-':
					arithmeticSymbol = 2;
					break;
				default:
					logger.debug('Roll: Handling wrong arithmetic symbol');
					message.channel.send('Error: Only `+` and `-` are supported.');
					return;
			}
		}

		let totalValue = arithmeticSymbol === 1 ? flatValue : (-1 * flatValue);
		let values = [];
		let valuesRolled = '';
		for (let i = 0; i < numDice; i++) {
			let roll = Math.ceil(Math.random() * numSides);
			totalValue += roll;
			values.push(roll);
			let isLast = i + 1 >= numDice;
			valuesRolled += isLast ? roll : roll + ' + ';
		}

		logger.silly('Roll: Index of "d": ' + indexOfD);
		logger.debug('Roll: Number of dice: ' + numDice);
		logger.debug('Roll: Number of sides: ' + numSides);
		logger.verbose('Roll: Values rolled: ' + values);
		logger.verbose('Roll: Total value: ' + totalValue);

		let response = 'you rolled a **' + totalValue + '**.';
		if (numDice > 1 && numDice <= MAX_DICE_TO_DISPLAY) {
			response += '\nThe values on the die were: ' + valuesRolled + ' = *';
			if (arithmeticSymbol === 1) {
				response += (totalValue - flatValue) + '*';
			} else { // Don't need to check for negative, if the argument was invalid the function would have returned above
				response += (totalValue + flatValue) + '*';
			}
		} else if (numDice > MAX_DICE_TO_DISPLAY) {
			response += '\nI do not show individual dice rolls for more than 100 dice.'
		}

		// If there is flat value math, show it
		if (arithmeticSymbol) {
			response += '\n*';
			if (arithmeticSymbol === 1) {
				response += (totalValue - flatValue) + '* + ';
			} else if (arithmeticSymbol === 2) {
				response +=  (totalValue + flatValue) + '* - ';
			}
			response += flatValue + ' = **' + totalValue + '**';
		}

		message.reply(response);
	};
}());
