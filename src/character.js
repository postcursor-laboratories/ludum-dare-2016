import {Entity, DIRECTION} from "./entity";
import {globals} from "./globals";

export class Character extends Entity {

    constructor(sprite, x, y) {
        super(sprite, x, y);
        this.jumpSpeed = 200;
        this.jumpAnimationCounter = 0;
        this.jumpingTime = 25;
        this.facing = DIRECTION.RIGHT;
        this.animationPriority = ["basicAttack", "jump", "walk", "stationary"];
    }

    configure(game) {
        super.configure(game);
        this.addAnimations();
        this.facing = DIRECTION.RIGHT;
    }

    setTexture(texture, frame = undefined) {
        let args = [texture];
        if (frame !== undefined) {
            args.push(frame);
        }
        this.sprite.animations.stop();
        this.sprite.loadTexture.apply(this.sprite, args);
        this.addAnimations();
    }

    addAnimations() {
        this.sprite.animations.add("walk", [0, 1, 2, 3]);
        this.sprite.animations.add("stationary", [4, 5]);
        this.sprite.animations.add("jump", [12]);
        this.sprite.animations.stop();
    }

    attemptAnim(name, frameRate, loop) {
        if (this.canOverrideAnimation(name)) {
            this.sprite.animations.play(name, frameRate, loop, false);
            return true;
        } else {
            return false;
        }
    }

    jump() {
        this.jumpAnimationCounter = this.jumpingTime;
        super.move(DIRECTION.UP, this.jumpSpeed);
    }

    move(direction) {
        switch (direction) {
            case DIRECTION.LEFT:
                this.setFacing(DIRECTION.LEFT);
                this.sprite.body.velocity.x = Math.max(-this.moveSpeed, this.sprite.body.velocity.x - 10);
                this.attemptAnim("walk", Math.max(4, Math.round(Math.abs(this.sprite.body.velocity.x) / 15)), false);
                break;
            case DIRECTION.RIGHT:
                this.setFacing(DIRECTION.RIGHT);
                this.sprite.body.velocity.x = Math.min(this.moveSpeed, this.sprite.body.velocity.x + 10);
                this.attemptAnim("walk", Math.max(4, Math.round(Math.abs(this.sprite.body.velocity.x) / 15)), false);
                break;
            default:
                throw "Unrecognized direction in Character.move";
        }
    }

    canOverrideAnimation(animationName) {
        if (this.sprite.animations.currentAnim.isFinished || !this.sprite.animations.currentAnim.isPlaying) {
            return true;
        }
        return this.animationPriority.indexOf(animationName) < this.animationPriority.indexOf(this.sprite.animations.currentAnim.name);
    }

    basicAttack() {
        throw "Cannot call basicAttack on Character class";
    }

    update() {
        this.gameRef.physics.arcade.collide(this.sprite, globals.collisionLayer);

        if (this.sprite.body.touching.down || this.sprite.body.onFloor()) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

        this.attemptAnim("stationary", 4, true);

        if (this.jumpAnimationCounter > 0) {
            this.attemptAnim("jump", 5, false);
            this.jumpAnimationCounter--;
        }
    }

    setFacing(direction) {
        if (direction == DIRECTION.LEFT) {
            this.facing = direction;
            this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
        } else if (direction == DIRECTION.RIGHT) {
            this.facing = direction;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
        }
    }
}
