function ConvertHandler() {
	const units = {
		gal: 'gal',
		l: 'L',
		lbs: 'lbs',
		kg: 'kg',
		mi: 'mi',
		km: 'km',
	};

	this.getNum = function (input) {
		const wholeRegex = /^((?:[0-9.]+)?(?:[0-9.\/]+)?(?:[0-9.]+)?)(\s)?([a-z]+)?$/i;
		const value = wholeRegex.exec(input);
		// console.log(value);
		if (!value) {
			return null;
		}

		const sectionRegex = /([0-9.]+[\/]?)?([0-9.]+[\/]+|[\/]+)?([0-9.]+)?/;
		const validNumber = sectionRegex.exec(value);
		// console.log(validNumber);
		if (validNumber[2] !== undefined) {
			return null;
		}
		// if (validNumber[2] !== null && validNumber[2].length > 1) return null;
		const result = value && value[1] !== '' ? value[1] : 1;
		return result ? eval(result).toFixed(5) : null;
	};

	this.getUnit = function (input) {
		const regex = /^((?:[0-9.]+)?(?:[0-9.\/]+)?(?:[0-9.]+)?)(\s)?([a-z]+)?$/i;
		// console.log(regex.exec(input));
		const unitMap = ['l', 'gal', 'kg', 'lbs', 'km', 'mi'];
		const value = regex.exec(input)[3];
		return value && unitMap.includes(value.toLowerCase()) ? value.toLowerCase() : null;
	};

	this.getReturnUnit = function (initUnit) {
		const unitMap = {
			gal: 'L',
			l: 'gal',
			lbs: 'kg',
			kg: 'lbs',
			mi: 'km',
			km: 'mi',
		};

		const result = unitMap[initUnit.toLowerCase()];

		return result;
	};

	this.spellOutUnit = function (unit) {
		const unitMap = {
			gal: 'gallons',
			l: 'liters',
			lbs: 'pounds',
			kg: 'kilograms',
			mi: 'miles',
			km: 'kilometers',
		};

		return unitMap[unit];
	};

	this.convert = function (initNum, initUnit) {
		// console.log(initNum, initUnit);

		if (!initNum && !initUnit) {
			return 'invalid number and unit';
		} else if (!initNum && initUnit) {
			return 'invalid number';
		} else if (initNum && !initUnit) {
			return 'invalid unit';
		}

		const galToL = 3.78541;
		const lbsToKg = 0.453592;
		const miToKm = 1.60934;

		const convertMap = {
			gal: initNum * galToL,
			l: initNum / galToL,
			lbs: initNum * lbsToKg,
			kg: initNum / lbsToKg,
			mi: initNum * miToKm,
			km: initNum / miToKm,
		};

		const returnNumber = convertMap[initUnit].toFixed(5);
		const returnUnit = this.getReturnUnit(initUnit);
		const returnString = this.getString(
			parseFloat(initNum),
			initUnit,
			returnNumber,
			returnUnit.toLowerCase()
		);

		if (returnNumber)
			return {
				initNum: parseFloat(initNum),
				initUnit: units[initUnit],
				returnNum: parseFloat(returnNumber),
				returnUnit: returnUnit,
				string: returnString,
			};
	};

	this.getString = function (initNum, initUnit, returnNum, returnUnit) {
		const initUnitString = this.spellOutUnit(initUnit);
		const returnUnitString = this.spellOutUnit(returnUnit);

		return `${initNum} ${initUnitString} converts to ${returnNum} ${returnUnitString}`;
	};
}

module.exports = ConvertHandler;
