import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {platformGroup, Ground} from "./sprites/platforms";
import Phaser from "phaser";

class MainGame extends Game {

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png")];
    }

    getConfigurables() {
        return [
            GameConfigurable.of(game => this.configure(game))
        ];
    }

    configure(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        platformGroup[0] = (function createPlatformGroup() {
            let platforms = game.add.group();
            platforms.enableBody = true;
            return platforms;
        })();
        return [
            new Ground(50, 500),
            new Ground(50 + (16 * 5), 500),
            new Ground(50 + (16 * 5) * 2, 500),
            new Ground(50 + (16 * 5) * 3, 500)
        ];
    }

}

new MainGame();
