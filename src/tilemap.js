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

export class TileMap extends GameConfigurable {

    configure(game) {
        game.load.tilemap("test", "tilemaps/tilemap_test.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("tilesTileSet", "sprites/tiles.png");
    }

    getNormalConfigurable() {
        return GameConfigurable.of(game => {
            let map = game.add.tilemap("test");
            map.addTilesetImage("tiles", "tilesTileSet");
            let layer = map.createLayer("ground");
            layer.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
            layer.setScale(2, 2);
            map.setCollision(1, true, layer);
            layer.resizeWorld();
            layer.debug = false;
            globals.collisionLayer = layer;
        });
    }

}
