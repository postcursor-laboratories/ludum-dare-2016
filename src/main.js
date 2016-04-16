import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup, Ground} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {TileMap} from "./tilemap";

class MainGame extends Game {

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png")];
    }

    getPreLoadConfigurables() {
        return [
            GameConfigurable.of(game => game.add.plugin(Phaser.Plugin.Tiled)),
            new TileMap()
        ];
    }

    getConfigurables() {
        return [
            GameConfigurable.of(game => this.configure(game))
        ];
    }

    configure(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        setupPlatformGroup(game);
        game.physics.arcade.gravity.y = 100;
        this.tileMap = game.add.tiledmap("map");
        return [
            new Player("ground", 100, 40)
        ];
    }

}

new MainGame();
