import {DIRECTION} from "./entity";
import {Character} from "./character";
import {globals} from "./globals";
import Phaser from "phaser";
import {Sprite} from "./sprite-wrapper";

export class Player extends Character {

    constructor(elementalPlayers, x, y) {
        super("human", x, y);
        this.elementalPlayers = elementalPlayers;
    }

    configure(game) {
        super.configure(game);
        this.gameRef.camera.follow(this.sprite, Phaser.Camera.FOLLOW_PLATFORMER);
        this.controls = game.input.keyboard.createCursorKeys();
        this.loadElemental(this.elementalPlayers[0]);
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
    }

    attemptShapeshift(elementalDescriptor) {
        this.sprite.body.enable = false;
        let transformationSprite = new Sprite("transformation", this.sprite.x - 48, this.sprite.y - 78);
        transformationSprite.configure(this.gameRef);
        transformationSprite.sprite.scale.setTo(2, 2);
        transformationSprite.sprite.animations.add("forward", [0, 1, 2, 3, 4]);
        transformationSprite.sprite.animations.add("backward", [5, 6, 7, 8, 9]);
        transformationSprite.sprite.animations.play("forward", 5, false);
        transformationSprite.sprite.animations.currentAnim.onComplete.add(event => {
            this.loadElemental(elementalDescriptor);
            transformationSprite.sprite.animations.play("backward", 5, false);
            transformationSprite.sprite.animations.currentAnim.onComplete.add(event => {
                this.sprite.body.enable = true;
                transformationSprite.sprite.destroy();
            });
        });

    }

    loadElemental(elementalDescriptor) {
        this.jumpSpeed = elementalDescriptor.jumpSpeed;
        this.moveSpeed = elementalDescriptor.moveSpeed;
        this.attackSpeed = elementalDescriptor.attackSpeed;
        this.setTexture(elementalDescriptor.elementalName, 0);
        this.addAnimations(elementalDescriptor.spritesheetWidth, elementalDescriptor.animationLengths);
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
        this.attemptAnim("basicAttack", this.attackSpeed, false);
    }

    update() {
        this.gameRef.physics.arcade.collide(this.sprite, globals.collisionLayer);

        if ((this.sprite.body.touching.down || this.sprite.body.onFloor()) && !(this.controls.left.isDown || this.controls.right.isDown)) {
            this.sprite.body.velocity.x *= 0.8;
        } else {
            this.sprite.body.velocity.x *= 0.98;
        }

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
}
