const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let threadIDs = [];
let replyIDs = {};

// Make test threads
for (let i = 0; i < 12; i++) {
	chai.request(server)
		.post('/api/threads/chai_test')
		.send({
			text: `Test thread number ${i}`,
			delete_password: 'testpassword',
		})
		.end((err, res) => {
			const threadID = res.body._id;
			threadIDs.push(threadID);
			replyIDs[threadID] = [];

			for (let j = 0; j < i; j++) {
				chai.request(server)
					.post('/api/replies/chai_test')
					.send({
						thread_id: res.body._id,
						text: `Test reply number ${j}`,
						delete_password: 'testpassword',
					})
					.end((err, res) => {
						replyIDs[threadID].push(res.body._id);
					});
			}
		});
}

console.log(replyIDs);

suite('Functional Tests', function () {
	test('Creating a new thread: POST request to /api/threads/{board}', (done) => {
		chai.request(server)
			.post('/api/threads/chai_test')
			.send({
				text: 'Testing new thread POST',
				delete_password: 'testpassword',
			})
			.end(function (err, res) {
				assert.equal(res.status, 200);
				assert.isObject(res.body);
				assert.property(res.body, '_id');
				assert.property(res.body, 'text');
				assert.property(res.body, 'created_on');
				assert.property(res.body, 'bumped_on');
				assert.property(res.body, 'reported');
				assert.property(res.body, 'delete_password');
				assert.property(res.body, 'replies');
				done();
			});
	});
	test('Viewing the 10 most recent threads with 3 replies each: GET request to /api/threads/{board}', (done) => {
		chai.request(server)
			.get('/api/threads/chai_test')
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.isArray(res.body);
				assert.isAtMost(res.body.length, 10);
				for (thread of res.body) {
					assert.isAtMost(thread.replies.length, 3);
				}
				done();
			});
	});
	test('Deleting a thread with the incorrect password: DELETE request to /api/threads/{board} with an invalid delete_password', (done) => {
		chai.request(server)
			.delete('/api/threads/chai_test')
			.send({
				thread_id: threadIDs[0],
				delete_password: 'wrongpassword',
			})
			.end((err, res) => {
				// console.log(res.text);
				assert.equal(res.status, 200);
				assert.equal(res.text, 'incorrect password');
				done();
			});
	});
	test('Deleting a thread with the correct password: DELETE request to /api/threads/{board} with a valid delete_password', (done) => {
		chai.request(server)
			.delete('/api/threads/chai_test')
			.send({
				thread_id: threadIDs[0],
				delete_password: 'testpassword',
			})
			.end((err, res) => {
				// console.log(res.text);
				assert.equal(res.status, 200);
				assert.equal(res.text, 'success');
				done();
			});
	});
	test('Reporting a thread: PUT request to /api/threads/{board}', (done) => {
		chai.request(server)
			.put('/api/threads/chai_test')
			.send({ thread_id: threadIDs[1] })
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'reported');
				done();
			});
	});
	test('Creating a new reply: POST request to /api/replies/{board}', (done) => {
		chai.request(server)
			.post('/api/replies/chai_test')
			.send({
				thread_id: threadIDs[2],
				text: `Testing new reply POST`,
				delete_password: 'testpassword',
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.property(res.body, '_id');
				assert.property(res.body, 'text');
				assert.property(res.body, 'created_on');
				assert.property(res.body, 'reported');
				assert.property(res.body, 'delete_password');
				done();
			});
	});
	test('Viewing a single thread with all replies: GET request to /api/replies/{board}', (done) => {
		// const initReplies = replyIDs[threadIDs[3]];
		chai.request(server)
			.get(`/api/replies/chai_test?thread_id=${threadIDs[3]}`)
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.property(res.body, '_id');
				assert.property(res.body, 'text');
				assert.property(res.body, 'created_on');
				assert.property(res.body, 'bumped_on');
				assert.notProperty(res.body, 'reported');
				assert.notProperty(res.body, 'delete_password');
				assert.property(res.body, 'replies');
				assert.isArray(res.body.replies);
				done();
			});
	});
	test('Deleting a reply with the incorrect password: DELETE request to /api/replies/{board} with an invalid delete_password', (done) => {
		chai.request(server)
			.delete('/api/replies/chai_test')
			.send({
				thread_id: threadIDs[4],
				reply_id: replyIDs[threadIDs[4]][0],
				delete_password: 'wrongpassword',
			})
			.end((err, res) => {
				// console.log(res.text);
				assert.equal(res.status, 200);
				assert.equal(res.text, 'incorrect password');
				done();
			});
	});
	test('Deleting a reply with the correct password: DELETE request to /api/replies/{board} with a valid delete_password', (done) => {
		// console.log(threadIDs[4]);
		// console.log(replyIDs[threadIDs[4]][0]);
		// console.log(replyIDs);

		chai.request(server)
			.delete('/api/replies/chai_test')
			.send({
				thread_id: threadIDs[4],
				reply_id: replyIDs[threadIDs[4]][0],
				delete_password: 'testpassword',
			})
			.end((err, res) => {
				// console.log(res.text);
				assert.equal(res.status, 200);
				assert.equal(res.text, 'success');
				done();
			});
	});
	test('Reporting a reply: PUT request to /api/replies/{board}', (done) => {
		chai.request(server)
			.put('/api/threads/chai_test')
			.send({
				thread_id: threadIDs[5],
				reply_id: replyIDs[threadIDs[5]][0],
			})
			.end((err, res) => {
				assert.equal(res.status, 200);
				assert.equal(res.text, 'reported');
				done();
			});
	});
});
