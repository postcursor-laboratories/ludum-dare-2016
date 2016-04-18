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

    constructor(name, cooldown, mana) {
        this.name = name;
        this.cooldown = cooldown;
        this.mana = mana;
    }
	
	/**
	*  @return {boolean} True if the player can cast the spell.
	*/
	prerequisite()
	{
		
	}

    /**
     * @return {SpellSprite} The new SpellSprite
     */
    castSpell() {
    }

    onCollideGround() {
    }

    /**
     * @param enemy {Sprite} The collided enemy sprite
     */
    onCollideEnemy(enemy) {
    }

}
