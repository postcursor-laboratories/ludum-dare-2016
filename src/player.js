import {Entity, DIRECTION} from "./entity";
import {globals} from "./globals";

export class Player extends Entity {

    constructor(x, y) {
        super("playerStatic", x, y);
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
        this.gameRef.physics.arcade.collide(this.sprite, globals.collisionLayer);

        if ((this.sprite.body.touching.down || this.sprite.body.onFloor()) && !(this.controls.left.isDown || this.controls.right.isDown)) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

        if (this.controls.left.isDown) {
            this.sprite.body.velocity.x = Math.max(-this.moveSpeed, this.sprite.body.velocity.x - 10)
        } else if (this.controls.right.isDown) {
            this.sprite.body.velocity.x = Math.min(this.moveSpeed, this.sprite.body.velocity.x + 10)
        }

        if (this.controls.up.isDown && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
            this.move(DIRECTION.UP);
        }
    }
}
