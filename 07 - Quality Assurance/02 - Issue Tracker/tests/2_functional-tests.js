const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const axios = require('axios');

chai.use(chaiHttp);

suite('Functional Tests', function () {
	test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
		const data = {
			issue_title: 'Test title',
			issue_text: 'This is test text.',
			created_by: 'Nick',
			assigned_to: 'Nick',
			status_text: 'In Progress',
		};

		chai.request(server)
			.keepOpen()
			.post('/api/issues/apitest')
			.type('form')
			.send(data)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				for (key of Object.keys(data)) {
					assert.propertyVal(res.body, key, data[key]);
				}
				done();
			});
	});
	test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
		const data = {
			issue_title: 'Test title',
			issue_text: 'This is test text.',
			created_by: 'Nick',
		};

		chai.request(server)
			.keepOpen()
			.post('/api/issues/apitest')
			.type('form')
			.send(data)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				for (key of Object.keys(data)) {
					assert.propertyVal(res.body, key, data[key]);
				}
				assert.equal(res.body.assigned_to, '');
				assert.equal(res.body.status_text, '');
				done();
			});
	});
	test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
		const data = {
			assigned_to: 'Nick',
			status_text: 'In Progress',
		};

		chai.request(server)
			.keepOpen()
			.post('/api/issues/apitest')
			.type('form')
			.send(data)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				assert.deepEqual(res.body, { error: 'required field(s) missing' });
				done();
			});
	});
	test('View issues on a project: GET request to /api/issues/{project}', (done) => {
		chai.request(server)
			.keepOpen()
			.get('/api/issues/apitest')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				assert.isArray(res.body);
				done();
			});
	});
	test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
		chai.request(server)
			.keepOpen()
			.get('/api/issues/apitest?status_text=In Progress')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				assert.isArray(res.body);
				assert.isAtLeast(res.body.length, 1);
				done();
			});
	});
	test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
		chai.request(server)
			.keepOpen()
			.get('/api/issues/apitest?status_text=In Progress&created_by=Nick')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				assert.isArray(res.body);
				assert.isAtLeast(res.body.length, 1);
				done();
			});
	});
	test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing put with one field',
				issue_text: 'This is a bug for testing put with one field',
				created_by: 'Chai',
			})
			.then(({ data }) => {
				chai.request(server)
					.keepOpen()
					.put('/api/issues/apitest')
					.send({
						_id: data._id,
						status_text: 'Believed Fixed',
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, {
							result: 'successfully updated',
							_id: data._id,
						});
						done();
					});
			});
	});
	test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing put with multiple fields',
				issue_text: 'This is a bug for testing put with multiple fields',
				created_by: 'Chai',
			})
			.then(({ data }) => {
				chai.request(server)
					.keepOpen()
					.put('/api/issues/apitest')
					.send({
						_id: data._id,
						status_text: 'Done',
						open: false,
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, {
							result: 'successfully updated',
							_id: data._id,
						});
						done();
					});
			});
	});
	test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing put with a missing ID',
				issue_text: 'This is a bug for testing put with a missing ID.',
				created_by: 'Chai',
			})
			.then(({ data }) => {
				chai.request(server)
					.keepOpen()
					.put('/api/issues/apitest')
					.send({
						status_text: 'Done',
						open: false,
					})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, { error: 'missing _id' });
						done();
					});
			});
	});
	test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing put with no fields',
				issue_text: 'This is a bug for testing put with no fields.',
				created_by: 'Chai',
			})
			.then(({ data }) => {
				chai.request(server)
					.keepOpen()
					.put('/api/issues/apitest')
					.send({ _id: data._id })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, {
							error: 'no update field(s) sent',
							_id: data._id,
						});
						done();
					});
			});
	});
	test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
		const bugID = '111111111111111111111111';
		chai.request(server)
			.keepOpen()
			.put('/api/issues/apitest')
			.send({
				_id: bugID,
				status_text: 'Done',
				open: false,
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isNotNull(res.body);
				assert.deepEqual(res.body, { error: 'could not update', '_id': bugID });
				done();
			});
	});
	test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing delete',
				issue_text: 'This is a bug for testing delete.',
				created_by: 'Chai',
			})
			.then((data) => {
				// console.log(data.data);
				chai.request(server)
					.keepOpen()
					.delete('/api/issues/apitest')
					.send({ _id: data.data._id })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, {
							result: 'successfully deleted',
							_id: data.data._id,
						});
						done();
					});
			});
	});
	test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing delete with an invalid ID',
				issue_text: 'This is a bug for testing delete with an invalid ID.',
				created_by: 'Chai',
			})
			.then((data) => {
				// console.log(data.data);
				chai.request(server)
					.keepOpen()
					.delete('/api/issues/apitest')
					.send({ _id: '111111111111111111111111' })
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, {
							error: 'could not delete',
							'_id': '111111111111111111111111',
						});
						done();
					});
			});
	});
	test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
		axios
			.post('http://localhost:3000/api/issues/apitest', {
				issue_title: 'Bug for testing delete with no ID',
				issue_text: 'This is a bug for testing delete with no ID.',
				created_by: 'Chai',
			})
			.then((data) => {
				// console.log(data.data);
				chai.request(server)
					.keepOpen()
					.delete('/api/issues/apitest')
					.send({})
					.end((err, res) => {
						assert.equal(res.status, 200);
						assert.isNotNull(res.body);
						assert.deepEqual(res.body, { error: 'missing _id' });
						done();
					});
			});
	});
});
