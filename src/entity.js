import {ExtendedSprite} from "./sprite-extension";
import * as hud from "./hud";
import Phaser from "phaser";

export const DIRECTION = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};

export class Entity extends ExtendedSprite {

    constructor(image, x, y, maxHealth) {
        super(image, x, y);
        this.moveSpeed = 150;
        this.maxHealth = maxHealth;
        this.__health = maxHealth;
        this.healthBar = new hud.HealthBar(this.maxHealth);
        this.autoControlHealthBar = true;
        this.damageReductionFactor = 0;
    }

    configure(game) {
        super.configure(game);
        game.physics.enable(this.sprite);
        this.sprite.body.bounce.y = 0.1;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.anchor.setTo(0.5, 1);
        this.sprite.scale = new Phaser.Point(2, 2);
        this.healthBar.configure(game);
    }

    damage(amt) {
        amt *= 1 - this.damageReductionFactor;
        this.health -= amt;
    }

    get health() {
        return this.__health;
    }

    set health(health) {
        this.__health = Math.max(0, Math.min(this.maxHealth, health));
        this.healthBar.update(this);
        if (this.__health === 0) {
            this.killOnHealthZero();
        }
    }

    get autoControlHealthBar() {
        return this.healthBar.useEntityPos;
    }

    set autoControlHealthBar(on) {
        this.healthBar.useEntityPos = on;
    }

    /**
     * Called when health is set to 0. Override this to cancel the call to kill.
     */
    killOnHealthZero() {
        this.kill();
    }

    /**
     * Override to add logic. Make sure to call super.kill() to actually destory the entity.
     */
    kill() {
        this.healthBar.healthbar.destroy();
        this.healthBar = undefined;
        this.destroy();
    }

    get damageReductionFactor() {
        return this.__armor;
    }

    set damageReductionFactor(drf) {
        this.__armor = Math.max(0, drf);
    }

    move(direction, speed) {
        let newVelocity = speed || this.moveSpeed;
        switch (direction) {
            case DIRECTION.UP:
                this.sprite.body.velocity.y = -newVelocity;
                break;
            case DIRECTION.DOWN:
                this.sprite.body.velocity.y = newVelocity;
                break;
            case DIRECTION.LEFT:
                this.sprite.body.velocity.x = -newVelocity;
                break;
            case DIRECTION.RIGHT:
                this.sprite.body.velocity.x = newVelocity;
                break;
            default:
                throw "Unrecognized direction in Entity.move";
        }
    }

    update() {
        super.update();
        this.healthBar.update(this);
    }

}
