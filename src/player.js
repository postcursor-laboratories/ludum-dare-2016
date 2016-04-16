import {Entity, DIRECTION} from "./entity";
import {platformGroup} from "./sprites/platforms";

export class Player extends Entity {

    constructor(image, x, y) {
        super(image, x, y);
        this.jumpSpeed = 200;
    }
    
    configure(game) {
        super.configure(game);
        this.controls = game.input.keyboard.createCursorKeys();
    }
    
    jump() {
        this.move(DIRECTION, 200);
    }

    update() {
        this.gameRef.physics.arcade.collide(this, platformGroup);
        if (this.controls.left.isDown) {
            this.move(DIRECTION.LEFT);
        } else if (this.controls.right.isDown) {
            this.move(DIRECTION.RIGHT);
        } else if (this.controls.up.isDown) {
            this.move(DIRECTION.UP);
        }
    }
}
