import {GameConfigurable} from "./game-helpers";

function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export class HUD extends GameConfigurable {

    configure(game) {
        this.game = game;
        this.hudGroup = game.add.group();
        this.hudGroup.fixedToCamera = true;
    }

}

export class HealthBar extends GameConfigurable {

    constructor(maxHealth, width = 30, useEntityPos = true) {
        super();
        this.lastHealth = 0;
        this.health = this.maxHealth = maxHealth;
        this.useEntityPos = useEntityPos;
        this.width = width;
    }

    configure(game) {
        this.healthbar = game.add.graphics(0, 0);
    }

    update(entity) {
        if (this.useEntityPos) {
            let sprite = entity.sprite;
            this.healthbar.position.setTo(sprite.position.x - this.width / 2, sprite.position.y - (sprite.height));
        }
        this.health = entity.health;
        if (this.lastHealth !== this.health) {
            this.healthbar.clear();
            let health = (this.health / this.maxHealth) * 100;
            var colour =
                rgbToHex((health > 50 ? 1 - 2 * (health - 50) / 100.0 : 1.0) * 255, (health > 50 ? 1.0 : 2 * health / 100.0) * 255, 0);
            this.healthbar.beginFill(colour, 1);
            this.healthbar.lineStyle(5, colour, 1);
            this.healthbar.moveTo(0, -5);
            this.healthbar.lineTo((health / 100) * this.width, -5);
            this.healthbar.endFill();
        }
        this.lastHealth = this.health;
    }

}
