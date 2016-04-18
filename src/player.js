import {DIRECTION} from "./entity";
import {Character} from "./character";
import Phaser from "phaser";
import {Sprite} from "./sprite-wrapper";
import {globals} from "./globals";
import * as collisions from "./utils/collision";

const PLAYER_HEALTH = 100;

export class Player extends Character {

    constructor(elementalPlayers, x, y, firstElemental) {
        super("human", x, y, PLAYER_HEALTH);
        this.elementalPlayers = elementalPlayers;
        this.firstElemental = firstElemental;
    }

    configure(game) {
        super.configure(game);
        this.gameRef.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
        this.controls = game.input.keyboard.createCursorKeys();
        this.loadElemental(this.elementalPlayers[this.firstElemental]);
        this.shapeshiftKeys = [game.input.keyboard.addKey(Phaser.KeyCode.ONE),
            game.input.keyboard.addKey(Phaser.KeyCode.TWO),
            game.input.keyboard.addKey(Phaser.KeyCode.THREE),
            game.input.keyboard.addKey(Phaser.KeyCode.FOUR),
            game.input.keyboard.addKey(Phaser.KeyCode.FIVE)];
        this.shapeshiftKeys.forEach((obj, index) =>
            obj.onDown.add(event => {
                this.attemptShapeshift(this.elementalPlayers[index]);
            }));
        this.basicAttackKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.basicAttackKey.onDown.add(() => this.basicAttack());
        this.spellOneKey = game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.spellOneKey.onDown.add(() => this.spellOne());
        this.spellTwoKey = game.input.keyboard.addKey(Phaser.KeyCode.C);
        this.spellTwoKey.onDown.add(() => this.spellTwo());

        this.sprite.body.setSize(10, this.sprite.body.height * 0.8);

        this.controlOverride = false;
    }

    spellTwo() {
        if (!this.controlOverride) {
            this.currentElemental.spellTwo.castSpell(this);
        }
    }

    spellOne() {
        if (!this.controlOverride) {
            this.currentElemental.spellOne.castSpell(this);
        }
    }

    attemptShapeshift(elementalDescriptor) {
        if (!this.controlOverride) {
            this.sprite.body.enable = false;
            let transformationSprite = new Sprite("transformation", this.sprite.x - 48, this.sprite.y - 78);
            transformationSprite.configure(this.gameRef);
            transformationSprite.sprite.scale.setTo(2, 2);
            transformationSprite.sprite.animations.add("forward", [0, 1, 2, 3, 4]);
            transformationSprite.sprite.animations.add("backward", [5, 6, 7, 8, 9]);
            transformationSprite.sprite.animations.play("forward", 10, false);
            transformationSprite.sprite.animations.currentAnim.onComplete.add(event => {
                this.loadElemental(elementalDescriptor);
                transformationSprite.sprite.animations.play("backward", 10, false);
                transformationSprite.sprite.animations.currentAnim.onComplete.add(event => {
                    this.sprite.body.enable = true;
                    transformationSprite.sprite.destroy();
                });
            });
        }
    }

    loadElemental(elementalDescriptor) {
        this.damageReductionFactor = elementalDescriptor.damageReductionFactor;
        this.jumpSpeed = elementalDescriptor.jumpSpeed;
        this.moveSpeed = elementalDescriptor.moveSpeed;
        this.attackSpeed = elementalDescriptor.attackSpeed;
        this.setTexture(elementalDescriptor.elementalName, 0);
        this.addAnimations(elementalDescriptor.spritesheetWidth, elementalDescriptor.animationLengths);
        this.currentElemental = elementalDescriptor;
    }

    addAnimations(sheetWidth, animationLengths) {
        let names = ["walk", "stationary", "basicAttack", "jump"];
        let index = 0;
        let j = 0;
        for (let animation of animationLengths) {
            if (animation > sheetWidth) {
                throw "sheetWidth exceeded: " + animation + " of " + animationLengths;
            }
            let array = [];
            let i = 0;
            for (i = 0; i < animation; i++) {
                array.push(i + index);
            }
            index += sheetWidth;
            this.sprite.animations.add(names[j], array);
            j++;
        }
        this.sprite.animations.stop();
    }

    basicAttack() {
        if (!this.controlOverride) {
            this.attemptAnim("basicAttack", this.attackSpeed, false);
        }
        const s = this.sprite;
        collisions.collideBox(s.x + 5, s.y + 5, 20, 20, globals.enemyGroup, enemy => {
            enemy.wrapper.damage(1 + this.damageReductionFactor);
            console.log(enemy.wrapper.health);
        });
    }

    update() {
        this.checkCollision();

        if ((this.sprite.body.touching.down || this.sprite.body.touching.up || this.sprite.body.onFloor()) && this.sprite.animations.currentAnim.name == "jump") {
            this.sprite.animations.play("stationary", 4, true);
        }

        if ((this.sprite.body.touching.down || this.sprite.body.onFloor()) && !(this.controls.left.isDown || this.controls.right.isDown)) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

        if (!this.controlOverride) {
            if (this.controls.left.isDown) {
                this.move(DIRECTION.LEFT);
            } else if (this.controls.right.isDown) {
                this.move(DIRECTION.RIGHT);
            } else {
                this.attemptAnim("stationary", 4, true);
            }

            if (this.controls.up.isDown && (this.sprite.body.touching.down || this.sprite.body.onFloor())) {
                this.jump();
            }
        }

        if (this.jumpAnimationCounter > 0) {
            this.attemptAnim("jump", 5, false);
            this.jumpAnimationCounter--;
        }
    }

    setFacing(direction) {
        if (direction === DIRECTION.LEFT) {
            this.facing = direction;
            this.sprite.scale.x = -Math.abs(this.sprite.scale.x);
        } else if (direction === DIRECTION.RIGHT) {
            this.facing = direction;
            this.sprite.scale.x = Math.abs(this.sprite.scale.x);
        }
    }

    /**
     *  If set to true, player's keypresses do nothing whatsoever.
     */
    setControlOverride(override) {
        this.controlOverride = override;

    }
}
