import {GameConfigurable} from "./game-helpers";
import {ExtendedSprite} from "./sprite-extension";
import Phaser from "phaser";

function rgbToHex(r, g, b) {
    return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function confText(text) {
    text.stroke = "#000000";
    text.strokeThickness = 6;
    text.fill = "#43d637";
    return text;
}

export class HUD extends GameConfigurable {

    configure(game) {
        this.game = game;
        this.hudGroup = game.add.group();
        this.hudGroup.fixedToCamera = true;
        this.spell1 = new SpellIcon("human1", 900 - 32 - 4, 600 + 2, this.hudGroup);
        this.spell2 = new SpellIcon("human2", 900 + 1, 600 + 2, this.hudGroup);
        this.spell1.configure(game);
        this.spell2.configure(game);
    }

    bind(player) {
        this.game.world.bringToTop(this.hudGroup);
        this.hudGroup.add(confText(new Phaser.Text(this.game, 900 - 32, 600, "X")));
        this.hudGroup.add(confText(new Phaser.Text(this.game, 900 + 5, 600, "C")));
        const drawRect = produceDrawRectangle(this.game, 0, this.game.height - 60, this.game.width, 60, 0, 0.3);
        this.hudGroup.add(drawRect);
        const bar = player.healthBar;
        this.hudGroup.add(bar.healthbar);
        bar.width *= 10;
        bar.height *= 1.5;
        const barY = this.game.height - bar.height;
        bar.healthbar.position.setTo(10, barY);
        const barText = confText(new Phaser.Text(this.game, 10 + bar.width + 10, barY - bar.height * 2, ""));
        this.hudGroup.add(barText);
        bar.text = barText;
        this.reloadSpells(player.currentElemental.elementalName);
    }

    reloadSpells(name) {
        this.spell1.sprite.loadTexture(name + "1");
        this.spell2.sprite.loadTexture(name + "2");
    }

}

function produceDrawRectangle(game, x, y, width, height, color, alpha = 1) {
    const g = game.add.graphics(x, y);
    g.beginFill(color, alpha);
    g.drawRect(0, 0, width, height);
    g.endFill();
    return g;
}

export class SpellIcon extends ExtendedSprite {

    constructor(image, x, y, group) {
        super(image, x, y, group);
    }

    configure(game) {
        super.configure(game);
        this.sprite.scale.setTo(2);
    }

}

const HEALTH_BAR_HEIGHT = 10;
const HEALTH_BAR_WIDTH = 30;

export class HealthBar extends GameConfigurable {

    constructor(maxHealth, width = HEALTH_BAR_WIDTH, height = HEALTH_BAR_HEIGHT, useEntityPos = true) {
        super();
        this.lastHealth = 0;
        this.health = this.maxHealth = maxHealth;
        this.useEntityPos = useEntityPos;
        this.width = width;
        this.height = height;
        this.text = undefined;
    }

    configure(game) {
        this.healthbar = game.add.graphics(0, 0);
    }

    get scale() {
        return this.healthbar.scale;
    }

    update(entity) {
        const graphics = this.healthbar;
        if (this.useEntityPos) {
            let sprite = entity.sprite;
            graphics.position.setTo(sprite.position.x - this.width / 2, sprite.position.y - (sprite.height));
        }
        this.health = entity.health;
        if (this.lastHealth !== this.health) {
            if (this.text !== undefined) {
                this.text.setText(`${this.health.toFixed(2)}/${this.maxHealth.toFixed(2)}`);
            }
            graphics.clear();
            let health = (this.health / this.maxHealth) * 100;
            var colour =
                rgbToHex((health > 50 ? 1 - 2 * (health - 50) / 100.0 : 1.0) * 255, (health > 50 ? 1.0 : 2 * health / 100.0) * 255, 0);
            graphics.beginFill(0, 1);
            graphics.lineStyle(this.height, 0, 1);
            graphics.moveTo(0, -this.height);
            graphics.lineTo(this.width, -this.height);
            graphics.endFill();
            graphics.beginFill(colour, 1);
            graphics.lineStyle(this.height, colour, 1);
            graphics.moveTo(0, -this.height);
            graphics.lineTo((health / this.maxHealth) * this.width, -this.height);
            graphics.endFill();
        }
        this.lastHealth = this.health;
    }

}
