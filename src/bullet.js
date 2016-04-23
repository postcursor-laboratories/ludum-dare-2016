import {ExtendedSprite} from "./sprite-extension";
import {globals} from "./globals";
import Phaser from "phaser";


const BULLET_SPEED = 200;

export class Bullet extends ExtendedSprite {

    constructor(x, y, angle) {
        super("bullet", x, y);
        this.velocity = new Phaser.Point(Math.cos(angle) * BULLET_SPEED, Math.sin(angle) * BULLET_SPEED);
        this.initalPos = new Phaser.Point(x, y);
        this.angle = angle;
    }

    configure(game) {
        super.configure(game);
        globals.bulletsGroup.add(this.sprite);
        game.physics.enable(this.sprite);
        this.sprite.scale = new Phaser.Point(2, 2);
        this.sprite.rotation = this.angle;
        this.sprite.body.velocity = this.velocity;
        this.sprite.body.allowGravity = false;
    }

    update() {
        if (this.checkCollision() || this.gameRef.physics.arcade.collide(this.sprite, globals.player,
                (sprite, enemy) => this.onCollideEnemy(enemy.extension))) {
            this.destroy();
        }
        if (this.initalPos.distance(this.sprite.position) >= 600) {
            this.destroy();
        }
    }

    onCollideEnemy(extension) {
        extension.damage(1);
    }

}