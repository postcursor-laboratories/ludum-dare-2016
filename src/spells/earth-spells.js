import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {Spell} from "./spell";
import {collideBox} from "../utils/collision";
import {globals} from "../globals";

const ROCKTHROW_NAME = "Rock Throw";
const ROCKTHROW_MANA = 10;
const ROCKTHROW_COOLDOWN = 1;
const ROCKTHROW_DAMAGE = 1;

export class RockThrowSpell extends Spell {

    constructor() {
        super(ROCKTHROW_NAME, ROCKTHROW_COOLDOWN, ROCKTHROW_MANA);
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
        let rock = new Sprite("rockProjectile", xCoord, yCoord);
        rock.configure(game);
        game.physics.arcade.enable(rock.sprite);
        rock.sprite.body.velocity.x = facingSign * 400;
        rock.sprite.body.velocity.y = -50;

        rock.hitEnemy = (other) => {
            game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
            rock.destroy();
            other.wrapper.damage(ROCKTHROW_DAMAGE);
        };

        rock.update = () => {
            if (rock.checkCollision()) {
                game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
                rock.destroy();
            }
            collideBox(rock.sprite.x+4, rock.sprite.y+4, 8, 8, globals.enemyGroup, rock.hitEnemy); // if we hit an enemy call hitEnemy
        };

    }
}

const FISSURE_NAME = "Rock Throw";
const FISSURE_MANA = 10;
const FISSURE_COOLDOWN = 1;
const FISSURE_DAMAGE = 10;

export class FissureSpell extends Spell {

    constructor() {
        super(FISSURE_NAME, FISSURE_COOLDOWN, FISSURE_MANA);
    }

    //TODO: DO NOT ALWAYS RETURN TRUE
    prerequisite() {
        return true;
    }

    castSpell(playerObj) {
        let game = playerObj.gameRef;
        let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1);
        let xCoord = playerObj.sprite.x + (facingSign * 14);
        let yCoord = playerObj.sprite.y - 4;
        let rocks = [];
        for (let i = 0; i < 10; i++) {
            let rock = new Sprite("rockProjectile", xCoord + (i * 13 * facingSign), yCoord);
            rock.configure(game);
            rock.sprite.anchor.setTo(0.5, 0.5);
            rock.sprite.rotation = Math.random() * 2 * Math.PI;
            rocks.push(rock);
            this.magicParticles(xCoord + (i * 13 * facingSign), yCoord);
        }
        
        let spritesToReenable = [];
        
        let hitEnemy = (other) => {
            other.wrapper.damage(FISSURE_DAMAGE);
            other.body.velocity.y = 0;
            other.body.velocity.x = 0;
            other.body.enable = false;
            spritesToReenable.push(other);
        };
        
        collideBox(xCoord+65*facingSign, yCoord, 16, 16, globals.enemyGroup, hitEnemy); // if we hit an enemy call hitEnemy
        
        let timer = game.time.create(true);
        timer.add(2000, () => {
            rocks.forEach(rock => {
                game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
                rock.destroy();
            });
            spritesToReenable.forEach(other => {
                other.body.enable = true;
            });
        });
        timer.start();
    }

}
