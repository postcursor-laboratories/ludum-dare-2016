import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {Enemy} from "./enemy";
import {TileMap} from "./tilemap";
import {globals} from "./globals";
import {ElementalPlayerDescriptor} from "./elemental-player";
import {ExplosionEmitterHelper} from "./explosion-emitter-helper";
import * as EarthSpells from "./spells/earth-spells";

class MainGame extends Game {

    constructor() {
        super(960, 640);
        this.tileMap = new TileMap(new Resource("triangle", "tilemaps/triangle.json"));
        globals.tileMap = this.tileMap;
    }

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png"),
                new Resource("rockProjectile", "img/rockProjectile.png"),
                new Resource("rockParticle", "img/rockParticle.png"),
                new Resource("magicParticle", "img/magicParticle.png")];
    }

    getPreLoadConfigurables() {
        this.ezEmit = new ExplosionEmitterHelper();
        return [
            GameConfigurable.of(game => {
                this.elementalPlayers = [
                    new ElementalPlayerDescriptor(game, "human", 32, 32, 400, 300, 5, 4, [4, 2, 4, 1]),
                    new ElementalPlayerDescriptor(game, "earth", 32, 32, 200, 100, 3, 4, [4, 2, 4, 1], EarthSpells.rockThrowSpell, EarthSpells.fissureSpell),
                    new ElementalPlayerDescriptor(game, "water", 32, 32, 300, 200, 6, 4, [4, 4, 4, 2]),
                    new ElementalPlayerDescriptor(game, "fire" , 32, 32, 350, 300, 6, 4, [4, 4, 4, 4]),
                    new ElementalPlayerDescriptor(game, "air"  , 32, 32, 400, 400, 4, 4, [4, 4, 4, 4])
                ];
            }),
            GameConfigurable.of(game =>
				game.load.spritesheet("transformation", "img/transform.png", 48, 48)),
	    GameConfigurable.of(game =>
				game.load.spritesheet("robot", "img/robots/ranged.png", 32, 32)),
            this.ezEmit,
            this.tileMap
        ];
    }

    getConfigurables() {
        return [
            GameConfigurable.of(game => this.configure(game)),
            this.tileMap.getNormalConfigurable()
        ];
    }

    configure(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        setupPlatformGroup(game);
        globals.enemyGroup = game.add.group();
        game.physics.arcade.gravity.y = 300;
        game.stage.smoothed = false;
        game.stage.backgroundColor = 0x694400;
        return [
            new Player(this.elementalPlayers, 100, 1400, 0),
	    new Enemy("robot", 400, 1400)
        ];
    }

}

new MainGame();
