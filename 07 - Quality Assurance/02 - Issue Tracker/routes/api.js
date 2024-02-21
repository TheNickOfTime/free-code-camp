'use strict';

const { ObjectId } = require('mongodb');

module.exports = async (app, database) => {
	app.get('/api/issues/:project', async (req, res) => {
		const project = req.params.project;
		const projectDB = await database.db('issue-tracker').collection(project);
		// console.log(projectDB);
		let queries = req.query;
		if (queries._id) {
			queries._id = new ObjectId(queries._id);
		}

		const issues = await projectDB.find(queries).toArray();
		console.log(queries);

		res.json(issues);
	});

	app.post('/api/issues/:project', async (req, res) => {
		const project = req.params.project;
		const projectDB = await database.db('issue-tracker').collection(project);

		const data = req.body;
		const now = new Date(Date.now());

		if (!data.issue_title || !data.issue_text || !data.created_by) {
			res.json({ error: 'required field(s) missing' });
			return;
		}

		const newBugData = {
			issue_title: data.issue_title,
			issue_text: data.issue_text,
			created_by: data.created_by,
			assigned_to: data.assigned_to ? data.assigned_to : '',
			status_text: data.status_text ? data.status_text : '',
			open: true,
			created_on: now,
			updated_on: now,
		};
		const result = await projectDB.insertOne(newBugData);
		res.json({
			_id: result.insertedId,
			...newBugData,
		});
	});

	app.put('/api/issues/:project', async (req, res) => {
		let project = req.params.project;
		const issueID = req.body._id;

		try {
			if (issueID) {
				const data = Object.keys(req.body)
					.filter((key) => {
						return key !== '_id' && req.body[key] !== '';
					})
					.reduce((obj, key) => {
						obj[key] = req.body[key];
						return obj;
					}, {});

				// console.log(Object.keys(data).length);

				if (Object.keys(data).length == 0) {
					res.json({ error: 'no update field(s) sent', '_id': issueID });
					return;
				}

				const projectDB = await database.db('issue-tracker').collection(project);
				projectDB;
				const result = await projectDB.findOneAndUpdate(
					{ _id: new ObjectId(issueID) },
					{
						$set: {
							...data,
							updated_on: new Date(Date.now()),
						},
					}
				);

				// console.log(req.body, data, result);

				if (result) {
					res.json({ result: 'successfully updated', '_id': issueID });
					return;
				} else {
					res.json({ error: 'could not update', '_id': issueID });
					return;
				}
			} else {
				res.json({ error: 'missing _id' });
				return;
			}
		} catch (error) {
			console.error(error);
		}
	});

	app.delete('/api/issues/:project', async (req, res) => {
		let project = req.params.project;
		const issueID = req.body._id;

		try {
			if (issueID) {
				const projectDB = await database.db('issue-tracker').collection(project);
				projectDB;
				const result = await projectDB.findOneAndDelete({ _id: new ObjectId(issueID) });

				if (result) {
					res.json({ result: 'successfully deleted', '_id': issueID });
				} else {
					res.json({ error: 'could not delete', '_id': issueID });
				}
			} else {
				res.json({ error: 'missing _id' });
			}
		} catch (error) {
			console.error(error);
		}
	});
};
