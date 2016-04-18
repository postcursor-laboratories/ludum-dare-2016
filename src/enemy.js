import {DIRECTION} from "./entity";
import {Character} from "./character";
import {globals} from "./globals";

export class Enemy extends Character {

    constructor(sprite, x, y, maxHealth) {
        super(sprite, x, y, maxHealth);
        this.group = globals.enemyGroup;
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
