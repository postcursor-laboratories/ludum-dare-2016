import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {Spell} from "./spell";
import {collideBox} from "../utils/collision";
import {globals} from "../globals";

const SURF_NAME = "Surf";
const SURF_MANA = 10;
const SURF_COOLDOWN = 1;
const SURF_SPEED = 700;
const SURF_DURATION = 400;
const SURF_DAMAGE = 1;

export class SurfSpell extends Spell {

    constructor() {
        super(SURF_NAME, SURF_COOLDOWN, SURF_MANA);
    }

    //TODO: DO NOT ALWAYS RETURN TRUE
    prerequisite() {
        return true;
    }

    castSpell(playerObj) {

        let game = playerObj.gameRef;
        let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1);
        let xCoord = playerObj.sprite.x + (facingSign * 8);
        let yCoord = playerObj.sprite.y - 48;

        let surfHandler = new Sprite("waterParticle", xCoord, yCoord); // we need a small, near invisible sprite
        surfHandler.configure(game);
        surfHandler.sprite.visible = false;

        playerObj.setControlOverride(true); //take that!

        let hitEnemy = (other) => {
            other.body.velocity.x += facingSign*80;
            other.wrapper.damage(SURF_DAMAGE);
        };
        
        surfHandler.update = () => {
            surfHandler.setPosition(playerObj.sprite.x, playerObj.sprite.y);
            game.promethium.ezEmit.emit("waterParticle", surfHandler.sprite.x,
                surfHandler.sprite.y - ((Math.random() - (1 / 3)) * 40), 2000, 20, -100, 100, -200, 0, 10);
            playerObj.sprite.body.velocity.x = SURF_SPEED * facingSign;
            
            collideBox(playerObj.sprite.x, playerObj.sprite.y - 32, 32, 64, globals.enemyGroup, hitEnemy);
        };

        let timer = game.time.create(true);
        timer.add(SURF_DURATION, () => {
            playerObj.setControlOverride(false);
            surfHandler.destroy();
        });
        timer.start();
    }
}

const FROSTBITE_NAME = "Frostbite";
const FROSTBITE_MANA = 10;
const FROSTBITE_COOLDOWN = 1;
const FROSTBITE_DAMAGE = 4;
const FROSTBITE_DAMAGE_AMP = 1;

export class FrostbiteSpell extends Spell {

    constructor() {
        super(FROSTBITE_NAME, FROSTBITE_COOLDOWN, FROSTBITE_MANA);
    }

    //TODO: DO NOT ALWAYS RETURN TRUE
    prerequisite() {
        return true;
    }

    castSpell(playerObj) {
        let game = playerObj.gameRef;
        let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1);
        let xCoord = playerObj.sprite.x + (facingSign * 16);
        let yCoord = playerObj.sprite.y - 48;

        playerObj.setControlOverride(true);
        playerObj.sprite.animations.add("frost", [9]);
        playerObj.sprite.animations.play("frost", 1, false);

        let frost = new Sprite("frostbite", xCoord, yCoord);
        frost.configure(game);
        frost.sprite.anchor.x = 0;

        frost.sprite.scale.setTo(2 * facingSign, 2);
        frost.sprite.animations.add("frost2", [0, 1, 2, 3]);
        frost.sprite.animations.play("frost2", 4, false);

        playerObj.setControlOverride(true);

        frost.update = () => {
            //deal damage here!
        };
        
        let hitEnemy = (other) => {
            other.body.velocity.y = 0;
            other.body.velocity.x = 0;
            other.body.enable = false;
            other.tint = 0x00c0ff;
            other.wrapper.damage(FROSTBITE_DAMAGE);
            other.wrapper.damageReductionFactor = -FROSTBITE_DAMAGE_AMP; // Double damage;
            
            let endFreeze = game.time.create(true);
            endFreeze.add(3000, () => {
                other.body.enable = true;
                other.tint = 0xffffff;
            });
            endFreeze.start();
            
        };

        let attackTimer = game.time.create(true);
        attackTimer.add(750, () => {
            collideBox(playerObj.sprite.x+32*facingSign, playerObj.sprite.y - 32, 96, 64, globals.enemyGroup, hitEnemy);
        });
        attackTimer.start();
        
        let timer = game.time.create(true);
        timer.add(1100, () => {
            playerObj.setControlOverride(false);
            frost.destroy();
            //playerObj.sprite.animations.getAnimation("frost").destroy();
            //Destroying the frost animation causes a crash when you next transform
            //TODO fix that but until then I'm just removing this
            //Don't spam frostbite, it has a memory leak.
        });
        timer.start();


    }

}
