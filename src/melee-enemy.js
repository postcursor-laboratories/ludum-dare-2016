import {Enemy} from "./enemy";
import {mainGame} from "./main";
import {DIRECTION} from "./entity";

export class MeleeEnemy extends Enemy {

    constructor(x, y) {
	super("robot-melee", x, y);
    }

    configure(game) {
	super.configure(game);
	this.sprite.animations.add("forward", [0, 1, 2, 3, 4, 5, 6, 7]);
	this.sprite.animations.add("basicAttack", [9, 10, 11, 12, 13, 14, 15, 16]);
	this.sprite.animations.play("forward", 10, true);
    }

    update() {
	super.update();

	let player = mainGame.getPlayer();
	let stillBuf = 5;

	// are we close enough to punch the player with our plunger and/or eggbeater?
	if (Math.abs(this.x - player.x) <= 40 && Math.abs(this.y - player.y) < 15) {
	    this.basicAttack();
	}
	// move towards player
	else if (this.x > player.x + stillBuf) {
	    this.move(DIRECTION.LEFT);
	} else if (this.x < player.x - stillBuf) {
	    this.move(DIRECTION.RIGHT);
	}
    }

    basicAttack() {
	//let player = mainGame.getPlayer();
	//let game = player.gameRef;

	this.sprite.animations.play("basicAttack", 10, false);
	this.sprite.animations.currentAnim.onComplete.add(event => {
	    this.sprite.animations.play("forward", 10, true);
	});

	// game.promethium.ezEmit.emit("magicParticle", this.x, this.y, 200, 1);
	// let pew = new Sprite("rockProjectile", this.x, this.y);
	// pew.configure(game);
	// game.promethium.allSprites.push(pew);
	// game.physics.arcade.enable(pew);

	// /*
	// pew.sprite.body.velocity.x = (player.facing == DIRECTION.LEFT ? -1 : 1) * 800;
	// pew.sprite.body.velocity.y = 0;
	// pew.update = () => {};
	// */
    }
};
