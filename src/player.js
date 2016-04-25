import {DIRECTION} from "./entity";
import {Character} from "./character";
import Phaser from "phaser";
import {ExtendedSprite} from "./sprite-extension";
import {globals} from "./globals";
import * as collisions from "./utils/collision";
import {elementalPlayers} from "./stages/boot-stage";
import {AIR, EARTH, FIRE, HUMAN, WATER} from "./elemental-player";

const PLAYER_HEALTH = 100;

export class Player extends Character {

    constructor(x, y) {
        super(HUMAN, x, y, PLAYER_HEALTH);
    }

    configure(game) {
        super.configure(game);
        this.gameRef.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
        this.controls = game.input.keyboard.createCursorKeys();
        this.loadElemental(elementalPlayers.get(HUMAN));
        // unused this.shapeshiftKeys is for GC holding
        const keys = this.shapeshiftKeys = new Map();
        keys.set(HUMAN, game.input.keyboard.addKey(Phaser.KeyCode.ONE));
        keys.set(EARTH, game.input.keyboard.addKey(Phaser.KeyCode.TWO));
        keys.set(WATER, game.input.keyboard.addKey(Phaser.KeyCode.THREE));
        keys.set(FIRE, game.input.keyboard.addKey(Phaser.KeyCode.FOUR));
        keys.set(AIR, game.input.keyboard.addKey(Phaser.KeyCode.FIVE));
        keys.forEach((obj, ele) =>
            obj.onDown.add(() => {
                this.attemptShapeshift(elementalPlayers.get(ele));
            }));
        this.basicAttackKey = game.input.keyboard.addKey(Phaser.KeyCode.Z);
        this.basicAttackKey.onDown.add(() => this.basicAttack());
        this.spellOneKey = game.input.keyboard.addKey(Phaser.KeyCode.X);
        this.spellOneKey.onDown.add(() => this.spellOne());
        this.spellTwoKey = game.input.keyboard.addKey(Phaser.KeyCode.C);
        this.spellTwoKey.onDown.add(() => this.spellTwo());

        this.sprite.body.setSize(10, this.sprite.body.height * 0.8);

        this.controlOverride = false;
        this.autoControlHealthBar = false;
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
            let transformationSprite = new ExtendedSprite("transformation", this.sprite.x - 48, this.sprite.y - 78);
            transformationSprite.configure(this.gameRef);
            transformationSprite.sprite.scale.setTo(2, 2);
            transformationSprite.sprite.animations.add("forward", [0, 1, 2, 3, 4]);
            transformationSprite.sprite.animations.add("backward", [5, 6, 7, 8, 9]);
            transformationSprite.sprite.animations.play("forward", 10, false);
            transformationSprite.sprite.animations.currentAnim.onComplete.addOnce(event => {
                this.loadElemental(elementalDescriptor);
                transformationSprite.sprite.animations.play("backward", 10, false);
                transformationSprite.sprite.animations.currentAnim.onComplete.addOnce(event => {
                    this.sprite.body.enable = true;
                    transformationSprite.destroy();
                });
            });
        }
    }

    loadElemental(elementalDescriptor) {
        (this.gameRef.promethium.hud || {
            reloadSpells: () => {
            }
        }).reloadSpells(elementalDescriptor.elementalName);
        this.damageReductionFactor = elementalDescriptor.damageReductionFactor;
        this.attackDamage = elementalDescriptor.attackDamage;
        this.jumpSpeed = elementalDescriptor.jumpSpeed;
        this.moveSpeed = elementalDescriptor.moveSpeed;
        this.attackSpeed = elementalDescriptor.attackSpeed;
        this.setTexture(elementalDescriptor.elementalName, 0);
        this.addAnimations(elementalDescriptor.spriteSheetWidth, elementalDescriptor.animationLengths);
        this.currentElemental = elementalDescriptor;
    }

    addAnimations(sheetWidth, animationLengths) {
        let names = ["walk", "stationary", "basicAttack", "jump"];
        let index = 0;
        animationLengths.forEach((animation, j) => {
            if (animation > sheetWidth) {
                throw "sheetWidth exceeded: " + animation + " of " + animationLengths;
            }
            let array = [];
            for (let i = 0; i < animation; i++) {
                array.push(i + index);
            }
            index += sheetWidth;
            console.log(`${index} + ${animation} => ${names[j]} =`, array);
            this.sprite.animations.add(names[j], array);
        });
        this.sprite.animations.stop();
    }

    basicAttack() {
        if (!this.controlOverride) {
            this.attemptAnim("basicAttack", this.attackSpeed, false);
        }
        const s = this.sprite;
        let width = 20;
        let xOffset = s.width / 3;
        if (this.facing === DIRECTION.LEFT) {
            xOffset *= -1;
            xOffset -= width * 2;
        }
        const yOffset = (2.5 * s.height) / 5;
        collisions.collideBox(s.x + xOffset, s.y - yOffset, width, 10, globals.enemyGroup, enemy => {
            enemy.extension.damage(this.attackDamage);
        });
    }

    update() {
        this.healthBar.update(this);
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
