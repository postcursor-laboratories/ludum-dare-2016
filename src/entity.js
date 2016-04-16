import {Sprite} from "./sprite-wrapper";
import Phaser from "phaser";

export const DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

export class Entity extends Sprite {

    constructor(image, x, y) {
        super(image, x, y);
        this.moveSpeed = 150;
    }

    configure(game) {
        super.configure(game);
        game.physics.enable(this.sprite);
        this.sprite.body.bounce.y = 0.1;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.anchor.setTo(0.5, 1);
        this.sprite.scale = new Phaser.Point(2, 2);
    }

    move(direction, speed) {
        let newVelocity = speed || this.moveSpeed;
        switch (direction) {
            case DIRECTION.UP:
                this.sprite.body.velocity.y = -newVelocity;
                break;
            case DIRECTION.DOWN:
                this.sprite.body.velocity.y = newVelocity;
                break;
            case DIRECTION.LEFT:
                this.sprite.body.velocity.x = -newVelocity;
                break;
            case DIRECTION.RIGHT:
                this.sprite.body.velocity.x = newVelocity;
                break;
            default:
                throw "Unrecognized direction in Entity.move";
        }
    }
}
