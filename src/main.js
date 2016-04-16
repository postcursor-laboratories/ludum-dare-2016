import {Game, Resource} from "./game";
import {Sprite} from "./sprite-wrapper";

class MainGame extends Game {


    getImages() {
        return [new Resource("tmp", "img/tmp.jpg")];
    }

    getConfigurables() {
        return [new Sprite("tmp", 200, 200)];
    }

}

new MainGame();
