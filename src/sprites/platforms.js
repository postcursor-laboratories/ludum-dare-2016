import {Sprite} from "../sprite-wrapper";
import PIXI from "pixi";

export let platformGroup = [];

export class Platform extends Sprite {

    constructor(image, x, y) {
        super(image, x, y, platformGroup[0]);
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
}
