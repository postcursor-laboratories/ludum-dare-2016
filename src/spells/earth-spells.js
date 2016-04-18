import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {globals} from "../globals";
import Phaser from "phaser";
import {Spell} from "./spell"

const ROCKTHROW_NAME = "Rock Throw";
const ROCKTHROW_MANA = 10;
const ROCKTHROW_COOLDOWN = 1;

export class RockThrowSpell extends Spell {
	
	constructor() {
		super(ROCKTHROW_NAME, ROCKTHROW_COOLDOWN, ROCKTHROW_MANA);
	}
	
	//TODO: DO NOT ALWAYS RETURN TRUE
	prerequisite()
	{
		return true;
	}
	
	castSpell(playerObj) {
		
		let game = playerObj.gameRef;
		let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1);
		let xCoord = playerObj.sprite.x + (facingSign * 8);
		let yCoord = playerObj.sprite.y - 48;
		game.promethium.ezEmit.emit("magicParticle", xCoord + (facingSign * 16), yCoord, 2000, 20);
		let rock = new Sprite("rockProjectile", xCoord, yCoord);
		rock.configure(game);
		game.physics.arcade.enable(rock.sprite);
		rock.sprite.body.velocity.x = facingSign * 400;
		rock.sprite.body.velocity.y = -50;
		rock.update = () => {
			if (rock.checkCollision()) {
				game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
				rock.destroy();
			}
		};
		
	}
}

const FISSURE_NAME = "Rock Throw";
const FISSURE_MANA = 10;
const FISSURE_COOLDOWN = 1;

export class FissureSpell extends Spell
{

	constructor() {
		super(FISSURE_NAME, FISSURE_COOLDOWN, FISSURE_MANA);
	}
	
	//TODO: DO NOT ALWAYS RETURN TRUE
	prerequisite()
	{
		return true;
	}
	
	castSpell(playerObj) {
		let game = playerObj.gameRef;
		let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1);
		let xCoord = playerObj.sprite.x + (facingSign * 14);
		let yCoord = playerObj.sprite.y - 4;
		let rocks = [];
		for (let i = 0; i < 10; i++) {
			let rock = new Sprite("rockProjectile", xCoord + (i * 13 * facingSign), yCoord);
			rock.configure(game);
			rock.sprite.anchor.setTo(0.5, 0.5);
			rock.sprite.rotation = Math.random() * 2 * Math.PI;
			rocks.push(rock);
			game.promethium.ezEmit.emit("magicParticle", xCoord + (i * 13 * facingSign), yCoord, 2000, 20);
		}
		let timer = game.time.create(true);
		timer.add(2000, () => {
			rocks.forEach(rock => {
				game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
				rock.destroy();
			});
		});
		timer.start();
	}
	
}