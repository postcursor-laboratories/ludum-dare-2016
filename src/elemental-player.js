export class ElementalPlayerDescriptor {

    constructor(game, elementalName, unitWidth, unitHeight, jumpSpeed, moveSpeed, attackSpeed) {
        this.elementalName = elementalName;
        this.jumpSpeed = jumpSpeed;
        this.moveSpeed = moveSpeed;
        this.attackSpeed = attackSpeed;
        game.load.spritesheet(elementalName, "img/elementals/" + elementalName + ".png", unitWidth, unitHeight);
    }
}