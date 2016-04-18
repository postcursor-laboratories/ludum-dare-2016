import {Sprite} from "../sprite-wrapper";
import {DIRECTION} from "../entity";
import {Spell} from "./spell";
import Phaser from "phaser"; // Gust uses keyboard controls because I'm bad.

const GUST_NAME = "Gust";
const GUST_MANA = 10;
const GUST_COOLDOWN = 1;
const GUST_DURATION = 5000;
const GUST_FORCE = 20;
const GUST_DRAG = 0.98;

export class GustSpell extends Spell {

    constructor() {
        super(GUST_NAME, GUST_COOLDOWN, GUST_MANA);
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
        
		
		let gustHandler = new Sprite("magicParticle", xCoord, yCoord); // we need a small, near invisible sprite
        gustHandler.configure(game);

        playerObj.setControlOverride(true); //take that!
		playerObj.sprite.body.allowGravity = false;
		playerObj.sprite.animations.play("jump",4,true);
		
		let keyboard = game.input.keyboard;
		
        gustHandler.update = () => {
            gustHandler.setPosition(playerObj.sprite.x, playerObj.sprite.y);
            game.promethium.ezEmit.emit("magicParticle", gustHandler.sprite.x,
                gustHandler.sprite.y - ((Math.random() - (1 / 3)) * 40), 1000, 1, -100, 100, -100, 100, -1);
            
			playerObj.sprite.body.velocity.y *= GUST_DRAG;
			playerObj.sprite.body.velocity.x *= GUST_DRAG;
			
			if(keyboard.isDown(Phaser.KeyCode.UP)) 
			{
				playerObj.sprite.body.velocity.y -= GUST_FORCE;
			}
			if(keyboard.isDown(Phaser.KeyCode.DOWN)) 
			{
				playerObj.sprite.body.velocity.y += GUST_FORCE;
			}
			if(keyboard.isDown(Phaser.KeyCode.LEFT)) 
			{
				playerObj.sprite.body.velocity.x -= GUST_FORCE;
				playerObj.setFacing(DIRECTION.LEFT);
			}
			if(keyboard.isDown(Phaser.KeyCode.RIGHT)) 
			{
				playerObj.sprite.body.velocity.x += GUST_FORCE;
				playerObj.setFacing(DIRECTION.RIGHT);
			}
		};

        let timer = game.time.create(true);
        timer.add(GUST_DURATION, () => {
            playerObj.setControlOverride(false);
			playerObj.sprite.body.allowGravity = true;
            gustHandler.destroy();
        });
        timer.start();
    }
}

const LIGHTNING_NAME = "Heatwave";
const LIGHTNING_MANA = 10;
const LIGHTNING_COOLDOWN = 1;

export class LightningSpell extends Spell
{
	constructor() {
		super(LIGHTNING_NAME, LIGHTNING_COOLDOWN, LIGHTNING_MANA);
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
		
	}
	
}
