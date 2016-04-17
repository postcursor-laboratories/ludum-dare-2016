import {Entity, DIRECTION} from "./entity";
import {Character} from "./character";
import {globals} from "./globals";
import Phaser from "phaser"

export class Player extends Character {

    constructor(x, y) {
        super("player", x, y);
        this.jumpSpeed = 200;
        this.jumpAnimationCounter = 0;
        this.facing = DIRECTION.RIGHT;
    }
    
    configure(game) {
        super.configure(game);
        this.gameRef.camera.follow(this.sprite, Phaser.Camera.FOLLOW_LOCKON);
        this.controls = game.input.keyboard.createCursorKeys();
    }

    basicAttack() {

    }

    update() {
        this.gameRef.physics.arcade.collide(this.sprite, globals.collisionLayer);

        if ((this.sprite.body.touching.down || this.sprite.body.onFloor()) && !(this.controls.left.isDown || this.controls.right.isDown)) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

        if (this.controls.left.isDown) {
            this.move(DIRECTION.LEFT);
        } else if (this.controls.right.isDown) {
            this.move(DIRECTION.RIGHT);
        } else {
            this.attemptAnim("stationary", 4, true);
        }

        if (this.controls.up.isDown && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.jump();
        }

        if (this.jumpAnimationCounter > 0) {
            this.attemptAnim("jump", 5, false);
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
