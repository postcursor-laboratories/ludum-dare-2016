import Phaser from "phaser";

/**
 * This callback type is called `collisionCallback`. It is for {@link collideBox}.
 *
 * @callback collisionCallback
 * @param {Phaser.Sprite} sprite
 */
// yes, JSDoc is weird.
/**
 * Runs a collision on a group.
 *
 * @param x {Number} The X coord, in the center
 * @param y {Number} The Y coord, in the center
 * @param width {Number} The width of the box
 * @param height {Number} The height of the box
 * @param group {Phaser.Group} The group to check in
 * @param callback {collisionCallback} Callback for each collided sprite
 */
export function collideBox(x, y, width, height, group, callback) {
    const collideRect = new Phaser.Rectangle(x - width / 2, y - height / 2, width, height);
    group.forEachAlive(sprite => {
        if (sprite.body) {
            let /*the*/ body /*hit the floor*/ = sprite.body;
            let otherRect = new Phaser.Rectangle(body.x, body.y, body.width, body.height);
            if (collideRect.intersects(otherRect)) {
                callback(sprite);
            }
        }
    }, this);
}
