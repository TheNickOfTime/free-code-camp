import Player from './Player.mjs';
import Collectible from './Collectible.mjs';
import { io } from 'https://cdn.socket.io/4.7.4/socket.io.esm.min.js';

const socket = io(); // init
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

let clientID = null;
let objects = {};

const ready = () => {
	// create player object
	objects[clientID] = createNewObject({
		type: 'player',
		position: { x: 0, y: 0 },
		score: 0,
		id: clientID,
	});
	objects[clientID].position = {
		x: 320 - objects[clientID].size.x / 2,
		y: 240 - objects[clientID].size.y / 2,
	};
	// objects[clientID].updating = true;

	//create collectible object if it doesn't exist
	if (!objects['collectible']) {
		objects['collectible'] = createNewObject({
			type: 'collectible',
			position: { x: 0, y: 0 },
			value: 1,
			id: 'collectible',
		});
		objects['collectible'].newPosition();
		socket.emit('new_collectible', objects['collectible'].data());
	}

	update();
};

const update = () => {
	// Background
	context.fillStyle = 'black';
	context.fillRect(0, 0, 640, 480);

	// Score text
	context.fillStyle = 'white';
	context.font = '20px sans-serif';
	context.textAlign = 'center';
	context.fillText(objects[clientID].calculateRank(Object.values(objects)), 320, 20);

	Object.values(objects).forEach((object) => {
		object.update();
	});

	if (objects[clientID].updating) {
		objects[clientID].collision(objects['collectible']);
		socket.emit('update_object', objects[clientID].data());
	}

	if (objects['collectible'].updating) {
		objects['collectible'].updating = false;
		socket.emit('update_object', objects['collectible'].data());
	}

	// objects[].collision(collectible);

	requestAnimationFrame(update);
};

const createNewObject = (data) => {
	console.log(`Creating object with id ${data.id}`);
	switch (data.type) {
		case 'player':
			return new Player({
				x: data.position.x,
				y: data.position.y,
				score: data.score ? data.score : 0,
				id: data.id,
				context: context,
			});
		case 'collectible':
			return new Collectible({
				x: data.position.x,
				y: data.position.y,
				value: data.value ? data.value : 0,
				id: data.id,
				context: context,
			});
	}
};

const updateExistingObject = (data) => {
	objects[data.id].position = data.position;
	switch (data.type) {
		case 'player':
			objects[data.id].score = data.score;
			break;
		case 'collectible':
			break;
	}
};

// Event Listeners ---------------------------------------------------------------------------------
// Window Events ---------------------------------------------------------------
window.addEventListener('keydown', ({ key }) => {
	switch (key) {
		case 'ArrowUp':
			objects[clientID].movePlayer('up', objects[clientID].speed);
			break;
		case 'ArrowDown':
			objects[clientID].movePlayer('down', objects[clientID].speed);
			break;
		case 'ArrowLeft':
			objects[clientID].movePlayer('left', objects[clientID].speed);
			break;
		case 'ArrowRight':
			objects[clientID].movePlayer('right', objects[clientID].speed);
			break;
		case 'i':
			console.log(objects);
			break;
	}
});

window.addEventListener('keyup', ({ key }) => {
	switch (key) {
		case 'ArrowUp':
			objects[clientID].movePlayer('up', 0);
			break;
		case 'ArrowDown':
			objects[clientID].movePlayer('down', 0);
			break;
		case 'ArrowLeft':
			objects[clientID].movePlayer('left', 0);
			break;
		case 'ArrowRight':
			objects[clientID].movePlayer('right', 0);
			break;
		case 'i':
			console.log(objects);
			break;
	}
});

// Network Events --------------------------------------------------------------
socket.addEventListener('init_client', ({ id, gameData }) => {
	console.log(`Initalizing client with id ${id}`);

	// Init data
	clientID = id;
	for (let key of Object.keys(gameData)) {
		const data = gameData[key];
		objects[data.id] = createNewObject(data);
	}

	// Call ready
	ready();

	// Let the server know
	const playerData = objects[clientID].data();
	socket.emit('new_player', playerData);
});

socket.addEventListener('add_object', (data) => {
	console.log(`Adding object with id ${data.id}`);
	objects[data.id] = createNewObject(data);
	// console.log(objects);
});

socket.addEventListener('update_object', (data) => {
	updateExistingObject(data);
	console.log(`Updating object with id ${data.id}`);
	if (data.id == 'collectible') {
		console.log(data);
	}
});

socket.addEventListener('remove_object', (id) => {
	delete objects[id];
	console.log(`Removing object with id ${id}`);
});
