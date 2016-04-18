import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {globals} from "../globals";
import Phaser from "phaser";
import {Spell} from "./spell"

const FIREBALL_NAME = "Fireball";
const FIREBALL_MANA = 10;
const FIREBALL_COOLDOWN = 1;

export class FireballSpell extends Spell {
	
	constructor() {
		super(FIREBALL_NAME, FIREBALL_COOLDOWN, FIREBALL_MANA);
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
		let fireball = new Sprite("fireballProjectile", xCoord, yCoord);
		fireball.configure(game);
		game.physics.arcade.enable(fireball.sprite);
		fireball.sprite.allowGravity = false; //we don't obey that gravity thing here!
		fireball.sprite.body.velocity.x = facingSign * 400;
		fireball.sprite.body.velocity.y = 0;
		fireball.explode = () => {
			fireball.destroy();
			game.promethium.ezEmit.emit("fireballParticle", fireball.sprite.x, fireball.sprite.y, 250, 50);
			//Deal damage to surroundings here please
		};
		fireball.update = () => {
			if (fireball.checkCollision()) {
				game.promethium.ezEmit.emit("fireballParticle", fireball.sprite.x, fireball.sprite.y, 2000, 10);
				fireball.explode();
			}
		};
		timer.add(2000, () => {
			
			fireball.explode();
		});
	}
}

const HEATWAVE_NAME = "Heatwave";
const HEATWAVE_MANA = 10;
const HEATWAVE_COOLDOWN = 1;

export class HeatwaveSpell extends Spell
{

	constructor() {
		super(HEATWAVE_NAME, HEATWAVE_COOLDOWN, HEATWAVE_MANA);
	}
	
	//TODO: DO NOT ALWAYS RETURN TRUE
	prerequisite()
	{
		return true;
	}
	
	castSpell(playerObj) {
	}
	
}