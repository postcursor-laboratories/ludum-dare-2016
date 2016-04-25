// Entry point: initialize babel-polyfill
import "babel-polyfill";
import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {MeleeEnemy} from "./melee-enemy";
import {RangedEnemy} from "./ranged-enemy";
import {TileMap} from "./tilemap";
import {globals} from "./globals";
import {ExplosionEmitterHelper} from "./explosion-emitter-helper";
import {HUD} from "./hud";
import {elementalPlayers} from "./stages/boot-stage";

class MainGame extends Game {

    constructor() {
        super(960, 640);
        this.tileMap = new TileMap(new Resource("triangle", "tilemaps/triangle.json"));
        globals.tileMap = this.tileMap;
        this._playerRef = null;
    }

    getImages() {
        const arr = [new Resource("ground", "img/StoneFloorSmooth.png"),
            new Resource("rockProjectile", "img/rockProjectile.png"),
            new Resource("rockParticle", "img/rockParticle.png"),
            new Resource("magicParticle", "img/magicParticle.png"),
            new Resource("waterParticle", "img/waterParticle.png"),
            new Resource("fireballProjectile", "img/fireballProjectile.png"),
            new Resource("fireballParticle", "img/fireballParticle.png"),
            new Resource("heatwaveProjectile", "img/heatwaveProjectile.png"),
            new Resource("bullet", "img/bullet.png")];
        ["Air", "Fire", "Human", "Earth", "Water"].forEach(name => {
            for (let i = 1; i <= 2; i++) {
                arr.push(new Resource(name.toLowerCase() + i, `icon/${name}${i}.png`));
            }
        });
        return arr;
    }

    getPreLoadConfigurables() {
        this.ezEmit = new ExplosionEmitterHelper();
        const ret = [
            GameConfigurable.of(game =>
                game.load.spritesheet("transformation", "img/transform.png", 48, 48)),
            GameConfigurable.of(game =>
                game.load.spritesheet("robot-melee", "img/robots/melee.png", 32, 32)),
            GameConfigurable.of(game =>
                game.load.spritesheet("robot-ranged", "img/robots/ranged.png", 32, 32)),
            GameConfigurable.of(game =>
                game.load.spritesheet("frostbite", "img/frostbite.png", 32, 16)),
            this.ezEmit,
            this.tileMap
        ];
        for (let value of elementalPlayers.values()) {
            ret.push(value);
        }
        return ret;
    }

    getConfigurables() {
        return [
            GameConfigurable.of(game => this.configure(game)),
            this.tileMap.getNormalConfigurable()
        ];
    }

    configure(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        setupPlatformGroup(game);
        globals.enemyGroup = game.add.group();
        globals.player = game.add.group();
        this._playerRef = new Player(100, game.height - 150);
        this._playerRef.configure(game);
        globals.player.add(this._playerRef.sprite);
        globals.bulletsGroup = game.add.group();
        game.physics.arcade.gravity.y = 300;
        game.stage.smoothed = false;
        game.stage.backgroundColor = 0x694400;

        let things = [
            this.hud = new HUD(),
            GameConfigurable.of(game => this.hud.bind(this._playerRef))
        ];

        for (var i = 2; i < 12; i++) {
            things.push(new MeleeEnemy(400 * i, 2048 - 160));
            things.push(new RangedEnemy(400 * i + 50, 2048 - 160));
        }
        return things;
    }

    getPlayer() {
        if (this._playerRef)
            return this._playerRef;
        throw "Player is falsy!";
    }

}

export const mainGame = new MainGame();
