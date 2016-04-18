export class ElementalPlayerDescriptor {

    constructor(game, elementalName, unitWidth, unitHeight, jumpSpeed, moveSpeed, attackSpeed, spritesheetWidth, animationLengths, spellOne, spellTwo) {
        this.elementalName = elementalName;
        this.jumpSpeed = jumpSpeed;
        this.moveSpeed = moveSpeed;
        this.attackSpeed = attackSpeed;
        this.spritesheetWidth = spritesheetWidth;
        this.animationLengths = animationLengths;
        this.spellOne = new spellOne();
        this.spellTwo = spellTwo;
        game.load.spritesheet(elementalName, "img/elementals/" + elementalName + ".png", unitWidth, unitHeight);
    }
}