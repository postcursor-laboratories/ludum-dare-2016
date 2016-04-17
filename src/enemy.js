import {DIRECTION} from "./entity";
import {Character} from "./character";

export class Enemy extends Character {

    constructor(sprite, x, y) {
	super(sprite, x, y);
    }

    configure(game) {
	super.configure(game);
	this.facing = DIRECTION.LEFT;
	this.setFacing(this.facing);
    }

    update() {
	super.update();
	
	// TODO actual code
    }

    basicAttack() {
	super.basicAttack();
    }
}
