import {DIRECTION} from "./entity";
import {Character} from "./character";
import {globals} from "./globals";
import Phaser from "phaser";

export class Player extends Character {

    constructor(elementalPlayers, x, y) {
        super("human", x, y);
        this.elementalPlayers = elementalPlayers;
    }

    configure(game) {
        super.configure(game);
        this.gameRef.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
        this.controls = game.input.keyboard.createCursorKeys();
        this.loadElemental(this.elementalPlayers.human);
    }

    loadElemental(elementalDescriptor) {
        this.jumpSpeed = elementalDescriptor.jumpSpeed;
        this.moveSpeed = elementalDescriptor.moveSpeed;
        this.setTexture(elementalDescriptor.elementalName, 0);
        this.addAnimations();
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
