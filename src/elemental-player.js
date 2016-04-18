import {nullFn} from "./utils/nulls";

const NULL_SPELL = {
    castSpell: nullFn
}

export class ElementalPlayerDescriptor {

    constructor(game, elementalName, unitWidth, unitHeight, jumpSpeed, moveSpeed, attackSpeed, spritesheetWidth, animationLengths, damageReductionFactor, attackDamage, spellOne, spellTwo) {
        this.elementalName = elementalName;
        this.jumpSpeed = jumpSpeed;
        this.moveSpeed = moveSpeed;
        this.attackSpeed = attackSpeed;
        this.spritesheetWidth = spritesheetWidth;
        this.animationLengths = animationLengths;
        this.damageReductionFactor = damageReductionFactor;
        this.attackDamage = attackDamage;
        this.spellOne = spellOne || NULL_SPELL;
        this.spellTwo = spellTwo || NULL_SPELL;
        game.load.spritesheet(elementalName, "img/elementals/" + elementalName + ".png", unitWidth, unitHeight);
    }
}
