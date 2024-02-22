/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
	/*
	 * ----[EXAMPLE TEST]----
	 * Each test should completely test the response of the API end-point including response status code!
	 */
	// test('#example Test GET /api/books', function (done) {
	// 	chai.request(server)
	// 		.get('/api/books')
	// 		.end(function (err, res) {
	// 			assert.equal(res.status, 200);
	// 			assert.isArray(res.body, 'response should be an array');
	// 			assert.property(
	// 				res.body[0],
	// 				'commentcount',
	// 				'Books in array should contain commentcount'
	// 			);
	// 			assert.property(res.body[0], 'title', 'Books in array should contain title');
	// 			assert.property(res.body[0], '_id', 'Books in array should contain _id');
	// 			done();
	// 		});
	// });
	/*
	 * ----[END of EXAMPLE TEST]----
	 */

	suite('Routing tests', function () {
		suite('POST /api/books with title => create book object/expect book object', function () {
			test('Test POST /api/books with title', function (done) {
				const bookTitle = 'POST Book Test Title';
				chai.request(server)
					.post('/api/books')
					.send({ title: bookTitle })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isObject(res.body);
						assert.property(res.body, '_id');
						assert.property(res.body, 'title');
						assert.propertyVal(res.body, 'title', bookTitle);
						done();
					});
			});

			test('Test POST /api/books with no title given', function (done) {
				chai.request(server)
					.post('/api/books')
					.send({})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body, 'missing required field title');
						done();
					});
			});
		});

		suite('GET /api/books => array of books', function () {
			test('Test GET /api/books', function (done) {
				chai.request(server)
					.get('/api/books')
					.end(function (err, res) {
						assert.equal(res.status, 200);
						assert.isArray(res.body, 'response should be an array');
						assert.property(
							res.body[0],
							'commentcount',
							'Books in array should contain commentcount'
						);
						assert.property(
							res.body[0],
							'title',
							'Books in array should contain title'
						);
						assert.property(res.body[0], '_id', 'Books in array should contain _id');
						done();
					});
			});
		});

		suite('GET /api/books/[id] => book object with [id]', function () {
			test('Test GET /api/books/[id] with id not in db', function (done) {
				const bookID = '111111111111111111111111';
				chai.request(server)
					.get(`/api/books/${bookID}`)
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body, 'no book exists');
						done();
					});
			});

			test('Test GET /api/books/[id] with valid id in db', function (done) {
				const bookTitle = 'POST Book Test Title';
				chai.request(server)
					.post('/api/books')
					.send({ title: bookTitle })
					.then((data) => {
						const bookID = data.body._id;
						chai.request(server)
							.get(`/api/books/${bookID}`)
							.end((err, res) => {
								assert.equal(res.status, 200);
								assert.isObject(res.body);
								assert.property(res.body, '_id', 'Missing ID property');
								assert.property(res.body, 'title', 'Missing title property');
								assert.propertyVal(
									res.body,
									'title',
									bookTitle,
									'Response has wrong book title'
								);
								assert.property(res.body, 'comments', 'Missing comments property');
								assert.isArray(
									res.body.comments,
									'Comments property is not an array'
								);
								done();
							});
					});
			});
		});

		suite('POST /api/books/[id] => add comment/expect book object with id', function () {
			test('Test POST /api/books/[id] with comment', function (done) {
				const bookTitle = 'POST Comment Test Title';
				const bookComment = 'POST Comment test comment';

				chai.request(server)
					.post('/api/books')
					.send({ title: bookTitle })
					.then((data) => {
						const bookID = data.body._id;
						chai.request(server)
							.post(`/api/books/${bookID}`)
							.send({ comment: bookComment })
							.end((err, res) => {
								assert.equal(res.status, 200);
								assert.isObject(res.body);
								assert.property(res.body, '_id');
								assert.property(res.body, 'title');
								assert.propertyVal(res.body, 'title', bookTitle);
								assert.property(res.body, 'comments');
								assert.isArray(res.body.comments);
								assert.include(res.body.comments, bookComment);
								done();
							});
					});
			});

			test('Test POST /api/books/[id] without comment field', function (done) {
				const bookTitle = 'POST Comment No Comment Test Title';

				chai.request(server)
					.post('/api/books')
					.send({ title: bookTitle })
					.then((data) => {
						const bookID = data.body._id;
						chai.request(server)
							.post(`/api/books/${bookID}`)
							.send({})
							.end((err, res) => {
								assert.equal(res.status, 200);
								assert.equal(res.body, 'missing required field comment');
								done();
							});
					});
			});

			test('Test POST /api/books/[id] with comment, id not in db', function (done) {
				const bookID = '111111111111111111111111';
				const bookComment = 'POST Comment test comment';
				chai.request(server)
					.post(`/api/books/${bookID}`)
					.send({ comment: bookComment })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body, 'no book exists');
						done();
					});
			});
		});

		suite('DELETE /api/books/[id] => delete book object id', function () {
			test('Test DELETE /api/books/[id] with valid id in db', function (done) {
				const bookTitle = 'DELETE Book Test Title';
				chai.request(server)
					.post('/api/books')
					.send({ title: bookTitle })
					.then((data) => {
						const bookID = data.body._id;
						chai.request(server)
							.delete(`/api/books/${bookID}`)
							.end((err, res) => {
								assert.equal(res.status, 200);
								assert.equal(res.body, 'delete successful');
								done();
							});
					});
			});

			test('Test DELETE /api/books/[id] with  id not in db', function (done) {
				const bookID = '111111111111111111111111';
				chai.request(server)
					.delete(`/api/books/${bookID}`)
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.equal(res.body, 'no book exists');
						done();
					});
			});
		});
	});
});
