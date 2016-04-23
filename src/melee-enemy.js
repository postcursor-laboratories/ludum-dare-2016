import {Enemy} from "./enemy";
import {mainGame} from "./main";
import {DIRECTION} from "./entity";
import {globals} from "./globals";
import {collideBox} from "./utils/collision";

const ATTACK_DAMAGE = 10;
export class MeleeEnemy extends Enemy {

    constructor(x, y) {
        super("robot-melee", x, y, 100);
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

        // are we close enough to punch the player with our plunger and/or eggbeater?
        if (!this.attacking) {
            if (Math.abs(this.x - player.x) <= 40 && Math.abs(this.y - player.y) < 15) {
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
        this.sprite.animations.play("basicAttack", 5, false);
        this.sprite.animations.currentAnim.onComplete.add(event => {
            this.attacking = false;
            this.sprite.animations.play("forward", 10, true);
        });

        let hitEnemy = (other) => {
            other.extension.damage(ATTACK_DAMAGE);
        };

        let attackTimer = this.gameRef.time.create(true);
        attackTimer.add(750, () => {
            let facingSign = this.facing == DIRECTION.LEFT ? -1 : 1;
            collideBox(this.sprite.x + 16 * facingSign, this.sprite.y - 32, 32, 64, globals.player, hitEnemy);
        });
        attackTimer.start();
    }
}
