export class ExplosionEmitterHelper {
    configure(game) {
        this.gameRef = game;
        this.emitters = {};
    }

    emit(name, x, y, lifetime, numParticles, xSpeedMin, xSpeedMax, ySpeedMin, ySpeedMax, gravity) {
        let emitter = this.emitters[name];
        if (emitter === undefined) {
            emitter = this.emitters[name] = this.gameRef.add.emitter(0, 0, numParticles * (lifetime / 10));
            emitter.gravity = 300;
            emitter.makeParticles(name);
        }
        if (gravity !== undefined) {
            emitter.gravity = gravity;
        }
        if ((xSpeedMin !== undefined) && (xSpeedMax !== undefined)) {
            emitter.setXSpeed(xSpeedMin, xSpeedMax);
        }
        if ((ySpeedMin !== undefined) && (ySpeedMax !== undefined)) {
            emitter.setYSpeed(ySpeedMin, ySpeedMax);
        }
        emitter.x = x;
        emitter.y = y;
        emitter.start(true, lifetime, null, numParticles);
    }
}