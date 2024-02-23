const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
	test('Logic handles a valid puzzle string of 81 characters', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const result = solver.validate(puzzle);
		assert.isUndefined(result, 'For a valid string the solver should return nothing');
	});
	test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.H`?';
		const result = solver.validate(puzzle);
		assert.isObject(result);
		assert.property(result, 'error');
		assert.property(result, 'error', 'Invalid characters in puzzle');
	});
	test('Logic handles a puzzle string that is not 81 characters in length', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92691';
		const result = solver.validate(puzzle);
		assert.isObject(result);
		assert.property(result, 'error');
		assert.property(result, 'error', 'Expected puzzle to be 81 characters long');
	});
	test('Logic handles a valid row placement', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const coord = 'A2';
		const value = '3';
		const result = solver.checkRowPlacement(
			puzzle,
			solver.rowLetterToIndex(coord[0]),
			solver.colNumberToIndex(coord[1]),
			value
		);
		assert.isFalse(result);
	});
	test('Logic handles an invalid row placement', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const coord = 'A2';
		const value = '2';
		const result = solver.checkRowPlacement(
			puzzle,
			solver.rowLetterToIndex(coord[0]),
			solver.colNumberToIndex(coord[1]),
			value
		);
		assert.isTrue(result);
	});
	test('Logic handles a valid column placement', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const coord = 'A2';
		const value = '3';
		const result = solver.checkColPlacement(
			puzzle,
			solver.rowLetterToIndex(coord[0]),
			solver.colNumberToIndex(coord[1]),
			value
		);
		assert.isFalse(result);
	});
	test('Logic handles an invalid column placement', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const coord = 'A2';
		const value = '2';
		const result = solver.checkColPlacement(
			puzzle,
			solver.rowLetterToIndex(coord[0]),
			solver.colNumberToIndex(coord[1]),
			value
		);
		assert.isTrue(result);
	});
	test('Logic handles a valid region (3x3 grid) placement', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const coord = 'A2';
		const value = '3';
		const result = solver.checkRegionPlacement(
			puzzle,
			solver.rowLetterToIndex(coord[0]),
			solver.colNumberToIndex(coord[1]),
			value
		);
		assert.isFalse(result);
	});
	test('Logic handles an invalid region (3x3 grid) placement', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const coord = 'A2';
		const value = '2';
		const result = solver.checkRegionPlacement(
			puzzle,
			solver.rowLetterToIndex(coord[0]),
			solver.colNumberToIndex(coord[1]),
			value
		);
		assert.isTrue(result);
	});
	test('Valid puzzle strings pass the solver', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const result = solver.solve(puzzle);
		// console.log(result);
		assert.isObject(result);
		assert.property(result, 'solution');
		assert.notProperty(result, 'error');
	});
	test('Invalid puzzle strings fail the solver', () => {
		const puzzle =
			'115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const result = solver.solve(puzzle);
		assert.isObject(result);
		assert.property(result, 'error');
		assert.propertyVal(result, 'error', 'Puzzle cannot be solved');
	});
	test('Solver returns the expected solution for an incomplete puzzle', () => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
		const solution =
			'135762984946381257728459613694517832812936745357824196473298561581673429269145378';
		const result = solver.solve(puzzle);
		assert.isObject(result);
		assert.property(result, 'solution');
		assert.propertyVal(result, 'solution', solution);
	});
});
