
export class Resource {

    constructor(name, location) {
        this.name = name;
        this.location = location;
    }

    getName() {
        return this.name;
    }

    getLocation() {
        return this.location;
    }

}

export class GameConfigurable {

    static of(f) {
        let ret = new GameConfigurable();
        ret.configure = f;
        return ret;
    }

    configure(game) {
    }

}
