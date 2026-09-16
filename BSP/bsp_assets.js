/**
 * BSP (Board/Browser Support Package) Katmanı
 * bsp_assets.js - Medya & Görsel Varlık Önyükleyici
 */

export class BSPAssets {
    constructor() {
        this.cache = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
    }

    async preloadImages(urls) {
        this.totalCount = urls.length;
        this.loadedCount = 0;

        const promises = urls.map(url => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    this.cache.set(url, img);
                    this.loadedCount++;
                    resolve({ url, img, success: true });
                };
                img.onerror = () => {
                    this.loadedCount++;
                    resolve({ url, img: null, success: false });
                };
                img.src = url;
            });
        });

        return Promise.all(promises);
    }

    async preloadVideos(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve) => {
                let resolved = false;
                const done = () => {
                    if (!resolved) {
                        resolved = true;
                        this.cache.set(url, video);
                        resolve({ url, success: true });
                    }
                };

                const video = document.createElement('video');
                video.preload = 'auto';
                video.muted = true;
                video.onloadeddata = done;
                video.onloadedmetadata = done;
                video.oncanplay = done;
                video.onerror = done;
                video.src = url;
                video.load();

                // Maksimum 300ms içinde kesin olarak devam et
                setTimeout(done, 300);
            });
        });

        return Promise.all(promises);
    }

    getImage(url) {
        return this.cache.get(url) || null;
    }

    getProgress() {
        return this.totalCount === 0 ? 1 : this.loadedCount / this.totalCount;
    }
}
