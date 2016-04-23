import {Enemy} from "./enemy";
import {mainGame} from "./main";
import {DIRECTION} from "./entity";
import {Bullet} from "./bullet";

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
            if (this.x >= player.x) {
                this.setFacing(DIRECTION.LEFT);
            } else if (this.x < player.x) {
                this.setFacing(DIRECTION.RIGHT);
            }

            if (this.sprite.position.distance(player.sprite.position) < 400) {
                this.basicAttack();
            }
            // move towards player
            else if (this.x > player.x + stillBuf) {
                this.move(DIRECTION.LEFT);
            } else if (this.x < player.x - stillBuf) {
                this.move(DIRECTION.RIGHT);
            }
        }
    }

    basicAttack() {
        this.attacking = true;
        this.sprite.animations.play("basicAttack", 8, false);
        this.sprite.animations.currentAnim.onComplete.addOnce(() => {
            this.attacking = false;
            let player = mainGame.getPlayer();
            let bullet = new Bullet(this.sprite.x + 16 * (this.facing == DIRECTION.LEFT ? -1 : 1),
                this.sprite.y - 32 * (2 / 3),
                Math.atan2(player.sprite.y - this.sprite.y, player.sprite.x - this.sprite.x));
            bullet.configure(this.gameRef);
            this.sprite.animations.play("forward", 10, true);
        });
    }
}
