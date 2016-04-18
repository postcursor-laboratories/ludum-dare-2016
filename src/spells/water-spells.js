import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {globals} from "../globals";
import Phaser from "phaser";
import {Spell} from "./spell"

const SURF_NAME = "Surf";
const SURF_MANA = 10;
const SURF_COOLDOWN = 1;
const SURF_SPEED = 100;
const SURF_DURATION = 1000;

export class SurfSpell extends Spell {
	
	constructor() {
		super(SURF_NAME, SURF_COOLDOWN, SURF_MANA);
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
		
		let surfHandler = new Sprite("waterParticle", xCoord, yCoord); // we need a small, near invisible sprite
		surfHandler.configure(game);
		game.promethium.allSprites.push(surfHandler);
		
		playerObj.setControlOverride(true); //take that!
		
		surfHandler.update = () => {
			surfHandler.setPosition(playerObj.sprite.x,playerObj.sprite.y);
			game.promethium.ezEmit.emit("waterParticle", surfHandler.sprite.x, surfHandler.sprite.y, 1000, 5);
			playerObj.sprite.body.velocity.x= SURF_SPEED * facingSign;
		}
		
		let timer = game.time.create(true);
		timer.add(SURF_DURATION, () => {
			playerObj.setControlOverride(false);
			playerObj.sprite.body.velocity.x= SURF_SPEED *.3* facingSign;
		}
	}
}

const FROSTBITE_NAME = "Frostbite";
const FROSTBITE_MANA = 10;
const FROSTBITE_COOLDOWN = 1;

export class FrostbiteSpell extends Spell
{

	constructor() {
		super(FROSTBITE_NAME, FROSTBITE_COOLDOWN, FROSTBITE_MANA);
	}
	
	//TODO: DO NOT ALWAYS RETURN TRUE
	prerequisite()
	{
		return true;
	}
	
	castSpell(playerObj) {
	}
	
}