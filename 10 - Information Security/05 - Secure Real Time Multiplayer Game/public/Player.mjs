class Player {
	constructor({ x, y, score, id, context }) {
		this.size = {
			x: 32,
			y: 32,
		};

		this.position = {
			x: x,
			y: y,
		};

		this.velocity = {
			x: 0,
			y: 0,
		};

		this.speed = 5;

		this.score = score;

		this.id = id;

		this.context = context;

		this.updating = false;
	}

	data() {
		return {
			id: this.id,
			type: 'player',
			position: this.position,
			score: this.score,
		};
	}

	update() {
		this.move();
		this.draw();
	}

	draw() {
		this.context.fillStyle = 'white';
		this.context.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
		this.context.fillStyle = 'black';
		this.context.font = '15px sans-serif';
		this.context.textBaseline = 'middle';
		this.context.fillText(
			this.score,
			this.position.x + this.size.x / 2,
			this.position.y + this.size.y / 2
		);
	}

	movePlayer(direction, amount) {
		switch (direction) {
			case 'up':
				this.velocity.y = amount * -1;
				break;
			case 'down':
				this.velocity.y = amount;
				break;
			case 'left':
				this.velocity.x = amount * -1;
				break;
			case 'right':
				this.velocity.x = amount;
				break;
		}
	}

	move() {
		if (this.velocity.x === 0 && this.velocity.y === 0) {
			this.updating = false;
			return;
		}

		this.position.x = Math.min(
			Math.max(this.position.x + this.velocity.x, 0),
			640 - this.size.x
		);
		this.position.y = Math.min(
			Math.max(this.position.y + this.velocity.y, 0),
			480 - this.size.y
		);

		this.updating = true;
	}

	collision(item) {
		const overlapX =
			item.position.x <= this.position.x + this.size.x &&
			item.position.x + item.size.x >= this.position.x;
		const overlapY =
			item.position.y <= this.position.y + this.size.y &&
			item.position.y + item.size.y >= this.position.y;

		// console.log(overlapX, overlapY);

		if (overlapX && overlapY) {
			item.onOverlap(this);
		}

		return overlapX && overlapY;
	}

	calculateRank(arr) {
		const sorted = arr
			.filter((object) => object.id !== 'collectible')
			.sort((a, b) => b.score - a.score);
		const place = sorted.indexOf(this) + 1;
		const total = sorted.length;

		return `Rank: ${place}/${total}`;
	}
}

export default Player;
