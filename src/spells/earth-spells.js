import {ExtendedSprite} from "../sprite-extension";
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
        let rock = new ExtendedSprite("rockProjectile", xCoord, yCoord);
        rock.configure(game);
        game.physics.arcade.enable(rock.sprite);
        rock.sprite.body.velocity.x = facingSign * 400;
        rock.sprite.body.velocity.y = -50;

        rock.hitEnemy = (other) => {
            game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
            rock.destroy();
            other.extension.damage(ROCKTHROW_DAMAGE);
        };

        rock.update = () => {
            if (rock.checkCollision()) {
                game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
                rock.destroy();
            }
            collideBox(rock.sprite.x + 4, rock.sprite.y + 4, 8, 8,
                globals.enemyGroup, rock.hitEnemy); // if we hit an enemy call hitEnemy
        };

    }
}

const FISSURE_NAME = "Fissure";
const FISSURE_MANA = 10;
const FISSURE_COOLDOWN = 1;
const FISSURE_DAMAGE = 10;
const FISSURE_ROCK_SPACING = 13;
const FISSURE_NUM_ROCKS = 10;

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
        for (let i = 0; i < FISSURE_NUM_ROCKS; i++) {
            let rock = new ExtendedSprite("rockProjectile", xCoord + (i * FISSURE_ROCK_SPACING * facingSign), yCoord);
            rock.configure(game);
            rock.sprite.anchor.setTo(0.5, 0.5);
            rock.sprite.rotation = Math.random() * 2 * Math.PI;
            rocks.push(rock);
            this.magicParticles(xCoord + (i * FISSURE_ROCK_SPACING * facingSign), yCoord);
        }

        let spritesToReenable = [];

        let hitEnemy = (other) => {
            other.body.velocity.y = 0;
            other.body.velocity.x = 0;
            other.body.enable = false;
            other.extension.damage(FISSURE_DAMAGE);
            spritesToReenable.push(other);
        };

        collideBox(xCoord + FISSURE_ROCK_SPACING * FISSURE_NUM_ROCKS * 0.5 * facingSign, yCoord - 8,
            FISSURE_NUM_ROCKS * FISSURE_ROCK_SPACING * 0.5, 16, globals.enemyGroup, hitEnemy); // if we hit an enemy call hitEnemy

        let timer = game.time.create(true);
        timer.add(2000, () => {
            rocks.forEach(rock => {
                game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
                rock.destroy();
            });
            spritesToReenable.forEach(other => {
                if (other.alive) {
                    other.body.enable = true;
                }

            });
        });
        timer.start();
    }

}
