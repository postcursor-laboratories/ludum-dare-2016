import {Entity, DIRECTION} from "./entity";
import {globals} from "./globals";

export class Player extends Entity {

    constructor(x, y) {
        super("player", x, y);
        this.jumpSpeed = 200;
    }
    
    configure(game) {
        super.configure(game);
        this.controls = game.input.keyboard.createCursorKeys();
        this.sprite.animations.add("walk", [0, 1, 2, 3]);
        this.sprite.animations.add("stationary", [4, 5]);
        this.facing = DIRECTION.RIGHT;
    }
    
    jump() {
        this.move(DIRECTION.UP, this.jumpSpeed);
    }

    update() {
        this.gameRef.physics.arcade.collide(this.sprite, globals.collisionLayer);

        if ((this.sprite.body.touching.down || this.sprite.body.onFloor()) && !(this.controls.left.isDown || this.controls.right.isDown)) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

        if (this.controls.left.isDown) {
            this.setFacing(DIRECTION.LEFT);
            this.sprite.body.velocity.x = Math.max(-this.moveSpeed, this.sprite.body.velocity.x - 10)
            this.sprite.animations.play("walk", Math.min(4, Math.round(Math.abs(this.sprite.body.velocity.x) * 2)), true);
        } else if (this.controls.right.isDown) {
            this.setFacing(DIRECTION.RIGHT);
            this.sprite.body.velocity.x = Math.min(this.moveSpeed, this.sprite.body.velocity.x + 10)
            this.sprite.animations.play("walk", Math.min(4, Math.round(Math.abs(this.sprite.body.velocity.x) * 2)), true);
        } else {
            this.sprite.animations.play("stationary", 4, true);
        }

        if (this.controls.up.isDown && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.jump()
        }
    }

    setFacing(direction) {
        if (direction == DIRECTION.LEFT) {
            this.facing = direction;
            this.sprite.scale.x = -1;
        } else if (direction == DIRECTION.RIGHT) {
            this.facing = direction;
            this.sprite.scale.x = 1;
        }
    }
}
