/**
 * Midd (Middleware) Katmanı
 * midd_showcase_controller.js - Aşamalı Kusursuz Portal Zoom ve 3D Küp Koreografisi
 */

import { MiddAnimEngine } from './midd_anim_engine.js?v=195';

export class MiddShowcaseController {
    constructor(bspTimer, bspDisplay, productStore) {
        this.bspTimer = bspTimer;
        this.bspDisplay = bspDisplay;
        this.productStore = productStore;

        this.zoomLayers = this.productStore.getZoomLayers();
        this.cubeFlips = this.productStore.getCubeFlips();
        this.heroProduct = this.productStore.getHeroProduct();

        // Toplam animasyon süresi: 6.0 saniye (yazı hızlı, tam ekrana geçiş yumuşak ve sinematik)
        this.duration = 6.0;
        this.progress = 0;
        this.isPaused = false;

        this.boxSize = { width: 180, height: 145 };

        this.listeners = new Set();
        this._init();
    }

    _init() {
        this._updateDimensions();
        this.bspDisplay.onResize(() => this._updateDimensions());
        this.bspTimer.onTick((delta) => this._onTick(delta));
    }

    _updateDimensions() {
        const isMobile = this.bspDisplay.isMobile;
        const vh = this.bspDisplay.height;
        const vw = this.bspDisplay.width;

        if (isMobile) {
            this.boxSize = {
                width: Math.min(110, Math.floor(vw * 0.32)),
                height: Math.min(88, Math.floor(vh * 0.12))
            };
            this.cubeOffsetY = 0;
        } else {
            this.boxSize = {
                width: Math.min(125, Math.floor(vw * 0.09)),
                height: Math.min(100, Math.floor(vh * 0.13))
            };
            this.cubeOffsetY = 0;
        }
    }

    onUpdate(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    play() {
        this.isPaused = false;
        this.bspTimer.start();
    }

    pause() {
        this.isPaused = true;
    }

    restart() {
        this.progress = 0;
        this.play();
    }

    _onTick(delta) {
        if (this.isPaused) return;

        this.progress += delta / this.duration;
        if (this.progress > 1.0) {
            this.progress = 1.0;
            this.pause();
        }

        this._computeFrame();
    }

    _computeFrame() {
        const p = this.progress;

        /**
         * DÜZENLENMİŞ ZAMAN ÇİZELGESİ (6.0 Saniye):
         * 1. 0.00 -> 0.16: "promosyon" Hızlı El Yazısı (~0.95s)
         * 2. 0.16 -> 0.29: "alemi" Hızlı El Yazısı (~0.78s)
         * 3. 0.29 -> 0.36: 'i' Noktası Kısa Bekleme (~0.42s)
         * 4. 0.36 -> 0.47: 'i' Noktasının Merkeze Süzülüp Büyüyerek Küpe Dönüşmesi (Morph) (~0.66s)
         * 5. 0.47 -> 0.58: 3D Küp Takla 1 (Göz -> Kadın) (~0.66s)
         * 6. 0.58 -> 0.70: 3D Küp Takla 2 (Kadın -> TECH_MAIN) (~0.72s)
         * 7. 0.70 -> 0.85: TECH_MAIN Kartının 100vh Hero Ekranına Çok Az Yavaşlatılmış, Akıcı Sinematik Genişlemesi (~0.90s)
         * 8. 0.85 -> 0.93: Başlığın Üste Taşınması (~0.48s)
         * 9. 0.93 -> 1.00: Marka Mottosunun Merkezde Belirmesi (~0.42s)
         */

        let phase = 'INTRO_PROMOSYON';
        let showIntroStage = true;
        let introPromosyonProgress = 0;
        let introAlemiProgress = 0;
        let introTextOpacity = 1.0;
        let whiteBackgroundOpacity = 1.0;

        let showDot = false;
        let dotOpacity = 0;
        let dotMorph = 0;

        let showCubeStage = false;
        let activeFlip = 1;
        let cubeRotationX = 0;

        let showHeroStage = false;
        let expandProgress = 0;
        let contentProgress = 0;
        let titleMoveProgress = 0;
        let mottoProgress = 0;
        let sideTextOpacity = 0;

        const isMobile = this.bspDisplay.isMobile;
        const vw = this.bspDisplay.width;

        // Dinamik olarak .intro-single-line-box genişliğinin hesaplanması (CSS: clamp(220px, 30vw, 400px))
        const singleLineBoxW = Math.min(400, Math.max(220, vw * 0.30));
        const containerOffsetY = isMobile ? -45 : -55;

        // 'alemi' videosundaki 'i' harfinin gövdesinin tam merkez üst konumu (sağa hizalı):
        const textEndX = 0.28906 * singleLineBoxW;
        const textEndY = containerOffsetY - (0.01274 * singleLineBoxW);

        const initialDotSize = isMobile ? 3.0 : 3.5;
        let dotX = textEndX;
        let dotY = textEndY;
        let dotW = initialDotSize;
        let dotH = initialDotSize;
        let dotRadius = 0.5;
        let dotImgOpacity = 0;

        if (p < 0.16) {
            // 1. "promosyon" hızlı el yazısı (Beyaz Arkaplan)
            phase = 'INTRO_PROMOSYON';
            showIntroStage = true;
            introPromosyonProgress = MiddAnimEngine.clamp(p / 0.16);
            introAlemiProgress = 0;
            introTextOpacity = 1.0;
            whiteBackgroundOpacity = 1.0;
            showDot = false;
            showCubeStage = false;
            showHeroStage = false;
        } else if (p < 0.29) {
            // 2. "alemi" hızlı el yazısı (Beyaz Arkaplan, Tek Satırda)
            phase = 'INTRO_ALEMI';
            showIntroStage = true;
            introPromosyonProgress = 1.0;
            introAlemiProgress = MiddAnimEngine.clamp((p - 0.16) / (0.29 - 0.16));
            introTextOpacity = 1.0;
            whiteBackgroundOpacity = 1.0;
            showDot = false;
            showCubeStage = false;
            showHeroStage = false;
        } else if (p < 0.36) {
            // 3. Yazı tamamlandıktan sonra kısa bekleme (i harfinin noktası üzerinde)
            phase = 'INTRO_WAIT';
            showIntroStage = true;
            introPromosyonProgress = 1.0;
            introAlemiProgress = 1.0;
            introTextOpacity = 1.0;
            whiteBackgroundOpacity = 1.0;
            showDot = true;
            dotOpacity = 1.0;
            dotMorph = 0;
            dotX = textEndX;
            dotY = textEndY;
            dotW = initialDotSize;
            dotH = initialDotSize;
            dotRadius = 1;
            dotImgOpacity = 0;
            showCubeStage = false;
            showHeroStage = false;
        } else if (p < 0.47) {
            // 4. Noktanın 'i' harfinden ortaya süzülüp büyümesi ve küpe dönüşmesi (Morph)
            phase = 'DOT_MORPH_TO_CUBE';
            showIntroStage = true;
            introPromosyonProgress = 1.0;
            introAlemiProgress = 1.0;
            const t = (p - 0.36) / (0.47 - 0.36);
            const easeT = MiddAnimEngine.easeInOutCubic(t);
            introTextOpacity = 1.0 - easeT;
            whiteBackgroundOpacity = 1.0;
            showDot = true;
            dotOpacity = 1.0;
            dotMorph = easeT;
            dotX = textEndX * (1.0 - easeT);
            dotY = textEndY * (1.0 - easeT);
            dotW = initialDotSize + (this.boxSize.width - initialDotSize) * easeT;
            dotH = initialDotSize + (this.boxSize.height - initialDotSize) * easeT;
            dotRadius = 1 + (18 - 1) * easeT;
            dotImgOpacity = MiddAnimEngine.clamp((easeT - 0.15) / 0.85);
            showCubeStage = false;
            showHeroStage = false;
        } else if (p < 0.58) {
            // 5. Küp Ortada Takla 1: Göz -> Kadın (BEYAZ ARKAPLANDA)
            phase = 'CUBE_FAST_1';
            showIntroStage = true;
            introTextOpacity = 0;
            whiteBackgroundOpacity = 1.0;
            showDot = false;
            showCubeStage = true;
            showHeroStage = false;
            activeFlip = 1;
            const t = (p - 0.47) / (0.58 - 0.47);
            const easeT = MiddAnimEngine.easeInOutCubic(t);
            cubeRotationX = -easeT * 90;
        } else if (p < 0.70) {
            // 6. Küp Ortada Takla 2: Kadın -> TECH_MAIN (Beyaz Zemin Koyu Temaya Yumuşakça Geçer)
            phase = 'CUBE_FAST_2';
            showIntroStage = true;
            introTextOpacity = 0;
            const t = (p - 0.58) / (0.70 - 0.58);
            const easeT = MiddAnimEngine.easeInOutCubic(t);
            whiteBackgroundOpacity = 1.0 - easeT;
            showDot = false;
            showCubeStage = true;
            showHeroStage = false;
            activeFlip = 2;
            cubeRotationX = -easeT * 90;
        } else if (p < 0.86) {
            // 7. Hero Genişlemesi: Ortadaki küpten 100vh ekrana yumuşak ve sinematik genişleme
            phase = 'EXPAND_HERO';
            showIntroStage = false;
            whiteBackgroundOpacity = 0;
            showCubeStage = false;
            showHeroStage = true;
            const t = (p - 0.70) / (0.86 - 0.70);
            const easeT = MiddAnimEngine.easeInOutCubic(t);
            expandProgress = easeT;
            contentProgress = easeT;
            titleMoveProgress = 0;
            mottoProgress = 0;
        } else {
            // 8. Hero Tamamlandı: Başlık ve Motto Ekranın Merkezinde Şık Şekilde Görünür (Scroll ile Sol Üste Geçer)
            phase = 'HERO_COMPLETE';
            showIntroStage = false;
            whiteBackgroundOpacity = 0;
            showCubeStage = false;
            showHeroStage = true;
            expandProgress = 1.0;
            contentProgress = 1.0;
            titleMoveProgress = 0;
            const t = (p - 0.86) / (1.00 - 0.86);
            mottoProgress = MiddAnimEngine.easeOutCubic(t);
        }

        const categoryBoxProgress = mottoProgress;

        const frameData = {
            phase,
            progress: p,
            showIntroStage,
            introPromosyonProgress,
            introAlemiProgress,
            introTextOpacity,
            whiteBackgroundOpacity,
            showDot,
            dotOpacity,
            dotX,
            dotY,
            dotW,
            dotH,
            dotRadius,
            dotImgOpacity,
            showZoomStage: false,
            showCubeStage,
            showHeroStage,
            zoomProgress: 0,
            zoomLayerData: [],
            activeFlip,
            cubeRotationX,
            expandProgress,
            contentProgress,
            titleMoveProgress,
            mottoProgress,
            categoryBoxProgress,
            sideTextOpacity,
            boxWidth: this.boxSize.width,
            boxHeight: this.boxSize.height,
            cubeOffsetY: this.cubeOffsetY,
            cubeFlips: this.cubeFlips,
            zoomLayers: this.zoomLayers,
            heroProduct: this.heroProduct,
            categoryInfo: this.productStore.getCategoryInfo(),
            otherCategories: this.productStore.getOtherCategories()
        };

        for (const cb of this.listeners) {
            cb(frameData);
        }
    }
}
