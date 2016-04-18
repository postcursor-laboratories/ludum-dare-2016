import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {Spell} from "./spell";

const FIREBALL_NAME = "Fireball";
const FIREBALL_MANA = 10;
const FIREBALL_COOLDOWN = 1;

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
        fireball.explode = () => {
            fireball.destroy();
            game.promethium.ezEmit.emit("fireballParticle", fireball.sprite.x, fireball.sprite.y, 250, 50);
            //Deal damage to surroundings here please
        };
        fireball.update = () => {
            if (fireball.checkCollision()) {
                game.promethium.ezEmit.emit("fireballParticle", fireball.sprite.x, fireball.sprite.y, 500, 25, -100, 100, -100, 100, 1); // supposedly gravity of 0 is default.
                fireball.explode();
            }
        };
        timer.add(2000, () => {

            fireball.explode();
        });
    }
}

const HEATWAVE_NAME = "Heatwave";
const HEATWAVE_MANA = 10;
const HEATWAVE_COOLDOWN = 1;

export class HeatwaveSpell extends Spell
{
	constructor() {
		super(HEATWAVE_NAME, HEATWAVE_COOLDOWN, HEATWAVE_MANA);
	}
	
	//TODO: DO NOT ALWAYS RETURN TRUE
	prerequisite()
	{
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
		wave1.sprite.body.velocity.x = 400*facingSign;
		wave1.sprite.body.velocity.y = 0;
		
		wave1.lastPosition = 0; // distance from center
		wave1.startPosition = xCoord;
		wave1.facingSign = facingSign;
		
		wave1.update = () => {
			if (wave1.checkCollision() || Math.abs(wave1.sprite.x-wave1.startPosition) > 256) {
				game.promethium.ezEmit.emit("fireballParticle", wave1.sprite.x, wave1.sprite.y, 125,25,-100, 100, -100, 100,1); // supposedly gravity of 0 is default.
				wave1.destroy();
			}
			if (Math.abs(wave1.sprite.x-wave1.startPosition) >= wave1.lastPosition + 16)
			{
				wave1.lastPosition += 16;
				wave1.summonFire();
			}
		};
		wave1.summonFire = () => {
			game.promethium.ezEmit.emit("fireballParticle",xCoord+ wave1.lastPosition * wave1.facingSign, yCoord, 2000, 5);
			let flame = new Sprite("heatwaveProjectile", xCoord+wave1.lastPosition * wave1.facingSign, yCoord);
			flame.configure(game);
			game.physics.arcade.enable(flame.sprite);
			flame.sprite.body.velocity.x = 0;
			flame.sprite.body.velocity.y = -150;
			flame.update = () => {
				fireball.checkCollision();
				if((flame.sprite.body.touching.down || flame.sprite.body.onFloor()))
				{
					flame.sprite.body.velocity.y = 0;
					flame.sprite.body.allowGravity = false;
				}
			};
			
		};
		
	}
	
}
