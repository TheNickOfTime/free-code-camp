const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', () => {
	test('convertHandler should correctly read a whole number input.', () => {
		const number = convertHandler.convert('5', 'lbs').initNum;
		assert.isTrue(Number.isInteger(number));
	});

	test('convertHandler should correctly read a decimal number input.', () => {
		const number = convertHandler.convert('5.1', 'lbs').initNum;
		assert.isTrue(!Number.isInteger(number));
	});

	test('convertHandler should correctly read a fractional input.', () => {
		const number = convertHandler.convert('5/2', 'lbs').initNum;
		assert.isNumber(number);
	});

	test('convertHandler should correctly read a fractional input with a decimal.', () => {
		const number = convertHandler.convert('5.5/2', 'lbs').initNum;
		assert.isNumber(number);
	});

	test('convertHandler should correctly return an error on a double-fraction (i.e. 3/2/3)', () => {
		const result = convertHandler.getNum('3/2/3lbs');
		assert.isNull(result);
	});

	test('convertHandler should correctly default to a numerical input of 1 when no numerical input is provided.', () => {
		const result = convertHandler.getNum('km');
		assert.equal(result, 1);
	});

	test('convertHandler should correctly read each valid input unit.', () => {
		const units = {
			gal: 'gal',
			l: 'L',
			lbs: 'lbs',
			kg: 'kg',
			mi: 'mi',
			km: 'km',
		};

		const result = Object.keys(units).every((item, index) => {
			const unit = convertHandler.getUnit(units[item]);
			return unit === item;
		});

		assert.isTrue(result);
	});

	test('convertHandler should correctly return an error for an invalid input unit.', () => {
		const result = convertHandler.getUnit('5cm');
		assert.isNull(result);
	});

	test('convertHandler should return the correct return unit for each valid input unit.', () => {
		const units = {
			gal: 'L',
			l: 'gal',
			lbs: 'kg',
			kg: 'lbs',
			mi: 'km',
			km: 'mi',
		};

		const result = Object.keys(units).every((item, index) => {
			const unit = convertHandler.getReturnUnit(item);
			return unit === units[item];
		});

		assert.isTrue(result);
	});

	test('convertHandler should correctly return the spelled-out string unit for each valid input unit.', () => {
		const unitMap = {
			gal: 'gallons',
			l: 'liters',
			lbs: 'pounds',
			kg: 'kilograms',
			mi: 'miles',
			km: 'kilometers',
		};

		const result = Object.keys(unitMap).every((item, index) => {
			const unit = convertHandler.spellOutUnit(item);
			return unit === unitMap[item];
		});

		assert.isTrue(result);
	});

	test('convertHandler should correctly convert gal to L', () => {
		const result = convertHandler.convert(1, 'gal');
		assert.equal(result.returnNum, 3.78541);
	});

	test('convertHandler should correctly convert L to gal', () => {
		const result = convertHandler.convert(1, 'l');
		assert.equal(result.returnNum, parseFloat((1 / 3.78541).toFixed(5)));
	});

	test('convertHandler should correctly convert mi to km', () => {
		const result = convertHandler.convert(1, 'mi');
		assert.equal(result.returnNum, 1.60934);
	});

	test('convertHandler should correctly convert km to mi', () => {
		const result = convertHandler.convert(1, 'km');
		assert.equal(result.returnNum, parseFloat((1 / 1.60934).toFixed(5)));
	});

	test('convertHandler should correctly convert lbs to kg', () => {
		const result = convertHandler.convert(1, 'lbs');
		assert.equal(result.returnNum, 0.45359);
	});

	test('convertHandler should correctly convert kg to lbs', () => {
		const result = convertHandler.convert(1, 'kg');
		assert.equal(result.returnNum, parseFloat((1 / 0.453592).toFixed(5)));
	});
});
