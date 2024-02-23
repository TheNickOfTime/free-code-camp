'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route('/api/check').post((req, res) => {
		const puzzle = req.body.puzzle;
		const coordinate = req.body.coordinate;
		const value = req.body.value;

		// console.log(`Checking ${coordinate}, ${value} against ${puzzle}`);

		if (puzzle && coordinate && value) {
			const isValidCoordinate =
				coordinate.length === 2 &&
				/[a-i]/i.test(coordinate[0]) &&
				/[1-9]/.test(coordinate[1]);
			if (!isValidCoordinate) {
				res.json({ error: 'Invalid coordinate' });
				return;
			}

			const isValidValue = value.length === 1 && /[1-9]/.test(value);
			if (!isValidValue) {
				res.json({ error: 'Invalid value' });
				return;
			}

			const isInvalidPuzzle = solver.validate(puzzle);
			if (!isInvalidPuzzle) {
				const row = solver.rowLetterToIndex(req.body.coordinate[0]);
				const col = solver.colNumberToIndex(req.body.coordinate[1]);
				const value = req.body.value;

				const result = solver.check(puzzle, row, col, value);
				res.json(result);
				return;
			} else {
				res.json(isInvalidPuzzle);
				return;
			}
		} else {
			res.json({ error: 'Required field(s) missing' });
			return;
		}
	});

	app.route('/api/solve').post((req, res) => {
		const puzzle = req.body.puzzle;

		if (puzzle) {
			// console.log(`Solving against \n${puzzle.match(/.{1,9}/g).join('\n')}`);
			// const isInvalidPuzzle = solver.validate(puzzle);
			// if (!isInvalidPuzzle) {
			// 	const solution = solver.solve(puzzle);
			// 	res.json({ solution: solution });
			// 	return { solution: solution };
			// } else {
			// 	res.json(isInvalidPuzzle);
			// 	return isInvalidPuzzle;
			// }
			res.json(solver.solve(puzzle));
		} else {
			res.json({ error: 'Required field missing' });
			return;
		}
	});
};
