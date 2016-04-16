import {Sprite} from "../sprite-wrapper";
import Phaser from "phaser";
import PIXI from "pixi";

export let platformGroup = undefined;
export function setupPlatformGroup(game) {
    platformGroup = game.add.group();
}

export class Platform extends Sprite {

    constructor(image, x, y) {
        super(image, x, y, platformGroup);
    }

    configure(game) {
        super.configure(game);
        this.configureSprite(function () {
            game.physics.arcade.enable(this);
            this.immovable = true;
            this.body.moves = false;
        });
    }

}

export class Ground extends Platform {

    constructor(x, y) {
        super("ground", x, y);
    }


    configure(game) {
        super.configure(game);
        this.configureSprite(function () {
            this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            this.scale.setTo(5, 5);
        });
    }

}
