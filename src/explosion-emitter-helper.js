export class ExplosionEmitterHelper {
    configure(game) {
        this.gameRef = game;
        this.emitters = {};
    }

    emit(name, x, y, lifetime, numParticles) {
        let emitter = this.emitters[name];
        if (emitter === undefined) {
            emitter = this.emitters[name] = this.gameRef.add.emitter(0, 0, numParticles * (lifetime / 10));
            emitter.gravity = 300;
            emitter.makeParticles(name);
        }
        emitter.x = x;
        emitter.y = y;
        emitter.start(true, lifetime, null, numParticles);
    }
}