class SudokuSolver {
	validate(puzzleString) {
		// Check for valid number of characters --------------------------------
		const characterArray = puzzleString.split('');
		if (characterArray.length !== 81) {
			return { error: 'Expected puzzle to be 81 characters long' };
		}

		// Check for valid character types -------------------------------------
		const characterRegex = /^[0-9.]$/;
		const allValidCharacters = characterArray.every((character) =>
			characterRegex.test(character)
		);
		if (!allValidCharacters) {
			return { error: 'Invalid characters in puzzle' };
		}

		// Check for valid puzzle composition ----------------------------------
		const rows = puzzleString.match(/.{1,9}/g);
		const columns = rows[0].split('').map((col, index) => rows.map((row) => row[index]));
		const regions = rows
			.map((row) => row.match(/.{1,3}/g))[0]
			.map((col, index, arr) =>
				rows
					.map((row) => row.match(/.{1,3}/g))
					.map((row) => row[index])
					.join('')
					.match(/.{1,9}/g)
			)
			.flat();
		// console.log(regions);
		const uniqueRows = rows.every((row) => {
			const filteredRow = row.split('').filter((character) => character != '.');
			return new Set(filteredRow).size == filteredRow.length;
		});
		// console.log(uniqueRows);
		const uniqueColumns = columns.every((col) => {
			const filteredCol = col.filter((character) => character != '.');
			return new Set(filteredCol).size == filteredCol.length;
		});
		// console.log(uniqueColumns);
		const uniqueRegions = regions.every((reg) => {
			const filteredReg = reg.split('').filter((character) => character != '.');
			return new Set(filteredReg).size == filteredReg.length;
		});
		// console.log(uniqueRegions);
		if (!uniqueRows || !uniqueColumns || !uniqueRegions) {
			return { error: 'Puzzle cannot be solved' };
		}
	}

	rowLetterToIndex(letter) {
		const letterMap = {
			a: 0,
			b: 1,
			c: 2,
			d: 3,
			e: 4,
			f: 5,
			g: 6,
			h: 7,
			i: 8,
		};
		return letterMap[letter.toLowerCase()];
	}

	colNumberToIndex(number) {
		return number - 1;
	}

	colAndRowToRegionIndex(col, row) {
		const rowRegionIndex = Math.floor(row / 3);
		const colRegionIndex = Math.floor(col / 3);
		const regionIndex = rowRegionIndex * 3 + colRegionIndex;
		// console.log(row, col, rowRegionIndex, colRegionIndex, regionIndex);
		return regionIndex;
	}

	checkRowPlacement(puzzleString, row, column, value) {
		const puzzleRow = puzzleString.match(/.{1,9}/g)[row].split('');
		// console.log(puzzleRow);

		return puzzleRow.includes(value);
	}

	checkColPlacement(puzzleString, row, column, value) {
		const puzzleCol = puzzleString.match(/.{1,9}/g).map((row) => row[column]);
		// console.log(puzzleCol);
		return puzzleCol.includes(value);
	}

	checkRegionPlacement(puzzleString, row, column, value) {
		const splitPuzzleString = puzzleString.match(/.{1,9}/g).map((row) => row.match(/.{1,3}/g));
		const unorderedPuzzleRegions = splitPuzzleString[0].map((col, index) =>
			splitPuzzleString
				.map((row) => row[index])
				.join('')
				.match(/.{1,9}/g)
		);
		const puzzleRegions = unorderedPuzzleRegions[0]
			.map((col, index) => unorderedPuzzleRegions.map((row) => row[index]))
			.flat();
		const regionIndex = this.colAndRowToRegionIndex(column, row);
		// console.log(puzzleRegions);
		const puzzleRegion = puzzleRegions[regionIndex].split('');
		// console.log(puzzleRegion);
		return puzzleRegion.includes(value);
	}

	checkIsSame(puzzleString, row, column, value) {
		const puzzleRow = puzzleString.match(/.{1,9}/g)[row].split('');

		return value == puzzleRow[column];
	}

	check(puzzle, row, col, value) {
		let result = true;
		let conflict = [];

		const isSame = this.checkIsSame(puzzle, row, col, value);
		if (!isSame) {
			const isInRow = this.checkRowPlacement(puzzle, row, col, value);
			if (isInRow) {
				result = false;
				conflict.push('row');
			}
			const isInCol = this.checkColPlacement(puzzle, row, col, value);
			if (isInCol) {
				result = false;
				conflict.push('column');
			}

			const isInRegion = this.checkRegionPlacement(puzzle, row, col, value);
			if (isInRegion) {
				result = false;
				conflict.push('region');
			}
		}

		conflict = conflict.length > 0 ? conflict : undefined;
		return { valid: result, conflict: conflict };
	}

	solve(puzzleString) {
		const isInvalidPuzzle = this.validate(puzzleString);
		if (isInvalidPuzzle) {
			// res.json(isInvalidPuzzle);
			return isInvalidPuzzle;
		}

		// Get full puzzle and coordinates to solve ----------------------------
		let puzzle = puzzleString;
		let coordsToSolve = puzzle
			.match(/.{1,9}/g)
			.map((row, rowIndex) =>
				row
					.split('')
					.map((col, colIndex) => (/[.]/.test(col) ? [rowIndex, colIndex] : null))
			)
			.flat()
			.filter((value) => value !== null);
		// console.log(coordsToSolve);

		while (coordsToSolve.length > 0) {
			//Find potential values for each box
			const potentialValues = coordsToSolve.reduce((obj, item) => {
				return {
					...obj,
					[item.toString()]: [],
				};
			}, {});

			for (let key of coordsToSolve) {
				let nums = [];
				for (let i = 1; i <= 9; i++) {
					// const value = i;
					const rowCheck = this.checkRowPlacement(puzzle, key[0], key[1], i.toString());
					const colCheck = this.checkColPlacement(puzzle, key[0], key[1], i.toString());
					const regionCheck = this.checkRegionPlacement(
						puzzle,
						key[0],
						key[1],
						i.toString()
					);

					if (!rowCheck && !colCheck && !regionCheck) {
						nums.push(i.toString());
					}
				}
				potentialValues[key.toString()] = nums;
			}

			let puzzleByRow = puzzle.match(/.{1,9}/g).map((row) => row.split(''));
			const sortedPotentialValues = Object.entries(potentialValues).sort(
				(a, b) => a[1].length - b[1].length
			);

			sortedPotentialValues.forEach(([coord, values]) => {
				// console.log(coord, values);
				const row = coord[0];
				const col = coord[2];
				if (values.length === 1) {
					puzzleByRow[row][col] = values[0];
					coordsToSolve = coordsToSolve.filter(
						(coordinate) => coordinate.toString() != coord
					);
					// console.log(coordsToSolve, [parseInt(row), parseInt(col)]);
				}
			});
			puzzle = puzzleByRow.flat().join('');
			// console.log(puzzle);
		}
		return { solution: puzzle };
	}
}

module.exports = SudokuSolver;
