import Phaser from "phaser";

/**
 * A basic game container. Extend this for your actual game.
 */
export class Game {

    constructor(width, height, antialias = false) {
        this.allSprites = [];
        this.phaserGame = new Phaser.Game(width, height, Phaser.AUTO, "", {
            preload: () => this.preload(),
            create: () => this.create(),
            update: () => this.update(),
            render: () => this.render()
        }, antialias, antialias);
        this.phaserGame.promethium = this;
    }

    getImages() {
        return [];
    }

    getPreLoadConfigurables() {
        return [];
    }

    getConfigurables() {
        return [];
    }

    preload() {
        // 1337 H4CK5
        var request = new XMLHttpRequest();
        request.open("GET", "config/baseurl.txt", false);
        request.send(null);

        if (request.status === 200) {
            this.phaserGame.load.baseURL = request.responseText;
        }
        let configurables = this.getPreLoadConfigurables();
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

    msprite(cb) {
        this.allSprites.forEach(s => {
            if (!s.sprite.alive) {
                return;
            }
            cb(s);
        });
    }

    update() {
        this.msprite(s => s.update());
    }

    render() {
        this.msprite(s => s.render());
    }

}
