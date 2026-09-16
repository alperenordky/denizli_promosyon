/**
 * BSP (Board/Browser Support Package) Katmanı
 * bsp_display.js - Ekran, Çözünürlük ve Boyutlandırma Alt Yapısı
 */

export class BSPDisplay {
    constructor() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = window.devicePixelRatio || 1;
        this.isMobile = this.width < 768;
        this.listeners = new Set();

        this._initListeners();
    }

    _initListeners() {
        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.dpr = window.devicePixelRatio || 1;
            this.isMobile = this.width < 768;
            this._notify();
        });
    }

    onResize(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    _notify() {
        for (const cb of this.listeners) {
            cb({
                width: this.width,
                height: this.height,
                dpr: this.dpr,
                isMobile: this.isMobile
            });
        }
    }

    getBounds(element) {
        if (!element) return { left: 0, top: 0, width: 0, height: 0, x: 0, y: 0 };
        return element.getBoundingClientRect();
    }

    setCSSVariable(name, value, element = document.documentElement) {
        element.style.setProperty(name, value);
    }
}
