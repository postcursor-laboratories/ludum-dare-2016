import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {TileMap} from "./tilemap";
import {globals} from "./globals";
import {ElementalPlayerDescriptor} from "./elemental-player";
import {ExplosionEmitterHelper} from "./explosion-emitter-helper";
import * as EarthSpells from "./spells/earth-spells";

class MainGame extends Game {

    constructor() {
        super(960, 640);
        this.tileMap = new TileMap();
        globals.tileMap = this.tileMap;
    }

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png"),
                new Resource("rockProjectile", "img/rockprojectile.png"),
                new Resource("rockParticle", "img/rockParticle.png"),
                new Resource("magicParticle", "img/magicParticle.png")];
    }

    getPreLoadConfigurables() {
        this.ezEmit = new ExplosionEmitterHelper();
        return [
            GameConfigurable.of(game => {
                this.elementalPlayers = [
                    new ElementalPlayerDescriptor(game, "human", 16, 32, 400, 300, 5, 4, [4, 2, 4, 1]),
                    new ElementalPlayerDescriptor(game, "earth", 32, 32, 200, 100, 3, 4, [4, 2, 4, 1], EarthSpells.rockThrowSpell),
                    new ElementalPlayerDescriptor(game, "water", 16, 32, 300, 200, 6, 4, [4, 4, 4, 2]),
                    new ElementalPlayerDescriptor(game, "fire" , 32, 32, 350, 300, 6, 4, [4, 4, 4, 4]),
                    new ElementalPlayerDescriptor(game, "air"  , 16, 16, 400, 400, 4, 4, [4, 4, 4, 4])
                ];
            }),
            GameConfigurable.of(game =>
                game.load.spritesheet("transformation", "img/transform.png", 48, 48)),
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
        game.physics.arcade.gravity.y = 300;
        game.stage.smoothed = false;
        game.stage.backgroundColor = 0x694400;
        return [
            new Player(this.elementalPlayers, 100, 40)
        ];
    }

}

new MainGame();
