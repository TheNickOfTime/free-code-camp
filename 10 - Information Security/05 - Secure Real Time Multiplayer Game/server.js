require('dotenv').config();

// Dependencies ------------------------------------------------------------------------------------
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const cors = require('cors');
const helmet = require('helmet');
const noCache = require('nocache');
const { Server } = require('socket.io');

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

// Setup -------------------------------------------------------------------------------------------
const app = express();

// App -------------------------------------------------------------------------
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ origin: '*' })); //For FCC testing purposes and enables user to connect from outside the hosting platform

// Helmet ----------------------------------------------------------------------
app.use(helmet.hidePoweredBy({ setTo: 'PHP 7.4.3' })); // hide powered by express in header
app.use(helmet.frameguard({ action: 'deny' })); // prevent iframe abuse
app.use(helmet.xssFilter()); // sanitize user input
app.use(helmet.noSniff()); // prevent MIME sniffing to override the 'content-type' of a header
app.use(helmet.ieNoOpen()); // sets X-Download-Options header to noopen, prevent IE users from executing downloads
app.use(helmet.noCache()); // attempt to disable page cache to always load from scatch

// Routes ------------------------------------------------------------------------------------------
// Index page (static HTML)
app.route('/').get(function (req, res) {
	res.sendFile(process.cwd() + '/views/index.html');
});

//For FCC testing purposes
fccTestingRoutes(app);

// 404 Not Found Middleware
app.use(function (req, res, next) {
	res.status(404).type('text').send('Not Found');
});

// Server ------------------------------------------------------------------------------------------
const portNum = process.env.PORT || 3000;
// Set up server and tests
const server = app.listen(portNum, () => {
	console.log(`Listening on port ${portNum}`);
	if (process.env.NODE_ENV === 'test') {
		console.log('Running Tests...');
		setTimeout(function () {
			try {
				runner.run();
			} catch (error) {
				console.log('Tests are not valid:');
				console.error(error);
			}
		}, 1500);
	}
});

// Game Data
const clients = [];
const gameData = {};

// Socket ------------------------------------------------------------------------------------------
const io = new Server(server);
io.on('connection', (socket) => {
	// Initialize client on connection
	const id = socket.client.id;
	socket.emit('init_client', { id: id, gameData: gameData });
	console.log(`Client with id ${id} has connected`);

	// Handle disconnect
	socket.on('disconnect', (reason) => {
		// delete clients[id];
		delete gameData[id];
		socket.broadcast.emit('remove_object', id);
		console.log(`Client with id ${id} has disconnected`);
	});

	// Handle creation of new player
	socket.on('new_player', (data) => {
		gameData[id] = data;

		console.log(`Creating new player data entry with id ${id}`);
		// console.log('Current game data:\n', gameData);

		socket.broadcast.emit('add_object', data);
	});

	socket.on('new_collectible', (data) => {
		gameData['collectible'] = data;

		console.log(`Creating new collectible data entry`);
		// console.log('Current game data:\n', gameData);

		socket.broadcast.emit('add_object', data);
	});

	socket.on('update_object', (data) => {
		gameData[id] = data;
		// console.log(data);
		socket.broadcast.emit('update_object', data);
	});
});

module.exports = app; // For testing
