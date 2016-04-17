

export class ElementalPlayerDescriptor {

    constructor(game, elementalName, unitWidth, unitHeight, jumpSpeed, moveSpeed) {
        this.elementalName = elementalName;
        // this.spritesheetName = spritesheetPath;
        this.jumpSpeed = jumpSpeed;
        this.moveSpeed = moveSpeed;
        game.load.spritesheet(elementalName, "img/elementals" + elementalName + ".png", unitWidth, unitHeight);
    }
}