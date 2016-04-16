import {Sprite} from "../sprite-wrapper";
import Phaser from "phaser";
import PIXI from "pixi";

export let platformGroup = [];

export class Platform extends Sprite {

    constructor(image, x, y) {
        super(image, x, y, platformGroup[0]);
    }

    configure(game) {
        super.configure(game);
        game.physics.enable(this, Phaser.Physics.ARCADE);
    }

}

export class Ground extends Platform {

    constructor(x, y) {
        super("ground", x, y);
    }


    configure(game) {
        super.configure(game);
        this.sprite.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        this.sprite.scale.setTo(5, 5);
    }

    update() {
        console.log("I'm a useless platform.");
    }

}
