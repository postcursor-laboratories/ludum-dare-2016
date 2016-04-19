import {Sprite} from "./sprite-wrapper";
import {globals} from "./globals";
import Phaser from "phaser";

const BULLET_SPEED = 200;

export class Bullet extends Sprite {

    constructor(x, y, angle) {
        super("bullet", x, y);
        this.velocity = new Phaser.Point(Math.cos(angle) * 200, Math.sin(angle) * 200);
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
        
    }
}