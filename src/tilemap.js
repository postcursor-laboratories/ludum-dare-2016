import {GameConfigurable} from "./game-helpers";
import Phaser from "phaser";

export class TileMap extends GameConfigurable {


    configure(game) {
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

        // load the tiled map, notice it is "tiledmap" and not "tilemap"
        game.load.tiledmap(cacheKey("map", "tiledmap"), "tilemaps/tilemap_test.tmx", null, Phaser.Tilemap.TILED_XML);

        // load the images for your tilesets, make sure the last param to "cacheKey" is
        // the name of the tileset in your map so the plugin can find it later
        game.load.image(cacheKey("map", "tileset", "Stone"), "img/StoneFloorSmooth.png");
    }

}
