import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {globals} from "../globals";

export function rockThrowSpell(playerObj) {
    let game = playerObj.gameRef;
    let facingSign = (playerObj.facing == DIRECTION.LEFT ? -1 : 1)
    let xCoord = playerObj.sprite.x + (facingSign * 8);
    let yCoord = playerObj.sprite.y - 48;
    game.promethium.ezEmit.emit("magicParticle", xCoord + (facingSign * 16), yCoord, 2000, 20);
    let rock = new Sprite("rockProjectile", xCoord, yCoord);
    rock.configure(game);
    game.promethium.allSprites.push(rock);
    game.physics.arcade.enable(rock.sprite);
    rock.sprite.body.velocity.x = facingSign * 400;
    rock.sprite.body.velocity.y = -50;
    rock.update = () => {
        if (game.physics.arcade.collide(rock.sprite, globals.collisionLayer)) {
            game.promethium.ezEmit.emit("rockParticle", rock.sprite.x, rock.sprite.y, 2000, 10);
            rock.sprite.destroy();
            return;
        }
    }
}