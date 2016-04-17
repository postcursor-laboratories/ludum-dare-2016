import {GameConfigurable} from "./game-helpers";
import {globals} from "./globals";
import Phaser from "phaser";
import PIXI from "pixi";

// TODO add regenerator runtime for generators and make this one
function tileLoopGen(map, layer, cb) {
    for (let x = 0; x < layer.width; x++) {
        for (let y = 0; y < layer.height; y++) {
            var tile = map.getTile(x, y, layer);
            if (tile) {
                cb(tile);
            }
        }
    }
}

function dumpTiles(map, layer) {
    tileLoopGen(map, layer, tile => {
        console.log(tile);
    });
}

/**
 *
 * @param map {Phaser.Tilemap} Map data
 * @param layers {Array.<Phaser.TilemapLayer>} Layer data
 * @param tileSets {Array.<string>} Name of tile sets
 */
function applyCollision(map, layers, tileSets) {
    map.tilesets.forEach(tset => {
        if (tileSets.indexOf(tset.name) >= 0) {
            for (let i = 0; i < tset.total; i++) {
                let props = tset.tileProperties[i] || {collide: false};
                if (props.collide) {
                    const gid = tset.firstgid + i;
                    layers.forEach(layer => map.setCollision(gid, true, layer));
                }
            }
        }
    });
}

export class TileMap extends GameConfigurable {

    /**
     * @param jsonSource {Resource} JSON file to load from, as a Resource. Don't load this yourself
     * @param layers {Array.<string>} Layers to load.
     * @param tileSets {Array.<string>} Tile sets to add. They will be loaded from {@code `sprites/${name}.png`
     * @param checkCollideTileSets {Array.<string>} Check collision for these tile sets
     * @param checkCollideLayers {Array.<string>} Check collision for the tile sets on these layers
     */
    constructor(jsonSource, tileSets = ["tiles"], layers = ["ground"], checkCollideTileSets = ["tiles"], checkCollideLayers = ["ground"]) {
        super();
        this.jsonSource = jsonSource;
        this.checkCollideTileSets = checkCollideTileSets;
        this.checkCollideLayers = checkCollideLayers;
        this.tileSets = tileSets.map(name => {
            return {
                name: name,
                tsetName: `${name}TileSet`,
                spriteLocation: `sprites/${name}.png`
            };
        });
        this.layers = layers;
    }

    configure(game) {
        game.load.tilemap(this.jsonSource.getName(), this.jsonSource.getLocation(), null, Phaser.Tilemap.TILED_JSON);
        this.tileSets.forEach(tset => game.load.image(tset.tsetName, tset.spriteLocation));
    }

    getNormalConfigurable() {
        return GameConfigurable.of(game => {
            let map = game.add.tilemap(this.jsonSource.getName());
            this.tileSets.forEach(tset => map.addTilesetImage(tset.name, tset.tsetName));
            let largestLayer = undefined;
            let collisionLayers = [];
            this.layers.forEach(layerName => {
                const isCollisionLayer = this.checkCollideLayers.indexOf(layerName) >= 0;
                let layer = map.createLayer(layerName);
                layer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
                layer.setScale(2, 2);
                if (isCollisionLayer) {
                    collisionLayers.push(layer);
                }
                if (largestLayer === undefined || (layer.width > largestLayer.width || layer.height > largestLayer.height)) {
                    largestLayer = layer;
                }
            });
            if (!largestLayer) {
                throw "no layers";
            }
            largestLayer.resizeWorld();
            applyCollision(map, collisionLayers, this.checkCollideTileSets);
            globals.collisionLayers = collisionLayers;
        });
    }

}
