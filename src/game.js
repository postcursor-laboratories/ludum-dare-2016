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
        this.getConfigurables().forEach(ele => {
            ele.configure(this.phaserGame);
        });
    }

    update() {
    }

}
