'use strict';

// Dependencies ------------------------------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai').expect;
const cors = require('cors');
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const { MongoClient } = require('mongodb');

// Setup -------------------------------------------------------------------------------------------
// App setup -------------------------------------------------------------------
let app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo setup -----------------------------------------------------------------
const client = new MongoClient(process.env.MONGO_URI, {});
const dbConnect = async () => {
	try {
		await client.connect();
	} catch (error) {
		console.error(error);
		throw new Error('Unable to Connect to Database');
	}
};

// Routes ------------------------------------------------------------------------------------------
const awaitDBConnect = async () => {
	await dbConnect();

	// Sample front-end --------------------------------------------------------
	app.route('/:project/').get(function (req, res) {
		res.sendFile(process.cwd() + '/views/issue.html');
	});

	// Index page (static HTML) ------------------------------------------------
	app.route('/').get(function (req, res) {
		res.sendFile(process.cwd() + '/views/index.html');
	});

	// For FCC testing purposes ------------------------------------------------
	fccTestingRoutes(app);

	// Routing for API ---------------------------------------------------------
	apiRoutes(app, client);

	// 404 Not Found Middleware ------------------------------------------------
	app.use(function (req, res, next) {
		res.status(404).type('text').send('Not Found');
	});
};
awaitDBConnect();

// Server ------------------------------------------------------------------------------------------
const listener = app.listen(process.env.PORT || 3000, function () {
	console.log('Your app is listening on port ' + listener.address().port);
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(function () {
			try {
				runner.run();
			} catch (e) {
				console.log('Tests are not valid:');
				console.error(e);
			}
		}, 3500);
	}
});

module.exports = app; //for testing
