import {ExtendedSprite} from "../sprite-extension";
import {globals} from "../globals";
import {mainGame} from "../main";

export const spellMap = new Map();

// spellMap.set = function (k, v) {
//     console.log("[spellMap.set]", k, "=>", v);
//     Map.prototype.set.call(spellMap, k, v);
// };

export class SpellSprite extends ExtendedSprite {

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
            (sprite, enemy) => this.onCollideEnemy(enemy.extension));
        return collisionGround;
    }
}

/**
 * Extend this for new spells.
 */
export class Spell {

    constructor(name, cooldown, mana) {
        this.name = name;
        this.cooldown = cooldown;
        this.mana = mana;
        spellMap.set(name, this);
    }

    /**
     *  @return {boolean} True if the player can cast the spell.
     */
    prerequisite() {
        return true;
    }

    /**
     * @return {SpellSprite} The new SpellSprite
     */
    castSpell(playerObj) {
    }

    onCollideGround() {
    }

    /**
     * @param enemy {Sprite} The collided enemy sprite
     */
    onCollideEnemy(enemy) {
    }

    magicParticles(x, y) {
        mainGame.ezEmit.emit("magicParticle", x, y, 2000, 20, -200, 200, -200, 200, 0);
    }

}
