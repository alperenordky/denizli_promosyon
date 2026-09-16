/**
 * Midd (Middleware) Katmanı
 * midd_category_scroll_controller.js - Alternating Parallax & Zoom Scroll Engine
 * 
 * Referans: video/kategori_efekt.mov
 * - Çift sütunlu (asimetrik sol/sağ) akıcı kaydırma mantığı.
 * - Aktif kart büyük & odakta, yaklaşan kart küçük & arka planda.
 * - Yumuşak lerp (momentum) interpolasyonu ile ultra pürüzsüz kaydırma.
 */

export class MiddCategoryScrollController {
    constructor(productStore, bspDisplay) {
        this.productStore = productStore;
        this.bspDisplay = bspDisplay;
        this.items = this.productStore.getOtherCategories();

        this.scrollTarget = 0;
        this.scrollCurrent = 0;
        this.maxScroll = Math.max(0, this.items.length - 1);

        this.isOpen = false;
        this.listeners = new Set();
    }

    open() {
        this.isOpen = true;
        this.scrollTarget = 0;
        this.scrollCurrent = 0;
        this._emitUpdate();
    }

    close() {
        this.isOpen = false;
        this._emitUpdate();
    }

    next() {
        if (!this.isOpen) return;
        const currentTarget = Math.round(this.scrollTarget);
        if (currentTarget < this.maxScroll) {
            this.scrollTarget = currentTarget + 1;
        }
    }

    prev() {
        if (!this.isOpen) return;
        const currentTarget = Math.round(this.scrollTarget);
        if (currentTarget > 0) {
            this.scrollTarget = currentTarget - 1;
        }
    }

    onScrollDelta(delta) {
        if (!this.isOpen) return;
        // Klavye veya destekleyici kaydırma için
        if (delta > 30) {
            this.next();
        } else if (delta < -30) {
            this.prev();
        }
    }

    setScrollProgress(progress) {
        if (!this.isOpen) return;
        this.scrollTarget = Math.max(0, Math.min(this.maxScroll, progress * this.maxScroll));
    }

    update(deltaSeconds = 0.016) {
        if (!this.isOpen) return;

        // Pürüzsüz Lerp Fiziği
        const lerpFactor = Math.min(1, 0.10 * (deltaSeconds / 0.016));
        this.scrollCurrent += (this.scrollTarget - this.scrollCurrent) * lerpFactor;

        this._emitUpdate();
    }

    onUpdate(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    _emitUpdate() {
        const data = this.computeState();
        for (const cb of this.listeners) {
            cb(data);
        }
    }

    computeState() {
        const current = this.scrollCurrent;
        const total = this.items.length;
        const activeIndex = Math.round(current);

        const cardStates = this.items.map((item, idx) => {
            // Sütun: Çift indexler SAĞ (0, 2, 4...), Tek indexler SOL (1, 3, 5...)
            const isRightSide = idx % 2 === 0;
            const dist = idx - current; // Aktif odak noktasına olan mesafe (0 = tam odak)
            const absDist = Math.abs(dist);

            let scale = 1.0;
            let opacity = 1.0;
            let blur = 0;
            let zIndex = 10;
            let isFocused = absDist < 0.45;
            let visible = true;

            if (dist <= 0) {
                // GEÇMİŞ KART (İÇİMİZDEN GEÇME):
                // dist 0 -> -1 arasında kameraya / kullanıcıya doğru devasa boyutta yaklaşır ve içimizden geçer
                const passed = -dist; // 0 -> 1.2
                if (passed > 1.3) {
                    visible = false;
                    opacity = 0;
                } else {
                    scale = 1.0 + passed * 3.2; // 1.0 -> 4.2+ devasa zoom
                    opacity = Math.max(0, 1.0 - passed * 1.15); // Ekranı kaplarken solar
                    blur = 0; // Geçerken net kalır
                    zIndex = 30; // Ön planda içimizden geçer
                }
            } else {
                // GELECEK KART (UZAKTAN NETLEŞEREK YAKLAŞMA):
                // dist 1 -> 0 arasında uzaktaki bulanıklıktan netleşip büyür
                if (dist >= 2.2) {
                    visible = false;
                    opacity = 0;
                    blur = 20;
                } else if (dist > 1.0) {
                    const extra = dist - 1.0;
                    scale = Math.max(0.35, 0.55 - extra * 0.15);
                    opacity = Math.max(0, 0.45 - extra * 0.35);
                    blur = 16;
                    zIndex = 4;
                } else {
                    // dist 1.0 -> 0.0 arasında uzaktan yaklaşıp netleşir
                    const approachProgress = 1.0 - dist; // 0 -> 1
                    scale = 0.55 + approachProgress * 0.45; // 0.55 -> 1.0
                    opacity = 0.50 + approachProgress * 0.50; // 0.50 -> 1.0
                    blur = (1.0 - approachProgress) * 14; // 14px -> 0px (Tam netleşir)
                    zIndex = Math.round(10 + approachProgress * 10); // 10 -> 20
                }
            }

            return {
                id: item.id,
                title: item.title,
                sub: item.sub || '',
                tag: item.tag || `0${idx + 1} / KOLEKSİYON`,
                image: item.image,
                bg: item.bg || '#1a1a1a',
                isRightSide,
                dist,
                absDist,
                scale,
                opacity,
                blur,
                zIndex,
                isFocused,
                visible
            };
        });

        // Arka plan görseli: En çok odakta olan kartın görseli
        const activeItem = this.items[Math.max(0, Math.min(total - 1, activeIndex))];
        const activeBg = activeItem ? activeItem.bg : '#121614';
        const activeImage = activeItem ? activeItem.image : '';

        return {
            isOpen: this.isOpen,
            scrollCurrent: current,
            scrollTarget: this.scrollTarget,
            progress: total > 1 ? current / (total - 1) : 0,
            activeIndex,
            activeBg,
            activeImage,
            cards: cardStates
        };
    }
}
