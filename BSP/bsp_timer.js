/**
 * BSP (Board/Browser Support Package) Katmanı
 * bsp_timer.js - RAF Ticker ve Hassas Zamanlayıcı
 */

export class BSPTimer {
    constructor() {
        this.isRunning = false;
        this.lastTime = 0;
        this.elapsed = 0;
        this.speed = 1.0;
        this.callbacks = new Set();
        this._rafId = null;
        this._loop = this._loop.bind(this);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this._rafId = requestAnimationFrame(this._loop);
    }

    stop() {
        this.isRunning = false;
        if (this._rafId) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
    }

    setSpeed(speedMultiplier) {
        this.speed = Math.max(0.1, Math.min(5.0, speedMultiplier));
    }

    onTick(callback) {
        this.callbacks.add(callback);
        return () => this.callbacks.delete(callback);
    }

    _loop(currentTime) {
        if (!this.isRunning) return;

        const rawDelta = (currentTime - this.lastTime) / 1000;
        const delta = Math.min(rawDelta, 0.1) * this.speed; // Cap delta to avoid jumps
        this.lastTime = currentTime;
        this.elapsed += delta;

        for (const cb of this.callbacks) {
            cb(delta, this.elapsed);
        }

        this._rafId = requestAnimationFrame(this._loop);
    }
}
