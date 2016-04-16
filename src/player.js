import {Entity, DIRECTION} from "./entity";
import {platformGroup} from "./sprites/platforms";

export class Player extends Entity {

    constructor(image, x, y) {
        super(image, x, y);
        this.jumpSpeed = 200;
    }
    
    jump() {
        this.move(DIRECTION, 200);
    }

    update() {
        this.gameRef.physics.arcade.collide(this, platformGroup);
    }
}
