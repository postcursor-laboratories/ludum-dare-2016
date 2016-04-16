import {GameConfigurable} from "./game-helpers";

export const allSprites = [];

/**
 * A wrapper around a Phaser sprite. Essentially just a little interfacing.
 */
export class Sprite extends GameConfigurable {

    constructor(image, x, y, group=undefined) {
        super();
        this.__unconstructedData = {
            image: image,
            x: x,
            y: y,
            group: group
        };
        this.__gameSprite = undefined;
        this.gameRef = undefined;
        allSprites.push(this);
    }

    configure(game) {
        let data = this.__unconstructedData;
        let group = data.group;
        this.__unconstructedData = undefined;
        this.gameRef = game;
        let addSprite = group ? group.create.bind(group) : game.add.sprite.bind(game.add);
        return this.__gameSprite = addSprite(data.x, data.y, data.image);
    }

    set x(x) {
        (this.__unconstructedData || this.__gameSprite).x = x;
    }

    get x() {
        return (this.__unconstructedData || this.__gameSprite).x;
    }

    set y(y) {
        (this.__unconstructedData || this.__gameSprite).y = y;
    }

    get y() {
        return (this.__unconstructedData || this.__gameSprite).y;
    }

    set group(group) {
        this.__unconstructedData.group = group;
    }

    get group() {
        return this.__unconstructedData.group;
    }

    get sprite() {
        if (this.__gameSprite) {
            return this.__gameSprite;
        }
        throw "game sprite not initialized";
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    update() {
    }

}
