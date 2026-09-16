/**
 * App (Uygulama) Katmanı
 * app_ui.js - 3D Küp Girişi, Genişleyen Hero Ekranı ve Sayfa Altı Modern Sade E-Ticaret Ürün Kataloğu
 */

export class AppUI {
    constructor(rootElement, bspDisplay, productStore = null, categoryScrollController = null, bspInput = null) {
        this.root = rootElement;
        this.bspDisplay = bspDisplay;
        this.productStore = productStore;
        this.categoryScrollController = categoryScrollController;
        this.bspInput = bspInput;

        this._lastActiveFlip = null;
        this._activeCategoryIndex = 0;
        this._activeFilter = 'all';

        this._buildDOM();
        this._initListeners();
    }

    _buildDOM() {
        const categoryInfo = this.productStore ? this.productStore.getCategoryInfo() : {
            title: 'Teknolojik Ürünler',
            description: 'Yeni nesil hızlı şarj destekli powerbank modelleri, minimalist kablosuz masaüstü şarj istasyonları ve yüksek ses kalitesine sahip bluetooth hoparlörlerle markanızı dijital dünyanın zirvesine taşıyın.'
        };

        const products = this.productStore ? this.productStore.getFeaturedProducts() : [];

        // E-Ticaret Ürün Kartları HTML (Kullanıcı Referans Tasarımına Birebir Uygun)
        const productCardsHTML = products.map((prod) => `
            <article class="ecom-product-card" data-category="${prod.categoryId}">
                <!-- Kart Medya Alanı: Beyaz/Açık Arka Planda Temiz Ortalı Ürün Görseli -->
                <div class="ecom-card-media">
                    <img src="${prod.image}" alt="${prod.name}" loading="lazy" class="ecom-card-img" draggable="false">
                </div>

                <!-- Kart İçerik: Ortalı Ürün Adı, Buğday Tonlu Yıldızlar ve Yıldızın Altında Büyütülmüş Fiyat -->
                <div class="ecom-card-info">
                    <h3 class="ecom-card-title">${prod.name}</h3>
                    <div class="ecom-rating-stars" aria-label="${prod.rating} yıldız">
                        ${Array.from({ length: 5 }, (_, i) => i < prod.rating ? '★' : '☆').join(' ')}
                    </div>
                    <div class="ecom-price-text">${prod.price}</div>
                </div>

                <!-- Kart Alt Çubuğu: Dikey Çizgilerle Ayrılmış 4 Adet İkon Butonu -->
                <div class="ecom-card-toolbar">
                    <button class="ecom-tool-btn" type="button" aria-label="Favorilere Ekle" title="Favorilere Ekle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                    </button>
                    <div class="ecom-tool-divider"></div>
                    <button class="ecom-tool-btn" type="button" aria-label="Hızlı Bakış" title="Hızlı Bakış">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </button>
                    <div class="ecom-tool-divider"></div>
                    <button class="ecom-tool-btn" type="button" aria-label="Karşılaştır" title="Karşılaştır">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                    </button>
                    <div class="ecom-tool-divider"></div>
                    <button class="ecom-tool-btn" type="button" aria-label="Sepete Ekle" title="Sepete Ekle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    </button>
                </div>
            </article>
        `).join('');

        this.root.innerHTML = `
            <!-- DAİMA SABİT KALAN ÜST BAR (SOL ÜSTTE MARKA LOGOSU, SAĞ ÜSTTE MENÜ) -->
            <header class="app-global-nav" id="appGlobalNav">
                <a href="#heroViewport" class="global-brand-logo" id="globalBrandLogo">
                    <span class="brand-bold">promosyon</span><span class="brand-light">alemi</span>
                </a>
                <nav class="global-header-menu" id="globalHeaderMenu">
                    <a href="#heroViewport" class="global-nav-link is-active">anasayfa</a>
                    <a href="#catalogSection" class="global-nav-link">ürünler</a>
                    <a href="#showcaseItem2" class="global-nav-link">hakkımızda</a>
                </nav>
            </header>

            <!-- 1. BÖLÜM: 100vh HERO SAHNESİ -->
            <div class="app-viewport" id="heroViewport">
                <!-- 0. Aşama: Beyaz Arkaplanda Tek Satır Minimalist Video İntro (promosyon alemi) -->
                <div class="intro-stage" id="introStage">
                    <div class="intro-paper-grain"></div>
                    <div class="intro-video-container">
                        <!-- Tek Satırda Promosyon ve Alemi Yazımı -->
                        <div class="intro-single-line-box" id="videoBoxSingle">
                            <video id="videoPromosyon" muted playsinline preload="auto">
                                <source src="video/promosyon_perfect.webm?v=80" type="video/webm">
                                <source src="video/promosyon_perfect.mp4?v=80" type="video/mp4">
                            </video>
                            <video id="videoAlemi" muted playsinline preload="auto">
                                <source src="video/alemi_clean.webm?v=80" type="video/webm">
                                <source src="video/alemi_clean.mp4?v=80" type="video/mp4">
                            </video>
                        </div>
                    </div>
                    <!-- Yazı Sonunda Belirip Merkeze Doğru Büyüyen ve Küpe Dönüşen Kare Nokta -->
                    <div class="intro-square-dot" id="squareDot">
                        <img src="resim/main_3.webp" alt="Dot" class="square-dot-img" id="squareDotImg">
                    </div>
                </div>

                <!-- 1. Aşama: 3D Küp Takla Sahnesi (Cube Stage) -->
                <div class="cube-stage-container" id="cubeStage">
                    <div class="cube-perspective">
                        <div class="cube-shadow-ground" id="cubeShadowGround"></div>
                        <div class="cube-box" id="cubeBox">
                            <div class="cube-face cube-front" id="cubeFront">
                                <img src="" alt="Front" id="cubeFrontImg">
                                <div class="cube-shading" id="cubeFrontShading"></div>
                            </div>
                            <div class="cube-face cube-top" id="cubeTop">
                                <img src="" alt="Top" id="cubeTopImg">
                                <div class="cube-shading" id="cubeTopShading"></div>
                            </div>
                            <div class="cube-face cube-back" id="cubeBack"></div>
                            <div class="cube-face cube-bottom" id="cubeBottom"></div>
                            <div class="cube-face cube-side-left" id="cubeSideLeft"></div>
                            <div class="cube-face cube-side-right" id="cubeSideRight"></div>
                        </div>
                    </div>
                </div>

                <!-- 2. Aşama: Genişleyen Hero Kartı & Ana Tema -->
                <div class="hero-container" id="heroContainer">
                    <div class="hero-card" id="heroCard">
                        <div class="hero-image-wrap">
                            <video id="heroBgVideo" class="hero-bg-video" muted playsinline preload="auto" poster="resim/degistirilecek_gorsel.jpeg">
                                <source src="video/main_videos/degistirilecek_video.mp4" type="video/mp4">
                            </video>
                            <img src="resim/degistirilecek_gorsel.jpeg" alt="Hero Background" class="hero-bg-img" id="heroBgImg">
                            <div class="hero-overlay"></div>
                        </div>

                        <!-- 1. Video Merkez Alanı: Başlığın Altındaki Şık, İnce ve Anlamlı Motto -->
                        <div class="hero-center-motto-wrap" id="heroCenterMottoWrap">
                            <p class="hero-center-sub-motto">
                                Kurumsal prestijinizi geleceğe taşıyan ayrıcalıklı dokunuşlar.
                                <span class="hero-motto-second-line">Markanıza değer katan yenilikçi ve seçkin hediye koleksiyonları.</span>
                            </p>
                            <div class="hero-motto-accent-line"></div>
                        </div>

                        <!-- Hero Altı: Şık Modern Mouse Scroll Kaydırma Animasyonu -->
                        <div class="hero-scroll-indicator" id="heroBottomBar">
                            <a href="#showcaseItem2" class="hero-scroll-mouse" aria-label="Aşağı Kaydır">
                                <div class="mouse-pill">
                                    <span class="mouse-wheel-dot"></span>
                                </div>
                                <span class="mouse-scroll-text">SCROLL</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 2. BÖLÜM: REFERANS VİDEO MİMARİSİNDE 3'LÜ SİNEMATİK SHOWCASE (STICKY CURTAIN REVEAL) -->
            <section id="videoShowcaseSection" class="video-showcase-section">
                <!-- Video 2: Kurumsal Prestij -->
                <div class="showcase-video-item" id="showcaseItem2">
                    <div class="showcase-video-wrap">
                        <video id="showcaseVideo2" class="showcase-bg-video" muted playsinline preload="metadata">
                            <source src="video/main_videos/senden_video_istiyorum_yavas_y.mp4" type="video/mp4">
                        </video>
                        <div class="showcase-video-overlay"></div>
                    </div>
                    <div class="showcase-content">
                        <h2 class="showcase-main-title">Kurumsal Koleksiyon</h2>
                        <p class="showcase-desc">İtalyan dikiş detaylı deri ajandalar, lake kaplamalı lüks imza kalemleri ve özel tasarım VIP yönetici kutuları.</p>
                    </div>
                    <div class="hero-scroll-indicator" style="opacity: 1; pointer-events: auto;">
                        <a href="#showcaseItem3" class="hero-scroll-mouse" aria-label="Aşağı Kaydır">
                            <div class="mouse-pill">
                                <span class="mouse-wheel-dot"></span>
                            </div>
                            <span class="mouse-scroll-text">SCROLL</span>
                        </a>
                    </div>
                </div>

                <!-- Video 3: Termos & Yaşam -->
                <div class="showcase-video-item" id="showcaseItem3">
                    <div class="showcase-video-wrap">
                        <video id="showcaseVideo3" class="showcase-bg-video" muted playsinline preload="metadata">
                            <source src="video/main_videos/senden_bir_video_istiyorum_vid.mp4" type="video/mp4">
                        </video>
                        <div class="showcase-video-overlay"></div>
                    </div>
                    <div class="showcase-content">
                        <h2 class="showcase-main-title">Termos & Yaşam</h2>
                        <p class="showcase-desc">Çift cidarlı vakum yalıtımlı paslanmaz çelik akıllı termoslar ve özel tasarım mataralar.</p>
                    </div>
                    <div class="hero-scroll-indicator" style="opacity: 1; pointer-events: auto;">
                        <a href="#catalogSection" class="hero-scroll-mouse" aria-label="Kataloğa Geç">
                            <div class="mouse-pill">
                                <span class="mouse-wheel-dot"></span>
                            </div>
                            <span class="mouse-scroll-text">KATALOG</span>
                        </a>
                    </div>
                    <!-- Alt Kavis (Showcase 3 ile Açık Renk Zemin Kataloğu Arasında Kusursuz Geçiş) -->
                    <div class="showcase-bottom-curve" aria-hidden="true">
                        <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
                            <path d="M0,0 C360,65 1080,65 1440,0 L1440,80 L0,80 Z" fill="#f8f9fa"></path>
                        </svg>
                    </div>
                </div>
            </section>

            <!-- 3. BÖLÜM: SAYFA ALTI MODERN E-TİCARET ÜRÜN KATALOĞU (NORMAL AÇIK RENK ZEMİN, VİDEO 3 ARKA PLANLI ŞEFFAF KUTULAR) -->
            <section id="catalogSection" class="ecommerce-catalog-section">
                <div class="catalog-container">
                    <!-- Katalog Başlık & Açıklama Alanı (Kompakt & Kısaltılmış) -->
                    <div class="catalog-header-wrap">
                        <span class="catalog-badge">KURUMSAL ÜRÜN KOLEKSİYONU</span>
                        <h2 class="catalog-main-title">Seçkin Promosyon Çözümleri</h2>
                        <p class="catalog-main-subtitle">
                            Markanızın prestijini en iyi yansıtan yüksek kaliteli kurumsal promosyon ürünleri.
                        </p>
                    </div>

                    <!-- Ana Düzen: Sol Filtre Paneli & Sağ Ürün Listesi -->
                    <div class="catalog-layout-wrapper">
                        <!-- Sol Sade & Şık Filtreleme Paneli -->
                        <aside class="catalog-sidebar-filter" id="catalogSidebarFilter">
                            <div class="sidebar-header">
                                <div class="sidebar-title-wrap">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sidebar-icon">
                                        <line x1="4" y1="21" x2="4" y2="14"></line>
                                        <line x1="4" y1="10" x2="4" y2="3"></line>
                                        <line x1="12" y1="21" x2="12" y2="12"></line>
                                        <line x1="12" y1="8" x2="12" y2="3"></line>
                                        <line x1="20" y1="21" x2="20" y2="16"></line>
                                        <line x1="20" y1="12" x2="20" y2="3"></line>
                                        <line x1="1" y1="14" x2="7" y2="14"></line>
                                        <line x1="9" y1="8" x2="15" y2="8"></line>
                                        <line x1="17" y1="16" x2="23" y2="16"></line>
                                    </svg>
                                    <span class="sidebar-heading">Koleksiyonlar</span>
                                </div>
                                <button type="button" class="sidebar-reset-btn" id="filterResetBtn">Sıfırla</button>
                            </div>

                            <nav class="sidebar-category-nav" id="sidebarCategoryNav">
                                <button type="button" class="sidebar-filter-item is-active" data-filter="all" data-title="Tüm Ürünler">
                                    <span class="filter-item-left">
                                        <span class="filter-item-indicator"></span>
                                        <span class="filter-item-name">Tüm Ürünler</span>
                                    </span>
                                    <span class="filter-item-count">8</span>
                                </button>
                                <button type="button" class="sidebar-filter-item" data-filter="tech" data-title="Teknoloji & Elektronik">
                                    <span class="filter-item-left">
                                        <span class="filter-item-indicator"></span>
                                        <span class="filter-item-name">Teknoloji & Elektronik</span>
                                    </span>
                                    <span class="filter-item-count">2</span>
                                </button>
                                <button type="button" class="sidebar-filter-item" data-filter="vip" data-title="VIP & Prestij Setler">
                                    <span class="filter-item-left">
                                        <span class="filter-item-indicator"></span>
                                        <span class="filter-item-name">VIP & Prestij Setler</span>
                                    </span>
                                    <span class="filter-item-count">3</span>
                                </button>
                                <button type="button" class="sidebar-filter-item" data-filter="thermos" data-title="Termos & Yaşam">
                                    <span class="filter-item-left">
                                        <span class="filter-item-indicator"></span>
                                        <span class="filter-item-name">Termos & Yaşam</span>
                                    </span>
                                    <span class="filter-item-count">3</span>
                                </button>
                            </nav>

                            <div class="sidebar-divider"></div>

                            <!-- Kurumsal Avantaj Kutusu -->
                            <div class="sidebar-info-card">
                                <div class="sidebar-info-badge">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    <span>KURUMSAL BASKI</span>
                                </div>
                                <p class="sidebar-info-text">Tüm ürünlerde logonuz için lazer kazıma & UV baskı desteği sağlanır.</p>
                            </div>
                        </aside>

                        <!-- Sağ Ürün Grid Alanı -->
                        <main class="catalog-main-content">
                            <div class="catalog-status-bar">
                                <span class="catalog-count-text">Toplam <strong id="catalogVisibleCount">8</strong> ürün listeleniyor</span>
                                <span class="catalog-filter-active-tag" id="catalogActiveFilterLabel">Kategori: Tüm Ürünler</span>
                            </div>

                            <div class="ecommerce-product-grid" id="ecommerceProductGrid">
                                ${productCardsHTML}
                            </div>
                        </main>
                    </div>

                    <!-- Kurumsal Teklif ve İletişim Kutusu -->
                    <div class="catalog-bottom-cta">
                        <div class="cta-inner-card">
                            <div class="cta-text-content">
                                <span class="cta-badge">HIZLI KURUMSAL TEKLİF</span>
                                <h3 class="cta-title">Özel Logo Baskılı Toplu Sipariş Teklifi</h3>
                                <p class="cta-desc">İhtiyacınız olan ürünleri seçin; lazer kazıma, UV baskı ve özel hediye kutusu seçenekleriyle kurumunuza özel fiyat teklifini hazırlayalım.</p>
                            </div>
                            <div class="cta-action-wrap">
                                <a href="https://wa.me/905000000000?text=Merhaba,%20kurumsal%20promosyon%20urunleri%20hakkinda%20bilgi%20ve%20fiyat%20teklifi%20almak%20istiyorum." target="_blank" rel="noopener noreferrer" class="cta-btn primary-cta">
                                    <span>Teklif Talebi Gönder</span>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <footer class="catalog-footer">
                        <div class="footer-brand">PROMOSYON ALEMİ</div>
                        <div class="footer-copy">© 2024 Promosyon Alemi. Tüm hakları saklıdır. Kurumsal Promosyon ve Prestij Çözümleri.</div>
                    </footer>
                </div>
            </section>
        `;

        // DOM Element Referansları
        this.introStage = document.getElementById('introStage');
        this.videoBoxSingle = document.getElementById('videoBoxSingle');
        this.videoPromosyon = document.getElementById('videoPromosyon');
        this.videoAlemi = document.getElementById('videoAlemi');
        this.squareDot = document.getElementById('squareDot');
        this.squareDotImg = document.getElementById('squareDotImg');

        this.cubeStage = document.getElementById('cubeStage');
        this.cubeBox = document.getElementById('cubeBox');
        this.cubeFront = document.getElementById('cubeFront');
        this.cubeTop = document.getElementById('cubeTop');
        this.cubeFrontImg = document.getElementById('cubeFrontImg');
        this.cubeTopImg = document.getElementById('cubeTopImg');
        this.cubeFrontShading = document.getElementById('cubeFrontShading');
        this.cubeTopShading = document.getElementById('cubeTopShading');
        this.cubeSideLeft = document.getElementById('cubeSideLeft');
        this.cubeSideRight = document.getElementById('cubeSideRight');
        this.cubeBottom = document.getElementById('cubeBottom');
        this.cubeBack = document.getElementById('cubeBack');
        this.cubeShadowGround = document.getElementById('cubeShadowGround');

        this.appGlobalNav = document.getElementById('appGlobalNav');
        this.globalBrandLogo = document.getElementById('globalBrandLogo');
        this.globalHeaderMenu = document.getElementById('globalHeaderMenu');

        this.heroContainer = document.getElementById('heroContainer');
        this.heroCard = document.getElementById('heroCard');
        this.heroBgVideo = document.getElementById('heroBgVideo');
        this.heroBgImg = document.getElementById('heroBgImg');
        this.heroCenterMottoWrap = document.getElementById('heroCenterMottoWrap');
        this.heroCenterMotto = document.getElementById('heroCenterMotto');
        this.heroBottomBar = document.getElementById('heroBottomBar');
        this.catalogSection = document.getElementById('catalogSection');
        this.catalogFilterBar = document.getElementById('catalogFilterBar');
        this.ecommerceProductGrid = document.getElementById('ecommerceProductGrid');
        this._lastFrameData = null;
    }

    _initListeners() {
        // Sayfa kaydırıldığında ve boyut değiştiğinde logo ve header durumunu anlık güncelle
        window.addEventListener('scroll', () => {
            this._updateHeaderAndLogo();
        }, { passive: true });

        window.addEventListener('resize', () => {
            this._updateHeaderAndLogo();
        }, { passive: true });

        const scrollToCatalog = (e) => {
            e.preventDefault();
            const catalog = document.getElementById('catalogSection');
            if (catalog) {
                catalog.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
            }
        };

        const heroScrollBtn = this.root.querySelector('.hero-scroll-arrow-btn');
        if (heroScrollBtn) {
            heroScrollBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.getElementById('showcaseItem2');
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Sol Sidebar Kategori Filtre Butonları
        const filterBtns = this.root.querySelectorAll('.sidebar-filter-item');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter || 'all';
                const title = btn.dataset.title || 'Tüm Ürünler';
                this._applyFilter(filter, btn, title);
            });
        });

        // Filtre Sıfırla Butonu
        const resetBtn = this.root.querySelector('#filterResetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const allBtn = this.root.querySelector('.sidebar-filter-item[data-filter="all"]');
                this._applyFilter('all', allBtn, 'Tüm Ürünler');
            });
        }

        // Teklif Al Butonları
        const quoteBtns = this.root.querySelectorAll('.ecom-quote-btn');
        quoteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const name = btn.dataset.name || 'Ürün';
                const code = btn.dataset.code || '';
                const msg = `Merhaba, ${code} - ${name} ürünü hakkında kurumsal fiyat teklifi ve numune talebinde bulunmak istiyorum.`;
                const url = `https://wa.me/905000000000?text=${encodeURIComponent(msg)}`;
                window.open(url, '_blank');
            });
        });

        // Sayfa içi yumuşak kaydırma linkleri (URL hash'ini bozmadan ve refresh'te atlamayı önleyerek)
        const smoothLinks = this.root.querySelectorAll('a[href^="#"]');
        smoothLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').replace('#', '');
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Ürün Görsellerinin Beyaz Arka Planını Şeffaflaştırarak 3. Video Üzerinde Kusursuz Yüzdürme
        this._initTransparentProductImages();

        // Sahneye girildiğinde videoları başlatan ve çıkınca durduran Observer
        this._initVideoScrollObserver();
    }

    _initTransparentProductImages() {
        const productImgs = this.root.querySelectorAll('.ecom-card-img');
        productImgs.forEach(img => {
            const processImg = () => {
                try {
                    if (!img.naturalWidth || img.dataset.processed === 'true') return;
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    ctx.drawImage(img, 0, 0);
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const d = imgData.data;

                    for (let i = 0; i < d.length; i += 4) {
                        const r = d[i], g = d[i + 1], b = d[i + 2];
                        // Beyaz ve beyaza çok yakın arka plan piksellerini şeffaf yap
                        if (r > 245 && g > 245 && b > 245) {
                            d[i + 3] = 0;
                        } else if (r > 235 && g > 235 && b > 235) {
                            const alphaFactor = (255 - Math.max(r, g, b)) / 20;
                            d[i + 3] = Math.round(d[i + 3] * Math.max(0, Math.min(1, alphaFactor)));
                        }
                    }

                    ctx.putImageData(imgData, 0, 0);
                    img.dataset.processed = 'true';
                    img.src = canvas.toDataURL('image/png');
                } catch (e) {
                    // CORS veya fallback durumunda orijinal görseli koru
                }
            };

            if (img.complete && img.naturalWidth > 0) {
                processImg();
            } else {
                img.addEventListener('load', processImg, { once: true });
            }
        });
    }

    _initVideoScrollObserver() {
        const videoConfigs = [
            {
                video: document.getElementById('heroBgVideo'),
                section: document.getElementById('heroViewport')
            },
            {
                video: document.getElementById('showcaseVideo2'),
                section: document.getElementById('showcaseItem2')
            },
            {
                video: document.getElementById('showcaseVideo3'),
                section: document.getElementById('showcaseItem3')
            }
        ];

        // Videoları başlangıçta sıfırla ve loopsuz son karede duracak şekilde ayarla
        videoConfigs.forEach(cfg => {
            if (cfg.video) {
                cfg.video.loop = false;
                cfg.video.currentTime = 0;
                cfg.video.pause();
                cfg.video.addEventListener('ended', () => {
                    cfg.video.pause();
                });
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const config = videoConfigs.find(c => c.section === entry.target);
                if (!config || !config.video) return;

                // Bölüm ekranda en az %20 görünür olduğunda baştan başlat
                if (entry.isIntersecting && entry.intersectionRatio >= 0.20) {
                    if (config.video.ended) {
                        config.video.currentTime = 0;
                    }
                    config.video.play().catch(() => {});
                } else {
                    // Sahneden çıktığında durdur ve sıfırla
                    if (!config.video.paused) {
                        config.video.pause();
                    }
                    if (entry.intersectionRatio < 0.05) {
                        config.video.currentTime = 0;
                    }
                }
            });
        }, {
            threshold: [0, 0.05, 0.20, 0.50, 0.75, 1.0]
        });

        videoConfigs.forEach(cfg => {
            if (cfg.section) {
                observer.observe(cfg.section);
            }
        });
    }

    _applyFilter(filter, activeBtn, title = 'Tüm Ürünler') {
        this._activeFilter = filter;
        
        // Aktif buton görselini güncelle
        const buttons = this.root.querySelectorAll('.sidebar-filter-item');
        buttons.forEach(b => b.classList.toggle('is-active', b === activeBtn));

        // Üst Başlık Etiketini Güncelle
        const activeLabel = document.getElementById('catalogActiveFilterLabel');
        if (activeLabel) {
            activeLabel.textContent = `Kategori: ${title}`;
        }

        // Ürün kartlarını filtrele ve sayaç güncelle
        const cards = this.ecommerceProductGrid ? this.ecommerceProductGrid.querySelectorAll('.ecom-product-card') : [];
        let visibleCount = 0;

        cards.forEach(card => {
            const cardCat = card.dataset.category;
            if (filter === 'all' || cardCat === filter) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });

        const countEl = document.getElementById('catalogVisibleCount');
        if (countEl) {
            countEl.textContent = visibleCount;
        }
    }

    render(frameData) {
        const {
            showIntroStage = false,
            introPromosyonProgress = 0,
            introAlemiProgress = 0,
            introTextOpacity = 1.0,
            whiteBackgroundOpacity = 1.0,
            showDot = false,
            dotOpacity = 0,
            dotX = 0,
            dotY = 0,
            dotW = 8,
            dotH = 8,
            dotRadius = 2,
            dotImgOpacity = 0,
            showCubeStage,
            showHeroStage,
            activeFlip,
            cubeRotationX,
            expandProgress,
            contentProgress,
            titleMoveProgress = 0,
            mottoProgress = 0,
            sideTextOpacity,
            boxWidth,
            boxHeight,
            cubeOffsetY = 0,
            cubeFlips
        } = frameData;

        // 0. Aşama: Beyaz Arkaplanda Tek Satır Minimalist Video İntro & Küp Arkaplanı Render
        if (this.introStage) {
            if (showIntroStage && whiteBackgroundOpacity > 0.01) {
                this.introStage.style.display = 'flex';
                this.introStage.style.opacity = whiteBackgroundOpacity;

                // Video kutusunun şeffaflığı (yazı bitince küp için kaybolur)
                if (this.videoBoxSingle) {
                    this.videoBoxSingle.style.opacity = introTextOpacity;
                }

                if (introAlemiProgress > 0.01) {
                    // 2. Aşama: "alemi" yazılıyor (promosyon zaten yazılı, boyut hiç değişmez)
                    if (this.videoAlemi) {
                        this.videoAlemi.style.opacity = '1';
                        const dur2 = this.videoAlemi.duration || 2.93;
                        if (dur2 > 0 && isFinite(dur2)) {
                            const targetTime = introAlemiProgress * dur2;
                            if (Math.abs(this.videoAlemi.currentTime - targetTime) > 0.08) {
                                this.videoAlemi.currentTime = targetTime;
                            }
                        }
                    }
                    if (this.videoPromosyon) {
                        this.videoPromosyon.style.opacity = '0';
                    }
                } else {
                    // 1. Aşama: "promosyon" yazılıyor
                    if (this.videoPromosyon) {
                        this.videoPromosyon.style.opacity = '1';
                        const dur1 = this.videoPromosyon.duration || 3.66;
                        if (dur1 > 0 && isFinite(dur1)) {
                            const targetTime = introPromosyonProgress * dur1;
                            if (Math.abs(this.videoPromosyon.currentTime - targetTime) > 0.08) {
                                this.videoPromosyon.currentTime = targetTime;
                            }
                        }
                    }
                    if (this.videoAlemi) {
                        this.videoAlemi.style.opacity = '0';
                    }
                }
            } else {
                this.introStage.style.display = 'none';
                this.introStage.style.opacity = '0';
            }
        }

        // Kare Ufak Nokta & Küp Morf Animasyonu Render
        if (this.squareDot) {
            if (showDot && dotOpacity > 0.01) {
                this.squareDot.style.display = 'flex';
                this.squareDot.style.opacity = dotOpacity;
                this.squareDot.style.width = `${dotW.toFixed(1)}px`;
                this.squareDot.style.height = `${dotH.toFixed(1)}px`;
                this.squareDot.style.borderRadius = `${dotRadius.toFixed(1)}px`;
                this.squareDot.style.transform = `translate(calc(-50% + ${dotX.toFixed(1)}px), calc(-50% + ${dotY.toFixed(1)}px))`;
                if (this.squareDotImg) {
                    this.squareDotImg.style.opacity = dotImgOpacity;
                }
            } else {
                this.squareDot.style.display = 'none';
                this.squareDot.style.opacity = '0';
            }
        }

        // 1. Aşama: 3D Küp Taklası Render (Beyaz Arkaplanın Üzerinde & Ortada)
        if (this.cubeStage) {
            this.cubeStage.style.display = showCubeStage ? 'flex' : 'none';
            if (showCubeStage) {
                const flipData = cubeFlips[`flip${activeFlip}`] || cubeFlips.flip1;
                
                if (this._lastActiveFlip !== activeFlip && flipData) {
                    this.cubeFrontImg.src = flipData.front;
                    this.cubeTopImg.src = flipData.top;
                    this._lastActiveFlip = activeFlip;
                }

                const halfH = Math.round(boxHeight / 2);
                const halfW = Math.round(boxWidth / 2);
                const sideOffsetLeft = (boxWidth - boxHeight) / 2;

                // Saf, düz ve bozulmasız 3D takla hareketi
                const rotProgress = Math.min(1.0, Math.max(0.0, Math.abs(cubeRotationX) / 90));

                this.cubeStage.style.transform = `translateY(${cubeOffsetY}px)`;

                this.cubeBox.style.width = `${boxWidth}px`;
                this.cubeBox.style.height = `${boxHeight}px`;
                this.cubeBox.style.transform = `translateZ(-${halfH}px) rotateX(${cubeRotationX}deg)`;

                // 1. Ön Yüz (Front)
                this.cubeFront.style.width = `${boxWidth}px`;
                this.cubeFront.style.height = `${boxHeight}px`;
                this.cubeFront.style.transform = `rotateX(0deg) translateZ(${halfH}px)`;
                if (this.cubeFrontShading) {
                    this.cubeFrontShading.style.opacity = rotProgress * 0.55;
                }

                // 2. Üst Yüz (Top)
                this.cubeTop.style.width = `${boxWidth}px`;
                this.cubeTop.style.height = `${boxHeight}px`;
                this.cubeTop.style.transform = `rotateX(90deg) translateZ(${halfH}px)`;
                if (this.cubeTopShading) {
                    this.cubeTopShading.style.opacity = (1.0 - rotProgress) * 0.55;
                }

                // 3. Arka Yüz (Back)
                if (this.cubeBack) {
                    this.cubeBack.style.width = `${boxWidth}px`;
                    this.cubeBack.style.height = `${boxHeight}px`;
                    this.cubeBack.style.transform = `rotateX(180deg) translateZ(${halfH}px)`;
                }

                // 4. Alt Yüz (Bottom)
                if (this.cubeBottom) {
                    this.cubeBottom.style.width = `${boxWidth}px`;
                    this.cubeBottom.style.height = `${boxHeight}px`;
                    this.cubeBottom.style.transform = `rotateX(-90deg) translateZ(${halfH}px)`;
                }

                // 5. Sol Yan Yüz (Left)
                if (this.cubeSideLeft) {
                    this.cubeSideLeft.style.width = `${boxHeight}px`;
                    this.cubeSideLeft.style.height = `${boxHeight}px`;
                    this.cubeSideLeft.style.left = `${sideOffsetLeft}px`;
                    this.cubeSideLeft.style.transform = `rotateY(-90deg) translateZ(${halfW}px)`;
                }

                // 6. Sağ Yan Yüz (Right)
                if (this.cubeSideRight) {
                    this.cubeSideRight.style.width = `${boxHeight}px`;
                    this.cubeSideRight.style.height = `${boxHeight}px`;
                    this.cubeSideRight.style.left = `${sideOffsetLeft}px`;
                    this.cubeSideRight.style.transform = `rotateY(90deg) translateZ(${halfW}px)`;
                }

                // 3D Taban Gölgesi
                if (this.cubeShadowGround) {
                    const shadowScale = 1.0 - Math.sin(rotProgress * Math.PI) * 0.20;
                    const shadowOpacity = 0.38 - Math.sin(rotProgress * Math.PI) * 0.15;
                    this.cubeShadowGround.style.width = `${Math.round(boxWidth * 1.08)}px`;
                    this.cubeShadowGround.style.height = `${Math.round(boxHeight * 0.35)}px`;
                    this.cubeShadowGround.style.transform = `translateY(${halfH + 16}px) scale(${shadowScale})`;
                    this.cubeShadowGround.style.opacity = shadowOpacity;
                }
            }
        }

        // 2. Aşama: Genişleyen Hero Kartı & Metinler Render
        if (this.heroContainer && this.heroCard) {
            this.heroContainer.style.display = showHeroStage ? 'flex' : 'none';
            if (showHeroStage) {
                const vw = this.bspDisplay.width;
                const vh = this.bspDisplay.height;

                const targetW = vw;
                const targetH = vh;

                const currentW = boxWidth + (targetW - boxWidth) * expandProgress;
                const currentH = boxHeight + (targetH - boxHeight) * expandProgress;
                const currentRadius = 18 * (1.0 - expandProgress);
                const currentOffsetY = cubeOffsetY * (1.0 - expandProgress);

                this.heroContainer.style.transform = `translateY(${currentOffsetY}px)`;
                this.heroCard.style.width = `${Math.round(currentW)}px`;
                this.heroCard.style.height = `${Math.round(currentH)}px`;
                this.heroCard.style.borderRadius = `${Math.max(0, Math.round(currentRadius))}px`;

                // Küpten çıkan görsel zoomlanarak TAM EKRAN olduğunda video oynamaya başlar
                if (expandProgress >= 0.98) {
                    if (this.heroBgVideo) {
                        this.heroBgVideo.style.opacity = '1';
                        if (this.heroBgVideo.paused && !this.heroBgVideo.ended) {
                            this.heroBgVideo.play().catch(() => {});
                        }
                    }
                } else {
                    if (this.heroBgVideo) {
                        this.heroBgVideo.style.opacity = '0';
                        if (!this.heroBgVideo.paused) {
                            this.heroBgVideo.pause();
                            this.heroBgVideo.currentTime = 0;
                        }
                    }
                }
            }
        }

        // Header & Logo & Motto Scroll Durumunu Güncelle
        this._lastFrameData = frameData;
        this._updateHeaderAndLogo();
    }

    _updateHeaderAndLogo() {
        if (!this.appGlobalNav || !this.globalBrandLogo) return;

        const frameData = this._lastFrameData || {};
        const {
            showHeroStage = false,
            expandProgress = 0,
            mottoProgress = 0
        } = frameData;

        // Hero aşamasına gelinmediyse üst barı gizli tut
        if (!showHeroStage && expandProgress < 0.1) {
            this.appGlobalNav.style.opacity = '0';
            this.appGlobalNav.style.pointerEvents = 'none';
            if (this.heroCenterMottoWrap) this.heroCenterMottoWrap.style.opacity = '0';
            if (this.heroBottomBar) this.heroBottomBar.style.opacity = '0';
            return;
        }

        const navOpacity = Math.min(1.0, Math.max(0, expandProgress * 1.5));
        this.appGlobalNav.style.opacity = navOpacity.toFixed(3);

        const scrollY = window.scrollY || 0;
        const scrollThreshold = 260; // 260px kaydırma boyunca merkezden sol üste pürüzsüz geçiş
        const scrollProgress = Math.min(1.0, Math.max(0, scrollY / scrollThreshold));

        // Smooth Hermite interpolation (smoothstep)
        const easeProgress = scrollProgress * scrollProgress * (3 - 2 * scrollProgress);

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const isMobile = vw <= 768;

        // Navbar padding değerleri
        const navComputed = window.getComputedStyle(this.appGlobalNav);
        const paddingLeft = parseFloat(navComputed.paddingLeft) || (isMobile ? 24 : 64);
        const paddingTop = parseFloat(navComputed.paddingTop) || (isMobile ? 18 : 32);

        // Logo boyutları
        const logoW = this.globalBrandLogo.offsetWidth || 260;
        const logoH = this.globalBrandLogo.offsetHeight || 32;

        const startScale = isMobile ? 2.1 : 3.1;
        const currentScale = startScale - (startScale - 1.0) * easeProgress;

        // Ekran merkezine hizalamak için başlangıç ofsetleri (başlık büyütüldü, motto hemen altına yerleşir)
        const targetCenterX = (vw / 2) - paddingLeft - (logoW * startScale) / 2;
        const targetCenterY = (vh / 2 - (isMobile ? 38 : 50)) - paddingTop - (logoH * startScale) / 2;

        const currentX = targetCenterX * (1.0 - easeProgress);
        const currentY = targetCenterY * (1.0 - easeProgress);

        this.globalBrandLogo.style.transformOrigin = '0 0';
        this.globalBrandLogo.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(3)})`;
        this.globalBrandLogo.style.pointerEvents = 'auto';

        // Sağ Üst Menü
        if (this.globalHeaderMenu) {
            const menuOpacity = (expandProgress >= 0.9 ? 1 : 0) * (mottoProgress || 1);
            this.globalHeaderMenu.style.opacity = menuOpacity.toFixed(3);
            this.globalHeaderMenu.style.pointerEvents = menuOpacity > 0.5 ? 'auto' : 'none';
        }

        // Merkezdeki Anlamlı Şık Motto (Scroll ile yukarı doğru süzülerek kaybolur)
        if (this.heroCenterMottoWrap) {
            const mottoFade = Math.max(0, 1.0 - scrollProgress * 2.2) * (mottoProgress || (expandProgress >= 1 ? 1 : 0));
            this.heroCenterMottoWrap.style.opacity = mottoFade.toFixed(3);
            this.heroCenterMottoWrap.style.transform = `translate3d(-50%, calc(-50% + ${((1.0 - Math.min(1, mottoFade)) * -24).toFixed(1)}px), 0)`;
            this.heroCenterMottoWrap.style.pointerEvents = mottoFade > 0.4 ? 'auto' : 'none';
        }

        // Alt Bilgi Çubuğu (Mouse Scroll Animasyonu)
        if (this.heroBottomBar) {
            const bottomFade = Math.max(0, 1.0 - scrollProgress * 2.5) * (mottoProgress || (expandProgress >= 1 ? 1 : 0));
            this.heroBottomBar.style.opacity = bottomFade.toFixed(3);
            this.heroBottomBar.style.pointerEvents = bottomFade > 0.4 ? 'auto' : 'none';
        }

        // Sayfa aşağı kaydırıldığında sabit navbar cam/blur efekti
        this.appGlobalNav.classList.toggle('is-scrolled', scrollY > 40);
    }
}
