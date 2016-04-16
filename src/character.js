import {Entity, DIRECTION} from "./entity";
import {globals} from "./globals";

export class Character extends Entity {

    constructor(sprite, x, y) {
        super(sprite, x, y);
        this.jumpSpeed = 200;
        this.jumpAnimationCounter = 0;
        this.facing = DIRECTION.RIGHT;
    }

    configure(game) {
        super.configure(game);
        this.sprite.animations.add("walk", [0, 1, 2, 3]);
        this.sprite.animations.add("stationary", [4, 5]);
        this.sprite.animations.add("jump", [12]);
        this.facing = DIRECTION.RIGHT;
    }

    jump() {
        this.jumpAnimationCounter = 20;
        super.move(DIRECTION.UP, this.jumpSpeed);
    }

    move(direction) {
        switch (direction) {
            case DIRECTION.LEFT:
                this.setFacing(DIRECTION.LEFT);
                this.sprite.body.velocity.x = Math.max(-this.moveSpeed, this.sprite.body.velocity.x - 10)
                this.sprite.animations.play("walk", Math.min(4, Math.round(Math.abs(this.sprite.body.velocity.x) * 2)), true);
                break;
            case DIRECTION.RIGHT:
                this.setFacing(DIRECTION.RIGHT);
                this.sprite.body.velocity.x = Math.min(this.moveSpeed, this.sprite.body.velocity.x + 10)
                this.sprite.animations.play("walk", Math.min(4, Math.round(Math.abs(this.sprite.body.velocity.x) * 2)), true);
                break;
            default:
                throw "Unrecognized direction in Character.move";
        }
    }

    update() {
        this.gameRef.physics.arcade.collide(this.sprite, globals.collisionLayer);

        if (this.sprite.body.touching.down || this.sprite.body.onFloor()) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

        this.sprite.animations.play("stationary", 4, true);

        if (this.jumpAnimationCounter > 0) {
            this.sprite.animations.play("jump", 1, true);
            this.jumpAnimationCounter--;
        }
    }

    setFacing(direction) {
        if (direction == DIRECTION.LEFT) {
            this.facing = direction;
            this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
        } else if (direction == DIRECTION.RIGHT) {
            this.facing = direction;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
        }
    }
}
