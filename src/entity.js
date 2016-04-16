import {Sprite} from "./sprite-wrapper";

export const DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

export class Entity extends Sprite {

    constructor(image, x, y) {
        super(image, x, y);
    }

    configure(game) {
        game.physics.arcade.enable(this);
        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = 300;
        this.sprite.body.collideWorldBounds = true;
        this.moveSpeed = 150;
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
