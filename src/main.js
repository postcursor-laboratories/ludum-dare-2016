import {Resource, GameConfigurable} from "./game-helpers";
import {Game} from "./game";
import {setupPlatformGroup} from "./sprites/platforms";
import Phaser from "phaser";
import {Player} from "./player";
import {MeleeEnemy} from "./melee-enemy";
import {RangedEnemy} from "./ranged-enemy";
import {TileMap} from "./tilemap";
import {globals} from "./globals";
import {ElementalPlayerDescriptor} from "./elemental-player";
import {ExplosionEmitterHelper} from "./explosion-emitter-helper";
import {HUD} from "./hud";
import * as EarthSpells from "./spells/earth-spells";
import * as WaterSpells from "./spells/water-spells";
import * as FireSpells from "./spells/fire-spells";
import * as AirSpells from "./spells/air-spells";

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
        return [
            GameConfigurable.of(game => {
                this.elementalPlayers = [
                    new ElementalPlayerDescriptor(game, "human", 32, 32, 400, 300, 10, 4, [4, 2, 4, 1], 0, 5),
                    new ElementalPlayerDescriptor(game, "earth", 32, 32, 200, 100, 3, 4, [4, 2, 4, 1], 0.6, 20, new EarthSpells.RockThrowSpell(), new EarthSpells.FissureSpell()),
                    new ElementalPlayerDescriptor(game, "water", 32, 32, 300, 200, 6, 4, [4, 4, 4, 2], 0.2, 10, new WaterSpells.SurfSpell(), new WaterSpells.FrostbiteSpell()),
                    new ElementalPlayerDescriptor(game, "fire", 32, 32, 350, 300, 6, 4, [4, 4, 4, 4], 0.3, 10, new FireSpells.FireballSpell(), new FireSpells.HeatwaveSpell()),
                    new ElementalPlayerDescriptor(game, "air", 32, 32, 400, 400, 8, 4, [4, 4, 4, 4], 0.4, 2, new AirSpells.GustSpell(), new AirSpells.LightningSpell())
                ];
            }),
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
        this._playerRef = new Player(this.elementalPlayers, 100, game.height - 150, 0);
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
        
        for (var i = 2; i < 12; i++)
        {
            things.push(new MeleeEnemy(400*i, 2048-160));
            things.push(new RangedEnemy(400*i + 50, 2048-160));
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
