import {Stage} from "./stage-abc";
import {INIT as NAME, PLAY as nextStage} from "./stage-names";

// TODO move most of main.js and game.js loading into this stage

export class InitStage extends Stage {

    constructor() {
        super(NAME);
    }

    preload() {
    }

    create() {
        // transfer to play-stage
        this.state.start(nextStage);
    }

}
new InitStage();
