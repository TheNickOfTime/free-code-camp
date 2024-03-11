'use strict';

// Dependencies ------------------------------------------------------------------------------------
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const helmet = require('helmet');

const apiRoutes = require('./routes/api.js');
const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner');

// Setup -------------------------------------------------------------------------------------------
// App -------------------------------------------------------------------------
const app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helmet ----------------------------------------------------------------------
app.use(helmet.hidePoweredBy()); // hide powered by express in header
app.use(helmet.frameguard({ action: 'sameorigin' })); // prevent iframe abuse
app.use(helmet.xssFilter()); // sanitize user input
app.use(helmet.noSniff()); // prevent MIME sniffing to override the 'content-type' of a header
app.use(helmet.ieNoOpen()); // sets X-Download-Options header to noopen, prevent IE users from executing downloads
app.use(helmet.dnsPrefetchControl()); // prevents dns prefetching of links on a page when it loads
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));

// Mongo -----------------------------------------------------------------------
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
	const db = database.db('message-board');

	await db.collection('fcc_test').drop();
	await db.collection('chai_test').drop();

	// Sample front-end --------------------------------------------------------
	app.route('/b/:board/').get(function (req, res) {
		res.sendFile(process.cwd() + '/views/board.html');
	});
	app.route('/b/:board/:threadid').get(function (req, res) {
		res.sendFile(process.cwd() + '/views/thread.html');
	});

	// Index page (static HTML) ------------------------------------------------
	app.route('/').get(function (req, res) {
		res.sendFile(process.cwd() + '/views/index.html');
	});

	// For FCC testing purposes ------------------------------------------------
	fccTestingRoutes(app);

	// Routing for API ---------------------------------------------------------
	apiRoutes(app, db);

	// 404 Not Found Middleware ------------------------------------------------
	app.use(function (req, res, next) {
		res.status(404).type('text').send('Not Found');
	});
});

//Start server and tests ---------------------------------------------------------------------------
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

module.exports = app; //for testing
