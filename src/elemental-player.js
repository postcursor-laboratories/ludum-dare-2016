import {GameConfigurable} from "./game-helpers";

export const HUMAN = "human";
export const EARTH = "earth";
export const WATER = "water";
export const FIRE = "fire";
export const AIR = "air";
export const ELEMENTAL_NAMES = [HUMAN, EARTH, WATER, FIRE, AIR];

const NULL_SPELL = {
    castSpell: () => {
    }
};
const EPD_ARGS = [
    "elementalName",
    "unitWidth",
    "unitHeight",
    "jumpSpeed",
    "moveSpeed",
    "attackSpeed",
    "spriteSheetWidth",
    "animationLengths",
    "damageReductionFactor",
    "attackDamage",
    "spellOne",
    "spellTwo"
];
const UNDEFINED_ALLOWED = [
    // None yet. For future use.
];

export class ElementalPlayerDescriptor extends GameConfigurable {

    static fromObject(object) {
        const args = [];
        for (let name of EPD_ARGS) {
            const arg = object[name];
            if (arg === undefined && UNDEFINED_ALLOWED.indexOf(name) < 0) {
                console.warn(`Undefined argument ${name} may cause problems.`);
            }
            args.push(arg);
        }
        return new ElementalPlayerDescriptor(...args);
    }

    constructor(elementalName, unitWidth, unitHeight, jumpSpeed, moveSpeed, attackSpeed, spriteSheetWidth, animationLengths, damageReductionFactor, attackDamage, spellOne = NULL_SPELL, spellTwo = NULL_SPELL) {
        super();
        this.elementalName = elementalName;
        this.unitWidth = unitWidth;
        this.unitHeight = unitHeight;
        this.jumpSpeed = jumpSpeed;
        this.moveSpeed = moveSpeed;
        this.attackSpeed = attackSpeed;
        this.spriteSheetWidth = spriteSheetWidth;
        // clone animationLengths for security
        this.animationLengths = animationLengths.slice();
        this.damageReductionFactor = damageReductionFactor;
        this.attackDamage = attackDamage;
        this.spellOne = spellOne;
        this.spellTwo = spellTwo;
        for (let name of Object.keys(this)) {
            if (EPD_ARGS.indexOf(name) < 0) {
                throw `un-traced parameter ${name}`;
            }
        }
    }

    configure(game) {
        game.load.spritesheet(this.elementalName, "img/elementals/" + this.elementalName + ".png", this.unitWidth, this.unitHeight);
    }

}
