import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {Spell} from "./spell";
import {nullFn} from "../utils/nulls";

const FIREBALL_NAME = "Fireball";
const FIREBALL_MANA = 10;
const FIREBALL_COOLDOWN = 1;
const FIREBALL_DAMAGE = 10;

export class FireballSpell extends Spell {

    constructor() {
        super(FIREBALL_NAME, FIREBALL_COOLDOWN, FIREBALL_MANA);
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
        this.magicParticles(xCoord + (facingSign * 16), yCoord);
        let fireball = new Sprite("fireballProjectile", xCoord, yCoord);
        fireball.configure(game);
        game.physics.arcade.enable(fireball.sprite);
        fireball.sprite.body.allowGravity = false; //we don't obey that gravity thing here!
        fireball.sprite.body.velocity.x = facingSign * 400;
        fireball.sprite.body.velocity.y = 0;
        let isDestroyed = false;
        fireball.explode = () => {
            if (!isDestroyed) {
                
                let hitEnemy = (other) => {
                    other.wrapper.damage(FIREBALL_DAMAGE);
                }
                
                collideBox(fireball.sprite.x+4, fireball.sprite.y+4, 64, 64, globals.enemyGroup, hitEnemy);
                fireball.destroy();
                game.promethium.ezEmit.emit("fireballParticle", fireball.sprite.x, fireball.sprite.y, 250, 50);
                isDestroyed = true;
                //Deal damage to surroundings here please
            }
        };
        fireball.update = () => {
            if (fireball.checkCollision()) {
                game.promethium.ezEmit.emit("fireballParticle", fireball.sprite.x, fireball.sprite.y, 500, 25, -100, 100, -100, 100, 1); // supposedly gravity of 0 is default.
                fireball.explode();
            }
        };
        let timer = game.time.create(true);
        timer.add(2000, () => {

            fireball.explode();
        });
        timer.start();
    }
}

const HEATWAVE_NAME = "Heatwave";
const HEATWAVE_MANA = 10;
const HEATWAVE_COOLDOWN = 1;
const HEATWAVE_DAMAGE = 1;

export class HeatwaveSpell extends Spell {
    constructor() {
        super(HEATWAVE_NAME, HEATWAVE_COOLDOWN, HEATWAVE_MANA);
    }

    //TODO: DO NOT ALWAYS RETURN TRUE
    prerequisite() {
        return true;
    }

    castSpell(playerObj) {
        let game = playerObj.gameRef;
        let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1);
        let xCoord = playerObj.sprite.x + (facingSign * 8);
        let yCoord = playerObj.sprite.y - 16; //skim ground
        game.promethium.ezEmit.emit("magicParticle", xCoord + (facingSign * 16), yCoord, 2000, 20);
        let wave1 = new Sprite("fireballProjectile", xCoord, yCoord);
        wave1.configure(game);
        game.physics.arcade.enable(wave1.sprite);
        wave1.sprite.body.allowGravity = false; //we don't obey that gravity thing here!
        wave1.sprite.body.velocity.x = 400 * facingSign;
        wave1.sprite.body.velocity.y = 0;

        wave1.lastPosition = 0; // distance from center
        wave1.startPosition = xCoord;
        wave1.facingSign = facingSign;

        let hitEnemy = (other) => {
            game.promethium.ezEmit.emit("fireballParticle", other.x, other.y, 250, 10);
            rock.destroy();
            other.wrapper.damage(HEATWAVE_DAMAGE);
        };
        
        wave1.update = () => {
            if (wave1.checkCollision() || Math.abs(wave1.sprite.x - wave1.startPosition) > 256) {
                game.promethium.ezEmit.emit("fireballParticle", wave1.sprite.x, wave1.sprite.y, 125, 25, -100, 100, -100, 100, 1); // supposedly gravity of 0 is default.
                wave1.destroy();
            }
            if (Math.abs(wave1.sprite.x - wave1.startPosition) >= wave1.lastPosition + 16) {
                wave1.lastPosition += 16;
                wave1.summonFire();
            }
        };
        wave1.summonFire = () => {
            game.promethium.ezEmit.emit("fireballParticle", xCoord + wave1.lastPosition * wave1.facingSign, yCoord, 2000, 5);
            let flame = new Sprite("heatwaveProjectile", xCoord + wave1.lastPosition * wave1.facingSign, yCoord);
            flame.configure(game);
            game.physics.arcade.enable(flame.sprite);

            let flameBody = flame.sprite.body;
            flameBody.velocity.x = 0;
            flameBody.velocity.y = -150;

            let timer = game.time.create(true);
            timer.add(3000, () => {
                flameBody.velocity.y = -75;
                flameBody.allowGravity = true;
                ["up", "down", "left", "right"].forEach(f => {
                    flameBody.checkCollision[f] = false;
                });
                flame.sprite.tint = 0x8A8A8A;
                flame.update = () => {
                    if (!flame.sprite.inWorld) {
                        flame.destroy();
                    }
                };
            });
            timer.start();

            flame.update = () => {
                flame.checkCollision();
                if ((flameBody.touching.down || flameBody.onFloor())) {
                    flameBody.velocity.y = 0;
                    flameBody.allowGravity = false;
                    if(Math.random() > 0.8){
                        collideBox(flameBody.sprite.x+8, flameBody.sprite.y+4, 16, 8, globals.enemyGroup, hitEnemy);
                    }
                    
                }
            };

        };

    }

}
