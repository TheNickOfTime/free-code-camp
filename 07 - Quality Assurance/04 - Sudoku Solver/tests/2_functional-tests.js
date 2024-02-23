const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const puzzleStrings = require('../controllers/puzzle-strings').puzzlesAndSolutions;

suite('Functional Tests', () => {
	test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
		const puzzle = puzzleStrings[0][0];
		const solution = puzzleStrings[0][1];
		chai.request(server)
			.keepOpen()
			.post('/api/solve')
			.send({ puzzle: puzzle })
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'solution');
				assert.property(result, 'solution', solution);
				done();
			});
	});
	test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
		chai.request(server)
			.keepOpen()
			.post('/api/solve')
			.send({})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Required field missing');
				done();
			});
	});
	test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
		const puzzle =
			'5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.7ASDF?';
		chai.request(server)
			.keepOpen()
			.post('/api/solve')
			.send({ puzzle: puzzle })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
				done();
			});
	});
	test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
		const puzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..';
		chai.request(server)
			.keepOpen()
			.post('/api/solve')
			.send({ puzzle: puzzle })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
				done();
			});
	});
	test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
		const puzzle =
			'999..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
		chai.request(server)
			.keepOpen()
			.post('/api/solve')
			.send({ puzzle: puzzle })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, 'error');
				assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved');
				done();
			});
	});
	test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'A1';
		const value = '9';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'valid');
				done();
			});
	});
	test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'A2';
		const value = '1';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'valid');
				assert.propertyVal(result, 'valid', false);
				assert.property(result, 'conflict');
				assert.deepPropertyVal(result, 'conflict', ['row']);
				done();
			});
	});
	test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'A2';
		const value = '3';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'valid');
				assert.propertyVal(result, 'valid', false);
				assert.property(result, 'conflict');
				assert.deepPropertyVal(result, 'conflict', ['row', 'region']);
				done();
			});
	});
	test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'A2';
		const value = '5';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'valid');
				assert.propertyVal(result, 'valid', false);
				assert.property(result, 'conflict');
				assert.deepPropertyVal(result, 'conflict', ['row', 'column', 'region']);
				done();
			});
	});
	test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'A2';
		const value = '5';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'error');
				assert.propertyVal(result, 'error', 'Required field(s) missing');
				done();
			});
	});
	test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.H`?';
		const coord = 'A2';
		const value = '5';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'error');
				assert.propertyVal(result, 'error', 'Invalid characters in puzzle');
				done();
			});
	});
	test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
		const puzzle =
			'1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....92691';
		const coord = 'A2';
		const value = '5';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'error');
				assert.propertyVal(result, 'error', 'Expected puzzle to be 81 characters long');
				done();
			});
	});
	test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'X10';
		const value = '9';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'error');
				assert.propertyVal(result, 'error', 'Invalid coordinate');
				done();
			});
	});
	test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
		const puzzle = puzzleStrings[1][0];
		const coord = 'A1';
		const value = 'F';
		chai.request(server)
			.keepOpen()
			.post('/api/check')
			.send({
				puzzle: puzzle,
				coordinate: coord,
				value: value,
			})
			.end((err, res) => {
				const result = res.body;
				assert.equal(res.status, 200);
				assert.isObject(result);
				assert.property(result, 'error');
				assert.propertyVal(result, 'error', 'Invalid value');
				done();
			});
	});
});
