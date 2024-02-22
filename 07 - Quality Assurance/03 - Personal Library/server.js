'use strict';

// Dependencies ------------------------------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');
const { MongoClient } = require('mongodb');

// Setup -------------------------------------------------------------------------------------------
// App -------------------------------------------------------------------------
const app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //USED FOR FCC TESTING PURPOSES ONLY!
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database --------------------------------------------------------------------
const database = new MongoClient(process.env.MONGO_URI);
const dbConnect = async () => {
	try {
		console.log('Connecting to database...');
		await database.connect();
		console.log('Database connected');
	} catch (error) {
		console.error(error);
		throw new Error('Unable to Connect to Database');
	}
};

// Routes ------------------------------------------------------------------------------------------
dbConnect().then(async () => {
	const bookDB = database.db('personal-library').collection('books');

	// Index page (static HTML) ------------------------------------------------
	app.route('/').get(function (req, res) {
		res.sendFile(process.cwd() + '/views/index.html');
	});

	// For FCC testing purposes ------------------------------------------------
	fccTestingRoutes(app);

	// Routing for API ---------------------------------------------------------
	apiRoutes(app, bookDB);

	// 404 Not Found Middleware ------------------------------------------------
	app.use(function (req, res, next) {
		res.status(404).type('text').send('Not Found');
	});
});

// Start our server and tests! ---------------------------------------------------------------------
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
		}, 1500);
	}
});

module.exports = app; //for unit/functional testing
