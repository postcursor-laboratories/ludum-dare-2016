import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup, Ground} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {TileMap} from "./tilemap";
import {globals} from "./globals";

class MainGame extends Game {

    constructor() {
        super(160, 160);
        this.tileMap = new TileMap();
        globals.tileMap = this.tileMap;
    }

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png")];
    }

    getPreLoadConfigurables() {
        this.phaserGame.load.spritesheet("player", "img/PlayerSpritemap.png", 16, 32);
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
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.stage.smoothed = false;
        game.stage.backgroundColor = 0x694400;
        return [
            new Player(100, 40)
        ];
    }

}

new MainGame();
