import {Enemy} from "./enemy";
import {mainGame} from "./main";
import {DIRECTION} from "./entity";

export class RangedEnemy extends Enemy {

    constructor(x, y) {
        super("robot-ranged", x, y, 100);
        this.attacking = false;
    }

    configure(game) {
        super.configure(game);
        this.sprite.animations.add("forward", [0, 1, 2, 3, 4, 5, 6, 7]);
        this.sprite.animations.add("basicAttack", [9, 10, 11, 12, 13, 14, 15, 16]);
        this.sprite.animations.play("forward", 10, true);
    }

    update() {
        super.update();

        let player = mainGame.getPlayer();
        let stillBuf = 5;


        if (!this.attacking) {
            if (Math.abs(this.x - player.x) <= 256 && Math.abs(this.y - player.y) < 24) {
                this.basicAttack();
            }
            // face towards player. Ranged things don't move because I'm lazy
            else if (this.x > player.x + stillBuf) {
                this.setFacing(DIRECTION.LEFT);
            } else if (this.x < player.x - stillBuf) {
                this.setFacing(DIRECTION.RIGHT);
            }
        }
    }

    basicAttack() {
        //let player = mainGame.getPlayer();
        //let game = player.gameRef;
        this.attacking = true;
        this.sprite.animations.play("basicAttack", 5, false);
        this.sprite.animations.currentAnim.onComplete.add(event => {
            this.attacking = false;
            this.sprite.animations.play("forward", 10, true);
        });

        // game.promethium.ezEmit.emit("magicParticle", this.x, this.y, 200, 1);
        // let pew = new Sprite("rockProjectile", this.x, this.y);
        // pew.configure(game);
        // game.promethium.allSprites.push(pew);
        // game.physics.arcade.enable(pew);

        // /*
        // pew.sprite.body.velocity.x = (player.facing == DIRECTION.LEFT ? -1 : 1) * 800;
        // pew.sprite.body.velocity.y = 0;
        // pew.update = () => {};
        // */
    }
}
