import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup, Ground} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {TileMap} from "./tilemap";
import {globals} from "./globals";

class MainGame extends Game {

    constructor() {
        super();
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
        game.physics.arcade.gravity.y = 100;
        return [
            new Player("ground", 100, 40)
        ];
    }

}

new MainGame();
