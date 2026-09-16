/**
 * Midd (Middleware) Katmanı
 * midd_product_store.js - Videodaki Birebir Görsel ve Veri Dizilimi
 */

export class MiddProductStore {
    constructor() {
        // 1. Aşama: İç İçe Sonsuz Yakınlaşma (Recursive Zoom Tunnel) Görselleri
        // Sıra: Dıştan içe (Landscape -> Woman -> Matcha -> Eye)
        this.zoomLayers = [
            { id: 'zoom_0', image: 'resim/degistirilecek_gorsel.jpeg', alt: 'Landscape' },
            { id: 'zoom_1', image: 'resim/main_1.webp', alt: 'Woman' },
            { id: 'zoom_2', image: 'resim/main_2.webp', alt: 'Matcha' },
            { id: 'zoom_3', image: 'resim/main_3.webp', alt: 'Eye' }
        ];

        // 1. Aşama: 3D Küp / Kutu Taklaları (2 Takla, 3 Görsel)
        // Flip 1: Göz (Ön) -> Kadın (Üstten iner)
        this.cubeFlip1 = {
            front: 'resim/main_3.webp',
            top: 'resim/main_1.webp'
        };

        // Flip 2: Kadın (Ön) -> Yeni Görsel (Üstten iner)
        this.cubeFlip2 = {
            front: 'resim/main_1.webp',
            top: 'resim/degistirilecek_gorsel.jpeg'
        };

        // 2. Aşama: Genişleyen Ana Tema (Hero Theme)
        this.heroProduct = {
            id: 'hero',
            image: 'resim/degistirilecek_gorsel.jpeg',
            fallbackImage: 'resim/degistirilecek_gorsel.jpeg',
            video: 'video/main_videos/degistirilecek_video.mp4',
            brandLeft: 'Oscar Pico',
            brandSub: 'Oscar Pico — Portfolio©24',
            sideLeft: 'OSCAR PICO',
            sideRight: 'DIGITAL DESIGNER',
            title: 'PROMOSYON ALEMİ',
            motto: 'Unutulmaz izler bırakan dokunuşlar. Modern tasarım anlayışıyla harmanlanan, markanızın kurumsal prestijini ve vizyonunu geleceğe taşıyan ayrıcalıklı koleksiyonlar.',
            pagination: { current: '01', total: '04' }
        };

        // Sol Kutu: macOS M4 Dock Tasarımlı Kategori Bilgisi (5-6 Cümlelik Zengin Açıklama)
        this.categoryInfo = {
            badge: 'KATEGORİ',
            title: 'Teknolojik Ürünler',
            description: 'Yeni nesil hızlı şarj destekli powerbank modelleri, minimalist kablosuz masaüstü şarj istasyonları ve yüksek ses kalitesine sahip bluetooth hoparlörlerle markanızı dijital dünyanın zirvesine taşıyın. Günlük iş temposunda sürekli ihtiyaç duyulan akıllı teknolojik aksesuarlar, müşterilerinizin ve iş ortaklarınızın elinden düşmeyecek kalıcı bir prestij sunar. Lazer kazıma ve UV baskı teknolojisiyle kurumsal logonuz ürünlerin üzerinde ilk günkü parlaklığını yıllarca korur. Şık mat alüminyum gövde detayları ve LED şarj göstergeleriyle donatılan koleksiyonumuz, inovatif vizyonunuzu kusursuzca yansıtır. Her kullanımda yüksek performans hissi uyandıran bu özel seri, kurumsal hediye deneyimini modern bir boyuta taşır. Prestijli iş toplantılarından uluslararası fuarlara kadar markanızın teknolojideki yenilikçi yüzü olun.'
        };

        // 3. Aşama: 5-6 Cümlelik Kapsamlı ve Zengin Kategori Tanımları
        this.otherCategories = [
            { 
                id: 'cat_1', 
                tag: '01 / POWERBANK & TECH', 
                title: 'TEKNOLOJİK ÜRÜNLER', 
                sub: 'Yeni nesil hızlı şarj destekli powerbank modelleri, minimalist kablosuz masaüstü şarj istasyonları ve yüksek ses kalitesine sahip bluetooth hoparlörlerle markanızı dijital dünyanın zirvesine taşıyın. Günlük iş temposunda sürekli ihtiyaç duyulan akıllı teknolojik aksesuarlar, müşterilerinizin ve iş ortaklarınızın elinden düşmeyecek kalıcı bir prestij sunar. Lazer kazıma ve UV baskı teknolojisiyle kurumsal logonuz ürünlerin üzerinde ilk günkü parlaklığını yıllarca korur. Şık mat alüminyum gövde detayları ve LED şarj göstergeleriyle donatılan koleksiyonumuz, inovatif vizyonunuzu kusursuzca yansıtır. Her kullanımda yüksek performans hissi uyandıran bu özel seri, kurumsal hediye deneyimini modern bir boyuta taşır. Prestijli iş toplantılarından uluslararası fuarlara kadar markanızın teknolojideki yenilikçi yüzü olun.', 
                bg: '#16222b', 
                image: 'resim/TECH_MAIN.jpeg' 
            },
            { 
                id: 'cat_2', 
                tag: '02 / EXECUTIVE VIP', 
                title: 'KURUMSAL PRESTİJ', 
                sub: 'Üst düzey yöneticiler ve değerli iş ortakları için özel olarak tasarlanan VIP yönetici setleri, kurumunuzun seçkin vizyonunu en asil şekilde temsil eder. İtalyan dikiş detaylı deri ajandalar, lake kaplamalı tükenmez kalemler ve zarif kartvizitlikler aynı kutuda kusursuz bir ahenk oluşturur. Özel tasarım ahşap veya kadife kaplı lüks hediye kutuları, ilk andan itibaren unutulmaz bir açılış deneyimi yaşatır. Özel günlerde, terfi tebriklerinde ve stratejik iş anlaşmalarında kurumsal imzanızı en üst seviyeye taşır. Zamansız tasarımı ve asil renk tonlarıyla çalışma masalarının vazgeçilmez odak noktası haline gelir. Markanızın kaliteye, itibara ve kalıcılığa verdiği değeri her ayrıntısıyla hissettirin.', 
                bg: '#2b1b16', 
                image: 'resim/main_1.webp' 
            },
            { 
                id: 'cat_3', 
                tag: '03 / ARTISAN CERAMIC', 
                title: 'SERAMİK & PORSELEN', 
                sub: 'Usta ellerden çıkan el yapımı seramik fincanlar, özel formlu porselen kupalar ve barista serisi kahve bardaklarıyla ofis molalarını sanat dolu bir keyfe dönüştürün. Yüksek sıcaklıkta fırınlanan dayanıklı porselen yapısı, mikrodalga ve bulaşık makinesine uygun uzun ömürlü bir kullanım avantajı sağlar. Doğal toprak tonlarından mat siyah ve antrasit glaze kaplamalara kadar uzanan zengin renk seçenekleriyle markanıza özel çözümler sunar. Sabahın ilk kahvesinden gün sonu toplantılarına kadar çalışanlarınızın ve misafirlerinizin en yakın eşlikçisi olur. Üzerine uygulanan kabartma veya sıcak transfer baskılar, markanızın logosunu estetik bir zarafetle sergiler. Her yudumda sıcak, samimi ve kaliteli bir marka bağlılığı inşa edin.', 
                bg: '#182b20', 
                image: 'resim/main_2.webp' 
            },
            { 
                id: 'cat_4', 
                tag: '04 / LUXURY METAL', 
                title: 'PRESTİJ KOLEKSİYON', 
                sub: 'Mat titanyum, fırçalanmış çelik ve altın varak kaplamalı masaüstü aksesuarlarıyla çalışma alanlarına görkemli bir dokunuş kazandırın. Ağırlığı ve dokusuyla kaliteyi ilk temas anında hissettiren metal masa takımları, yöneticilerin ofislerinde prestijin simgesi haline gelir. Geometrik hatları ve zamansız estetiğiyle modern mimari tasarım trendlerini çalışma masalarına taşır. Yıllara meydan okuyan dayanıklı metal alaşımlar, markanızın güvenilirlik ve sarsılmaz itibarını simgeler. Özel gravür işlemeleri sayesinde her ürün kişiselleştirilebilir ve eşsiz bir sanat eserine dönüştürülebilir. İş dünyasında saygınlık uyandıran en seçkin kurumsal hediye alternatiflerinden birini keşfedin.', 
                bg: '#261b2e', 
                image: 'resim/main_3.webp' 
            },
            { 
                id: 'cat_5', 
                tag: '05 / SMART THERMOS', 
                title: 'AKILLI ÇELİK TERMOS', 
                sub: 'Çift cidarlı vakum izolasyon teknolojisine sahip paslanmaz çelik akıllı termoslar, içeceklerinizi 24 saat soğuk ve 12 saat sıcak tutar. Kapağa entegre dijital dokunmatik LED ekran, tek dokunuşla içecek sıcaklığını anlık olarak takip etme ayrıcalığı sunar. BPA içermeyen gıda sınıfı iç yüzeyi ve sızdırmaz kilit mekanizmasıyla seyahatte, sporda ve ofiste güvenli kullanım sağlar. Mat soft-touch dış yüzeyi kaymaz ve ergonomik bir tutuş sağlarken kurumsal logonuzu şık bir parlaklıkla öne çıkarır. Doğa dostu ve sürdürülebilir yapısıyla tek kullanımlık plastik bardak tüketimini sonlandırarak çevreci vizyonunuza katkıda bulunur. Modern şehir yaşamının dinamizmine ayak uyduran bu akıllı seri, markanızı her an hareket halinde tutar.', 
                bg: '#2e2015', 
                image: 'resim/main_4.webp' 
            },
            { 
                id: 'cat_6', 
                tag: '06 / PREMIUM TEXTILE', 
                title: 'TEKSTİL & GİYİM', 
                sub: '%100 organik taranmış pamuktan üretilen polo yaka tişörtler, nefes alabilir kumaşlı rüzgarlıklar ve kışlık polar montlarla kurumsal aidiyeti güçlendirin. Vücuda tam oturan modern kalıpları ve yumuşak dokusuyla çalışanlarınıza gün boyu üstün konfor ve şıklık sunar. Yıkamaya dayanıklı renk sabitleme teknolojisi ve yüksek kaliteli nakış işlemeleri, logonuzun daima canlı kalmasını sağlar. Kurumsal etkinliklerde, saha operasyonlarında ve bayi toplantılarında bütünsel ve profesyonel bir takım görüntüsü oluşturur. Sürdürülebilir tekstil standartlarına uygun çevre dostu üretim süreçleriyle markanızın etik değerlerini destekler. Kurumsal tarzınızı sokağa, ofise ve tüm şehre yansıtan premium giyim koleksiyonu.', 
                bg: '#15242d', 
                image: 'resim/main_5.webp' 
            },
            { 
                id: 'cat_7', 
                tag: '07 / GENUINE LEATHER', 
                title: 'DERİ & AJANDA', 
                sub: 'Hakiki dana derisi ve çevre dostu vegan deri seçenekleriyle hazırlanan lüks ajandalar, cüzdanlar ve minimalist kartlıklar iş hayatının klasiğidir. Termo deri kapak dokusu, sıcak gofre baskı uygulandığında logonuzu derinlemesine ve son derece asil bir tonla ortaya çıkarır. Fildişi rengi asitsiz kaliteli iç sayfaları, dolma kalem kullanımında dahi mürekkep dağıtmayan kusursuz bir yazım keyfi sağlar. Tarihli, tarihsiz ve çizgili sayfa alternatifleriyle her profesyonelin planlama alışkanlıklarına uyum gösterir. Mıknatıslı kilit tokaları, kalem tutucu elastik bantları ve şık dikiş işçiliğiyle detaylardaki ustalığı yansıtır. Yıl boyunca her gün masada açık durarak markanızın sürekli göz önünde olmasını garantiler.', 
                bg: '#2b1814', 
                image: 'resim/main_6.webp' 
            },
            { 
                id: 'cat_8', 
                tag: '08 / TRAVEL & BACKPACK', 
                title: 'SEYAHAT & SIRT ÇANTASI', 
                sub: 'Su itici dayanıklı oxford kumaş, darbe emici sünger dolgulu laptop bölmesi ve gizli güvenlik cepleriyle seyahatleri zahmetsiz hale getirin. Ergonomik sırt desteği ve nefes alabilir omuz askıları, ağır yüklerde bile vücuda binen baskıyı minimuma indirir. Entegre harici USB şarj portu sayesinde yürüyüş halindeyken cihazlarınızı kolayca şarj edebilme konforu sunar. İş seyahatlerinden hafta sonu kaçamaklarına kadar geniş iç hacmiyle tüm eşyalarınızı düzenli ve korunaklı tutar. Metal fermuar elcikleri ve zarif kauçuk/metal marka plakalarıyla markanızı global ölçekte taşır. Modern iş insanlarının ve dinamik ekiplerin vazgeçilmez seyahat ortağı.', 
                bg: '#1c222b', 
                image: 'resim/main_7.webp' 
            },
            { 
                id: 'cat_9', 
                tag: '09 / LUXURY WRITING', 
                title: 'KIRTASİYE & ROLLER', 
                sub: 'İsviçre hassasiyetli tungsten karbür bilyeli roller ve dolma kalemler, kağıt üzerinde ipeksi bir kayma hissiyle benzersiz bir yazım sunar. Ağır pirinç ve paslanmaz çelik gövde yapısı, eldeki dengeli ağırlığıyla imza anlarını unutulmaz bir seremoniye dönüştürür. Mat lake, krom ve karbon fiber desen kaplamalarıyla zarafetin en rafine halini sergiler. Özel kadife yataklı hediye kutusunda sunulan ikili ve tekli setler, kurumsal hediyeleşmenin en zamansız ve etkili jestidir. Lazer kazıma ile kişiye özel isim ve unvan baskısı yapılarak manevi değeri paha biçilemez bir hatıraya dönüşür. Stratejik kararların ve önemli sözleşmelerin altındaki imzanıza eşlik edin.', 
                bg: '#271f1a', 
                image: 'resim/main_8.webp' 
            },
            { 
                id: 'cat_10', 
                tag: '10 / SUSTAINABLE ECO', 
                title: 'EKOLOJİK & GERİ DÖNÜŞÜM', 
                sub: 'Doğal bambu lifleri, geri dönüştürülmüş buğday samanı, mantar meşesi ve RPET kumaşlardan üretilen yenilikçi yeşil promosyon serisi. Gelecek nesillere yaşanabilir bir dünya bırakma hedefiyle çevre dostu, geri dönüştürülebilir ve biyolojik olarak parçalanabilir materyaller kullanılır. Ekolojik tohumlu kalemlerden bambu gövdeli hesap makinelerine ve jüt bez çantalara kadar geniş bir ürün yelpazesi sunar. Markanızın çevreye duyarlı, sürdürülebilir ve toplumsal sorumluluk sahibi kimliğini en samimi şekilde topluma duyurur. Sıcak doğal ahşap dokusu ve organik renk tonlarıyla modern tüketicilerin kalbinde derin bir güven duygusu uyandırır. Doğanın gücünü ve yeşil dönüşüm vizyonunuzu kurumsal hediyelerinizle buluşturun.', 
                bg: '#17281c', 
                image: 'resim/main_9.webp' 
            }
        ];

        // E-Ticaret Ürün Kataloğu (resim/sitedengelenler/ klasöründeki yüksek kaliteli ürünler)
        this.featuredProducts = [
            {
                id: 'prod_1',
                code: 'PRM-201',
                name: 'MagSafe Dijital Powerbank',
                badge: 'Sale',
                badgeType: 'sale',
                price: '$ 56.20',
                rating: 5,
                category: 'TEKNOLOJİ',
                categoryId: 'tech',
                image: 'resim/sitedengelenler/1.webp'
            },
            {
                id: 'prod_2',
                code: 'PRM-202',
                name: 'Kompakt Askılı Powerbank',
                badge: 'New',
                badgeType: 'new',
                price: '$ 56.20',
                rating: 4,
                category: 'TEKNOLOJİ',
                categoryId: 'tech',
                image: 'resim/sitedengelenler/2.webp'
            },
            {
                id: 'prod_3',
                code: 'PRM-203',
                name: 'Altın Varaklı Osmanlı Arması',
                badge: 'New',
                badgeType: 'new',
                price: '$ 56.20',
                rating: 5,
                category: 'VIP SETLER',
                categoryId: 'vip',
                image: 'resim/sitedengelenler/3.webp'
            },
            {
                id: 'prod_4',
                code: 'PRM-204',
                name: 'Kadife Kutulu Ay Yıldız Plaket',
                badge: 'Sale',
                badgeType: 'sale',
                price: '$ 56.20',
                rating: 5,
                category: 'VIP SETLER',
                categoryId: 'vip',
                image: 'resim/sitedengelenler/5.webp'
            },
            {
                id: 'prod_5',
                code: 'PRM-205',
                name: 'Lüks Kutulu Fincan Takımı',
                badge: 'New',
                badgeType: 'new',
                price: '$ 56.20',
                rating: 4,
                category: 'VIP SETLER',
                categoryId: 'vip',
                image: 'resim/sitedengelenler/6.webp'
            },
            {
                id: 'prod_6',
                code: 'PRM-206',
                name: 'Kulplu Çelik Termos Kupa',
                badge: 'Sale',
                badgeType: 'sale',
                price: '$ 56.20',
                rating: 4,
                category: 'TERMOS',
                categoryId: 'thermos',
                image: 'resim/sitedengelenler/7.webp'
            },
            {
                id: 'prod_7',
                code: 'PRM-207',
                name: 'Mat Siyah Vakumlu Termos',
                badge: null,
                badgeType: null,
                price: '$ 56.20',
                rating: 5,
                category: 'TERMOS',
                categoryId: 'thermos',
                image: 'resim/sitedengelenler/8.webp'
            },
            {
                id: 'prod_8',
                code: 'PRM-208',
                name: 'Haki Askeri Çelik Matara',
                badge: 'New',
                badgeType: 'new',
                price: '$ 56.20',
                rating: 4,
                category: 'TERMOS',
                categoryId: 'thermos',
                image: 'resim/sitedengelenler/9.webp'
            }
        ];
    }

    getCategoryInfo() {
        return { ...this.categoryInfo };
    }

    getOtherCategories() {
        return [...this.otherCategories];
    }

    getFeaturedProducts() {
        return [...this.featuredProducts];
    }

    getZoomLayers() {
        return [...this.zoomLayers];
    }

    getCubeFlips() {
        return {
            flip1: { ...this.cubeFlip1 },
            flip2: { ...this.cubeFlip2 }
        };
    }

    getHeroProduct() {
        return { ...this.heroProduct };
    }

    getAllImageUrls() {
        return [
            'resim/degistirilecek_gorsel.jpeg',
            'resim/main_1.webp',
            'resim/main_2.webp',
            'resim/main_3.webp',
            'resim/main_4.webp',
            'resim/main_5.webp',
            'resim/main_6.webp',
            'resim/main_7.webp',
            'resim/main_8.webp',
            'resim/main_9.webp',
            'resim/main_10.webp'
        ];
    }
}
