/**
 * Midd (Middleware) Katmanı
 * midd_anim_engine.js - İnterpolasyon, Easing ve Matematiksel Animasyon Motoru
 */

export class MiddAnimEngine {
    static clamp(value, min = 0, max = 1) {
        return Math.max(min, Math.min(max, value));
    }

    static lerp(start, end, t) {
        return start + (end - start) * t;
    }

    // Cubic-bezier approximation for standard cubic bezier curves
    static easeOutCubic(t) {
        const p = this.clamp(t);
        return 1 - Math.pow(1 - p, 3);
    }

    static easeInOutCubic(t) {
        const p = this.clamp(t);
        return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    }

    static easeOutExpo(t) {
        const p = this.clamp(t);
        return p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    }

    static easeInOutExpo(t) {
        const p = this.clamp(t);
        return p === 0 ? 0 : p === 1 ? 1 : p < 0.5 
            ? Math.pow(2, 20 * p - 10) / 2 
            : (2 - Math.pow(2, -20 * p + 10)) / 2;
    }

    // Spring overshoot easing that matches the smooth fluid bounce in the reference video
    static easeOutBack(t, overshoot = 1.35) {
        const p = this.clamp(t);
        const c1 = overshoot;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
    }

    static easeInOutBack(t, overshoot = 1.25) {
        const p = this.clamp(t);
        const c1 = overshoot;
        const c2 = c1 * 1.525;
        return p < 0.5
            ? (Math.pow(2 * p, 2) * ((c2 + 1) * 2 * p - c2)) / 2
            : (Math.pow(2 * p - 2, 2) * ((c2 + 1) * (p * 2 - 2) + c2) + 2) / 2;
    }

    // Normalizes sub-ranges within [0, 1] timeline
    static subProgress(progress, start, end) {
        if (progress <= start) return 0;
        if (progress >= end) return 1;
        return (progress - start) / (end - start);
    }
}
