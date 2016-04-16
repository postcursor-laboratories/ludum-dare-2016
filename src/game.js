import Phaser from "phaser";

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
        this.phaserGame.world.forEach(s => s.update(), this);
    }

}
