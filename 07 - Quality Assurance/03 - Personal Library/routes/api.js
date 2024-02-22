'use strict';

const { ReturnDocument } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

module.exports = function (app, database) {
	app.route('/api/books')
		.get(async (req, res) => {
			//response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			const books = await database.find().toArray();
			const data = books.map((book) => {
				return {
					_id: book._id,
					title: book.title,
					commentcount: book.comments.length,
				};
			});
			res.json(data);
		})

		.post(async (req, res) => {
			//response will contain new book object including atleast _id and title
			const title = req.body.title;
			const data = { title: title, comments: [] };
			if (title) {
				const dbInsert = await database.insertOne(data);
				res.json({ _id: dbInsert.insertedId, title: title });
			} else {
				res.json('missing required field title');
			}
		})

		.delete(async (req, res) => {
			//if successful response will be 'complete delete successful'
			const dbDelete = await database.drop();
			if (dbDelete) {
				res.json('complete delete successful');
			} else {
				res.json('complete delete not successful');
			}
		});

	app.route('/api/books/:id')
		.get(async (req, res) => {
			const bookid = req.params.id;

			if (bookid) {
				const bookData = await database.findOne({ _id: new ObjectId(bookid) });
				if (bookData) {
					res.json(bookData);
				} else {
					res.json('no book exists');
				}
			} else {
				res.json('no id providede');
			}
		})

		.post(async (req, res) => {
			let bookid = req.params.id;
			let comment = req.body.comment;

			if (bookid) {
				if (comment) {
					const bookData = await database.findOneAndUpdate(
						{ _id: new ObjectId(bookid) },
						{
							$push: {
								comments: comment,
							},
						},
						{ returnDocument: 'after' }
					);
					if (bookData) {
						res.json(bookData);
					} else {
						res.json('no book exists');
					}
				} else {
					res.json('missing required field comment');
				}
			}
		})

		.delete(async (req, res) => {
			let bookid = req.params.id;

			if (bookid) {
				const data = await database.deleteOne({ _id: new ObjectId(bookid) });
				if (data.deletedCount > 0) {
					res.json('delete successful');
				} else {
					res.json('no book exists');
				}
			}
		});
};
