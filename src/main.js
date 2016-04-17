import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup, Ground} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {TileMap} from "./tilemap";
import {globals} from "./globals";
import {ElementalPlayerDescriptor} from "elemental-player";

class MainGame extends Game {

    constructor() {
        super(960, 640);
        this.tileMap = new TileMap();
        globals.tileMap = this.tileMap;
    }

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png")];
    }

    getPreLoadConfigurables() {
        return [
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
        let elementalPlayers = {
            "human": new ElementalPlayerDescriptor(game, "human", 16, 32, 200, 200),
            "earth": new ElementalPlayerDescriptor(game, "earth", 32, 32, 100, 100),
            "water": new ElementalPlayerDescriptor(game, "water", 16, 32, 200, 200),
            "fire" : new ElementalPlayerDescriptor(game, "fire" , 16, 32, 250, 300),
            "air"  : new ElementalPlayerDescriptor(game, "air"  , 16, 16, 300, 400)
        };
        return [
            new Player(elementalPlayers, 100, 40)
        ];
    }

}

new MainGame();
