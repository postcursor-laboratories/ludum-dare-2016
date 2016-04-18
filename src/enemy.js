import {DIRECTION} from "./entity";
import {Character} from "./character";

export class Enemy extends Character {

    constructor(sprite, x, y) {
        super(sprite, x, y);
    }

    configure(game) {
        super.configure(game);
        this.setFacing(DIRECTION.LEFT);
    }

    update() {
        super.update();
    }

    basicAttack() {
        throw "cannot call basicAttack on generic Enemy";
    }
}
;
