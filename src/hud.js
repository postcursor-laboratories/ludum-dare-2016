import {Sprite} from "./sprite-wrapper";
import {GameConfigurable} from "./game-helpers";

export class HUD extends GameConfigurable {

    configure(game) {
        this.game = game;
        this.hudGroup = game.add.group();
        this.hudGroup.fixedToCamera = true;
    }

}

class HealthBar extends Sprite {
    
    
    
}
