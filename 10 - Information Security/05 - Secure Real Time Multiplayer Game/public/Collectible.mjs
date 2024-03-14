class Collectible {
	constructor({ x, y, value, id, context }) {
		this.position = {
			x: x,
			y: y,
		};

		this.size = {
			x: 8,
			y: 8,
		};

		this.value = value;

		this.id = id;

		this.context = context;

		this.updating = false;
	}

	data() {
		return {
			id: this.id,
			type: 'collectible',
			position: this.position,
			value: this.value,
		};
	}

	update() {
		this.draw();
	}

	draw() {
		this.context.fillStyle = 'white';
		this.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
	}

	onOverlap(player) {
		player.score += this.value;
		this.newPosition();
	}

	newPosition() {
		this.position = {
			x: Math.floor(Math.random() * (640 - this.size.x)),
			y: Math.floor(Math.random() * (480 - this.size.y)),
		};
		this.updating = true;
	}
}
try {
	module.exports = Collectible;
} catch (e) {}

export default Collectible;
