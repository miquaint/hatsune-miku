const CORRECT_USAGE = '.roll (number_of_dice)d(number_of_sides) [(+/-) (flat_value)]';

(function() {
	module.exports.roll = function(logger, args) {
		let indexOfD = args[0].toLowerCase().indexOf('d');
		if (indexOfD < 0 || (args.length !== 1 && args.length !== 3)) {
			logger.debug('Roll: Handling incorrect syntax error');
			return CORRECT_USAGE;
		}

		let numDice = Number(args[0].substring(0, indexOfD));
		if (numDice < 0 || numDice > 1000) {
			logger.debug('Roll: Handling invalid number of dice');
			return 'Error: Number of dice must be between 1 and 1000.';
		}

		let numSides = parseFloat(args[0].substring(indexOfD + 1));
		if (numSides <= 0 || numSides > 100000000000) {
			logger.debug('Roll: Handling invalid number of sides');
			return 'Error: Number of sides must be between 1 and 100000000000.';
		}
		if (numSides % 1 !== 0) {
			logger.debug('Roll: Handling fraction of a side');
			return 'Error: You can\'t have a fraction of a side. :angry:';
		}

		let hasFlatValue = !!args[2];

		let flatValue = hasFlatValue ? Number(args[2]) : 0;
		if (flatValue < 0) {
			logger.debug('Roll: Handling negative flat value');
			return ' Error: Flat value should be positive.';
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
					return 'Error: Second argument must be `+` or `-`';
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

		let message = 'you rolled a **' + totalValue + '**.';
		if (numDice > 1 && numDice <= 100) {
			message += '\nThe values on the die were: ' + valuesRolled + ' = *';
			if (arithmeticSymbol === 1) {
				message += (totalValue - flatValue) + '*';
			} else { // Don't need to check for negative, if the argument was invalid the function would have returned above
				message += (totalValue + flatValue) + '*';
			}
		} else {
			message += '\nI do not show individual dice rolls for more than 100 dice.'
		}

		message += '\n*';
		if (arithmeticSymbol === 1) {
			message += (totalValue - flatValue) + '* + ';
		} else { // Don't need to check for negative, if the argument was invalid the function would have returned above
			message += (totalValue + flatValue) + '* - ';
		}
		message += flatValue + ' = **' + totalValue + '**';

		return message;
	}
}());
