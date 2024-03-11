'use strict';

const { createHash } = require('crypto');
const { ObjectId } = require('mongodb');

module.exports = function (app, db) {
	const getExistingThread = async (board, threadID) => {
		const boardCollection = db.collection(board);
		const threadData = await boardCollection.findOne({ _id: new ObjectId(threadID) });
		return threadData;
	};

	const deleteExistingThread = async (board, threadID) => {
		const boardCollection = db.collection(board);
		// const repliesCollection = await db.collection(`replies_${threadID}`);
		const deleteResult = await boardCollection.deleteOne({ _id: new ObjectId(threadID) });
		// const deleteReplies = await repliesCollection.drop();
		return deleteResult;
	};

	const updateExistingThread = async (board, threadID, updateData) => {
		const boardCollection = db.collection(board);
		const updateResult = await boardCollection.updateOne(
			{ _id: new ObjectId(threadID) },
			updateData,
			{ upsert: false }
		);
		return updateResult;
	};

	const updateExistingReply = async (board, threadID, replyID, updateData) => {
		const boardCollection = db.collection(board);
		const updateResult = await boardCollection.updateOne(
			{ _id: new ObjectId(threadID), 'replies._id': new ObjectId(replyID) },
			updateData,
			{ upsert: false }
		);
		return updateResult;
	};

	const deleteExistingReply = async (board, threadID, replyID, updateData) => {
		const boardCollection = db.collection(board);
		const updateResult = await boardCollection.updateOne(
			{ _id: new ObjectId(threadID), 'replies._id': new ObjectId(replyID) },
			updateData,
			{ upsert: false }
		);
		return updateResult;
	};

	const hashPassword = (password) => {
		return createHash('sha256').update(password).digest('base64');
	};

	app.post('/api/threads/:board', async (req, res) => {
		const board = req.params.board;
		const { text, delete_password } = req.body;
		const boardCollection = db.collection(board);
		const newThreadData = {
			text: text,
			created_on: new Date(Date.now()),
			bumped_on: new Date(Date.now()),
			reported: false,
			delete_password: hashPassword(delete_password),
			replies: [],
		};
		const newThread = await boardCollection.insertOne(newThreadData);
		res.json({ _id: newThread.insertedId, ...newThreadData });
	});

	app.get('/api/threads/:board', async (req, res) => {
		const board = req.params.board;
		const boardCollection = db.collection(board);
		const boardData = await boardCollection.find().toArray();
		const result = boardData
			.map((thread) => {
				return {
					_id: thread._id,
					name: thread.name,
					text: thread.text,
					created_on: thread.created_on,
					bumped_on: thread.bumped_on,
					replies: thread.replies
						.map((reply) => {
							return {
								_id: reply._id,
								text: reply.text,
								created_on: reply.created_on,
							};
						})
						.slice(0, 3),
				};
			})
			.slice(0, 9);
		res.json(result);
	});

	app.delete('/api/threads/:board', async (req, res) => {
		const board = req.params.board;
		const { thread_id, delete_password } = req.body;

		const threadData = await getExistingThread(board, thread_id);
		const passwordHash = hashPassword(delete_password);
		const passwordHashMatch = passwordHash === threadData.delete_password;
		if (passwordHashMatch) {
			deleteExistingThread(board, thread_id);
			res.send('success');
		} else {
			res.send('incorrect password');
		}
	});

	app.put('/api/threads/:board', async (req, res) => {
		const board = req.params.board;
		const { thread_id } = req.body;
		const updateData = {
			$set: {
				reported: true,
			},
		};
		const updateResult = await updateExistingThread(board, thread_id, updateData);
		// console.log(updateResult);
		if (updateResult.modifiedCount === 1) {
			res.send('reported');
		} else {
			if (updateResult.matchedCount === 1) {
				res.send('thread has alraedy been reported');
			} else {
				res.send(`no thread found with id ${thread_id}`);
			}
		}
	});

	app.post('/api/replies/:board', async (req, res) => {
		const board = req.params.board;
		const { text, delete_password, thread_id } = req.body;
		const boardThreads = db.collection(`board`);
		// console.log(req.body);
		const newReplyData = {
			_id: new ObjectId(),
			text: text,
			created_on: new Date(Date.now()),
			delete_password: hashPassword(delete_password),
			reported: false,
		};
		const updateResult = await updateExistingThread(board, thread_id, {
			$push: {
				replies: newReplyData,
			},
			$set: {
				bumped_on: new Date(Date.now()),
			},
		});
		res.json(newReplyData);
	});

	app.get('/api/replies/:board', async (req, res) => {
		const threadID = req.query.thread_id;
		const board = req.params.board;
		const threadData = await getExistingThread(board, threadID);
		const repliesData = {
			_id: threadData._id,
			name: threadData.name,
			text: threadData.text,
			created_on: threadData.created_on,
			bumped_on: threadData.bumped_on,
			replies: threadData.replies.map((reply) => {
				return {
					_id: reply._id,
					text: reply.text,
					created_on: reply.created_on,
				};
			}),
		};
		res.json(repliesData);
	});

	app.delete('/api/replies/:board', async (req, res) => {
		const board = req.params.board;
		const { thread_id, reply_id, delete_password } = req.body;
		const threadData = await getExistingThread(board, thread_id);
		const replyData = threadData.replies.find((reply) => reply._id.toString() === reply_id);
		const passwordHash = hashPassword(delete_password);
		const passwordHashMatch = passwordHash === replyData.delete_password;
		// console.log(threadData);
		if (passwordHashMatch) {
			const updateData = {
				$set: {
					'replies.$.text': '[deleted]',
				},
			};
			const updateResult = await updateExistingReply(board, thread_id, reply_id, updateData);
			res.send('success');
			console.log(updateResult);
		} else {
			res.send('incorrect password');
		}
	});

	app.put('/api/replies/:board', async (req, res) => {
		const board = req.params.board;
		const { thread_id, reply_id } = req.body;
		const updateData = {
			$set: {
				'replies.$.reported': true,
			},
		};
		const updateResult = await updateExistingReply(board, thread_id, reply_id, updateData);
		// console.log(updateResult);
		if (updateResult.modifiedCount === 1) {
			res.send('reported');
		} else {
			if (updateResult.matchedCount === 1) {
				res.send('reply has alraedy been reported');
			} else {
				res.send(`no reply found with id ${reply_id}`);
			}
		}
	});
};
