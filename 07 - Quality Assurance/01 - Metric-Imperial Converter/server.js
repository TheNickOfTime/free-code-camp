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
const ConvertHandler = require('./controllers/convertHandler.js');

// App Setup ---------------------------------------------------------------------------------------
let app = express();
app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({ origin: '*' })); //For FCC testing purposes only
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Functions ---------------------------------------------------------------------------------------
const convert = (input) => {
	const initNumber = converter.getNum(input);
	const initUnit = converter.getUnit(input);
	return converter.convert(initNumber, initUnit);
};

// Routes ------------------------------------------------------------------------------------------
// Index page (static HTML) ----------------------------------------------------
app.route('/').get(function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});
fccTestingRoutes(app);
apiRoutes(app);

// Convert ---------------------------------------------------------------------
const converter = new ConvertHandler();
app.get('/api/convert', (req, res) => {
	const input = req.query.input;
	// console.log(input);
	const output = convert(input);
	res.json(output);
});

// 404 Not Found Middleware ----------------------------------------------------
app.use(function (req, res, next) {
	res.status(404).type('text').send('Not Found');
});

// Start our server and tests! ---------------------------------------------------------------------
const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Listening on port ' + port);
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
