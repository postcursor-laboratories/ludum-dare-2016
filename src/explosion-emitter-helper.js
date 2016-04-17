

export class ExplosionEmitterHelper {
    configure(game) {
        this.gameRef = game;
        this.emitters = {};
    }

    emit(name, x, y, lifetime, numParticles) {
        if (!this.emitters[name]) {
            this.emitters[name] = this.gameRef.add.emitter(0, 0, 100)
            this.emitters[name].gravity = 300;
        }
        let emitter = this.emitters[name];
        emitter.makeParticles(name);
        emitter.x = x;
        emitter.y = y;
        emitter.start(true, lifetime, null, numParticles);
    }
}