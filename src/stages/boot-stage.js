import {Stage} from "./stage-abc";
import {ELEMENTAL_NAMES, ElementalPlayerDescriptor} from "../elemental-player";
import "../spells/air-spells";
import "../spells/earth-spells";
import "../spells/fire-spells";
import "../spells/water-spells";
import {spellMap as SPELLS} from "../spells/spell";
import {BOOT as NAME, INIT as nextStage} from "./stage-names";

export const elementalPlayers = new Map();

function jsonKey(name) {
    return `${name}EPDJson`;
}

function mapUndefinedToNull(arg) {
    return arg === undefined ? null : arg;
}

function translateJson(name, json) {
    // N.B json should already be a clone
    // The only properties that need translating are spells
    json.spellOne = mapUndefinedToNull(SPELLS.get(json.spellOne));
    json.spellTwo = mapUndefinedToNull(SPELLS.get(json.spellTwo));
    // set the name
    json.elementalName = name;
    return json;
}

/**
 * Responsible for loading some JSON and text resources.
 * These resources should be loaded via Phaser, but they also specify images
 * and other objects we would like to load through Phaser as well.
 * So we load JSON/text here and images in InitStage.
 */
class BootStage extends Stage {

    constructor() {
        super(NAME);
    }

    preload() {
        ELEMENTAL_NAMES.forEach(name => {
            this.load.json(jsonKey(name), `elementals/${name}.json`);
        });
    }

    create() {
        ELEMENTAL_NAMES.forEach(name => {
            const json = this.cache.getJSON(jsonKey(name), true);
            if (!json) {
                // eh
                console.warn(`JSON not found for ${name}, skipping it.`);
                return;
            }
            const obj = translateJson(name, json);
            elementalPlayers.set(name, ElementalPlayerDescriptor.fromObject(obj));
        });
        // transfer to init-stage
        this.state.start(nextStage);
    }

}
new BootStage();
