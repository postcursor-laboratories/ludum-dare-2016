import {Sprite} from "../sprite-wrapper";
import {globals} from "../globals";

export class SpellSprite extends Sprite {

    constructor(image, onCollideGround, onCollideEnemy) {
        super(image);
        this.onCollideGround = onCollideGround;
        this.onCollideEnemy = onCollideEnemy;
    }


    checkCollision() {
        const collisionGround = super.checkCollision();
        if (collisionGround) {
            this.onCollideGround();
        }
        this.gameRef.physics.arcade.collide(this.sprite, globals.enemyGroup,
            (sprite, enemy) => this.onCollideEnemy(enemy.wrapper));
        return collisionGround;
    }
}

/**
 * Extend this for new spells.
 */
export class Spell {

    constructor(name, image, cooldown, mana, spriteClass = SpellSprite) {
        this.name = name;
        this.image = image;
        this.cooldown = cooldown;
        this.mana = mana;
        this.spriteClass = SpellSprite;
    }

    /**
     * @return {SpellSprite} The new SpellSprite
     */
    createSprite() {
        return this.spriteClass(this.image, this.onCollideGround, this.onCollideEnemy);
    }

    onCollideGround() {
    }

    /**
     * @param enemy {Sprite} The collided enemy sprite
     */
    onCollideEnemy(enemy) {
    }

}
