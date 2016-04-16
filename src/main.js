import {Game, Resource, GameConfigurable} from "./game";
import {platformGroup, Ground} from "./sprites/platforms";
import {Sprite} from "./sprite-wrapper";

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
        platformGroup[0] = (function createPlatformGroup() {
            let platforms = game.add.group();
            platforms.enableBody = true;
            return platforms;
        })();
        return [
            new Ground(50, 50),
            new Ground(50 + (16 * 5), 50),
            new Ground(50 + (16 * 5) * 2, 50),
            new Ground(50 + (16 * 5) * 3, 50)
        ];
    }

}

new MainGame();
