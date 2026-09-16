/**
 * BSP (Board/Browser Support Package) Katmanı
 * bsp_input.js - Fare, Dokunmatik ve Etkileşim Yöneticisi
 */

export class BSPInput {
    constructor(targetElement = window) {
        this.target = targetElement;
        this.pointer = { x: 0, y: 0, normX: 0, normY: 0, isDown: false };
        this.callbacks = {
            move: new Set(),
            down: new Set(),
            up: new Set(),
            wheel: new Set(),
            click: new Set()
        };

        this._initListeners();
    }

    _initListeners() {
        const handleMove = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            this.pointer.x = clientX;
            this.pointer.y = clientY;
            this.pointer.normX = (clientX / window.innerWidth) * 2 - 1;
            this.pointer.normY = -(clientY / window.innerHeight) * 2 + 1;

            this._notify('move', this.pointer, e);
        };

        const handleDown = (e) => {
            this.pointer.isDown = true;
            this._notify('down', this.pointer, e);
        };

        const handleUp = (e) => {
            this.pointer.isDown = false;
            this._notify('up', this.pointer, e);
        };

        const handleWheel = (e) => {
            this._notify('wheel', { deltaY: e.deltaY, deltaX: e.deltaX }, e);
        };

        const handleClick = (e) => {
            this._notify('click', this.pointer, e);
        };

        window.addEventListener('mousemove', handleMove, { passive: true });
        window.addEventListener('touchmove', handleMove, { passive: true });
        window.addEventListener('mousedown', handleDown);
        window.addEventListener('touchstart', handleDown, { passive: true });
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);
        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('click', handleClick);
    }

    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].add(callback);
            return () => this.callbacks[event].delete(callback);
        }
        return () => {};
    }

    onClick(callback) {
        return this.on('click', callback);
    }

    _notify(event, data, originalEvent) {
        if (this.callbacks[event]) {
            for (const cb of this.callbacks[event]) {
                cb(data, originalEvent);
            }
        }
    }
}
