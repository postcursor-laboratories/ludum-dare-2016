

const ALL_STAGES = new Map();

/**
 * Stage Abstract Base Class. Lays out expected functions for each Stage.
 */
export class Stage {

    constructor(name) {
        this.name = name;
        ALL_STAGES.set(name, this);
    }

    preload() {
    }

    create() {
    }

    update() {
    }

}

export function loadAllStages(game) {
    ALL_STAGES.forEach((v, k) => {
        game.state.add(k, v);
    });
}
