/**
 * App (Uygulama) Katmanı
 * app_main.js - Ana Başlatıcı (Bootstrap & Dependency Injection)
 * 
 * Katmanlı Mimari Hiyerarşisi:
 * 1. Katman: BSP (Donanım/Tarayıcı Soyutlama)
 * 2. Katman: Midd (İş Mantığı, Animasyon Fiziği ve Durum Yönetimi)
 * 3. Katman: App (Kullanıcı Arayüzü ve Bileşenler)
 */

import { BSPDisplay } from '../BSP/bsp_display.js?v=380';
import { BSPTimer } from '../BSP/bsp_timer.js?v=380';
import { BSPInput } from '../BSP/bsp_input.js?v=380';
import { BSPAssets } from '../BSP/bsp_assets.js?v=380';

import { MiddProductStore } from '../Midd/midd_product_store.js?v=380';
import { MiddShowcaseController } from '../Midd/midd_showcase_controller.js?v=380';
import { MiddCategoryScrollController } from '../Midd/midd_category_scroll_controller.js?v=380';

import { AppUI } from './app_ui.js?v=380';

class AppMain {
    static async bootstrap() {
        console.log('[AppMain] Katmanlı Mimari Başlatılıyor...');

        // Sayfa yenilendiğinde en başa dönmesi ve eski hash/scroll durumunu sıfırlama
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        }

        // 1. Katman: BSP Başlatma
        const bspDisplay = new BSPDisplay();
        const bspTimer = new BSPTimer();
        const bspInput = new BSPInput(window);
        const bspAssets = new BSPAssets();

        // 2. Katman: Midd Başlatma
        const productStore = new MiddProductStore();
        
        // Görselleri ve İntro Videolarını önyükle
        const imageUrls = productStore.getAllImageUrls();
        const introVideos = ['video/promosyon_perfect.webm', 'video/alemi_clean.webm'];
        await Promise.all([
            bspAssets.preloadImages(imageUrls),
            bspAssets.preloadVideos(introVideos)
        ]);

        const showcaseController = new MiddShowcaseController(
            bspTimer,
            bspDisplay,
            productStore
        );

        const categoryScrollController = new MiddCategoryScrollController(
            productStore,
            bspDisplay
        );

        // 3. Katman: App Arayüzünü Başlatma
        const appRoot = document.getElementById('app');
        const appUI = new AppUI(appRoot, bspDisplay, productStore, categoryScrollController, bspInput);

        // Controller güncellemelerini UI'a bağla
        showcaseController.onUpdate((frameData) => {
            appUI.render(frameData);
        });

        // Animasyonu Başlat
        showcaseController.play();

        console.log('[AppMain] Sistem başarıyla başlatıldı ve animasyon devrede.');
    }
}

// DOM Hazır olduğunda başlat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        AppMain.bootstrap();
    });
} else {
    AppMain.bootstrap();
}
