import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {MeleeEnemy} from "./melee-enemy";
import {TileMap} from "./tilemap";
import {globals} from "./globals";
import {ElementalPlayerDescriptor} from "./elemental-player";
import {ExplosionEmitterHelper} from "./explosion-emitter-helper";
import * as EarthSpells from "./spells/earth-spells";
import * as WaterSpells from "./spells/water-spells";
import * as FireSpells from "./spells/fire-spells";

class MainGame extends Game {

    constructor() {
        super(960, 640);
        this.tileMap = new TileMap(new Resource("triangle", "tilemaps/triangle.json"));
        globals.tileMap = this.tileMap;
        this._playerRef = null;
    }

    getImages() {
        return [new Resource("ground", "img/StoneFloorSmooth.png"),
            new Resource("rockProjectile", "img/rockProjectile.png"),
            new Resource("rockParticle", "img/rockParticle.png"),
            new Resource("magicParticle", "img/magicParticle.png"),
            new Resource("waterParticle", "img/waterParticle.png"),
            new Resource("fireballProjectile", "img/fireballProjectile.png"),
            new Resource("fireballParticle", "img/fireballParticle.png"),
			new Resource("heatwaveProjectile", "img/heatwaveProjectile.png")];
			
    }

    getPreLoadConfigurables() {
        this.ezEmit = new ExplosionEmitterHelper();
        return [
            GameConfigurable.of(game => {
                this.elementalPlayers = [
                    new ElementalPlayerDescriptor(game, "human", 32, 32, 400, 300, 5, 4, [4, 2, 4, 1], 0),
                    new ElementalPlayerDescriptor(game, "earth", 32, 32, 200, 100, 3, 4, [4, 2, 4, 1], 0.6, new EarthSpells.RockThrowSpell(), new EarthSpells.FissureSpell()),
                    new ElementalPlayerDescriptor(game, "water", 32, 32, 300, 200, 6, 4, [4, 4, 4, 2], 0.2, new WaterSpells.SurfSpell(), new WaterSpells.FrostbiteSpell()),
                    new ElementalPlayerDescriptor(game, "fire", 32, 32, 350, 300, 6, 4, [4, 4, 4, 4], 0.3, new FireSpells.FireballSpell(), new FireSpells.HeatwaveSpell()),
                    new ElementalPlayerDescriptor(game, "air", 32, 32, 400, 400, 4, 4, [4, 4, 4, 4], 0.4)
                ];
            }),
            GameConfigurable.of(game =>
                game.load.spritesheet("transformation", "img/transform.png", 48, 48)),
            GameConfigurable.of(game =>
                game.load.spritesheet("robot-melee", "img/robots/melee.png", 32, 32)),
            this.ezEmit,
            this.tileMap
        ];
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
        game.physics.arcade.gravity.y = 300;
        game.stage.smoothed = false;
        game.stage.backgroundColor = 0x694400;
        return [
            this._playerRef = new Player(this.elementalPlayers, 100, 1400, 0),
            new MeleeEnemy(400, 1400)
        ];
    }

    getPlayer() {
        if (this._playerRef)
            return this._playerRef;
        throw "Player is falsy!";
    }

}

export const mainGame = new MainGame();
