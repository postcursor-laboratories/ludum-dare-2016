import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {globals} from "../globals";
import Phaser from "phaser";
import {Spell} from "./spell"

const SURF_NAME = "Surf";
const SURF_MANA = 10;
const SURF_COOLDOWN = 1;

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