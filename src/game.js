import Phaser from "phaser";

export class Resource {

    constructor(name, location) {
        this.name = name;
        this.location = location;
    }

    getName() {
        return this.name;
    }

    getLocation() {
        return this.location;
    }

}

export class GameConfigurable {

    static of(f) {
        let ret = new GameConfigurable();
        ret.configure = f;
        return ret;
    }

    configure(game) {
    }

}

/**
 * A basic game container. Extend this for your actual game.
 */
export class Game {

    constructor(width, height, antialias = true) {
        this.phaserGame = new Phaser.Game(width, height, Phaser.AUTO, "", {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update()
        });
    }

    getImages() {
        return [];
    }

    getConfigurables() {
        return [];
    }

    preload() {
        this.getImages().forEach(ele => {
            this.phaserGame.load.image(ele.getName(), ele.getLocation());
        });
    }

    create() {
        let configurables = this.getConfigurables();
        let nextConfigs = [];
        while (configurables.length > 0) {
            configurables.forEach(ele => {
                let extraConfigs = ele.configure(this.phaserGame);
                if (extraConfigs) {
                    Array.prototype.push.apply(nextConfigs, extraConfigs);
                }
            });
            configurables = nextConfigs;
            nextConfigs = [];
        }
    }

    update() {
    }

}
