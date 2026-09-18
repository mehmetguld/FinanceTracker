<div align="center">

# 💎 FinanceTracker PRO

### Yeni Nesil, Çift Dilli, Yüksek Performanslı Kişisel Finans ve Bütçe Takip Uygulaması
*Next.js 16 (Turbopack) • TypeScript • Tailwind CSS • Dexie.js (IndexedDB) • Recharts • Framer Motion*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-E84E36?style=for-the-badge)](https://dexie.org/)
[![License](https://img.shields.io/badge/Lisans-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

**FinanceTracker PRO**, kullanıcıların gelir ve giderlerini anlık olarak takip edebildiği, dönemsel bütçe analizleri yapabildiği ve on binlerce işlem girilse dahi sıfır gecikmeyle (lag-free) çalışan, **%100 gizlilik odaklı (offline-first)** modern bir web uygulamasıdır.

[🌟 Özellikler](#-öne-çıkan-özellikler) • [📸 Modüller](#-uygulama-modülleri) • [🚀 Kurulum](#-hızlı-kurulum) • [⌨️ Kısayollar](#️-klavye-kısayolları) • [📄 Lisans](#-lisans)

</div>

---

## 🌟 Öne Çıkan Özellikler

### ⚡ 1. 20-30 Yıllık Kesintisiz Yerel Performans
- Verileriniz harici hiçbir sunucuya (Firebase, Supabase vb.) gönderilmez; doğrudan tarayıcınızın kendi **IndexedDB** veritabanında **Dexie.js B-Tree bileşik indeksleri** ile saklanır.
- On binlerce işlem kaydında bile arama, filtreleme ve sayfalama mikrosaniyeler içinde gerçekleşir.

### 🌐 2. Tam Kapsamlı Çift Dil Desteği (Türkçe 🇹🇷 & English 🇬🇧)
- Sıfır dış paket hamallığıyla çalışan hafif, anlık reaktif i18n dil motoru.
- Hem üst menüdeki `🇹🇷 TR / 🇬🇧 EN` butonundan hem de Ayarlar sayfasından tek tıkla dil değiştirilebilir.
- Sayfa başlıkları, grafikler, ay/tarih formatları ve raporlar seçilen dile dinamik olarak adapte olur.

### 📊 3. Çift Yönlü Dinamik Grafikler & Finansal Analiz
- **Kategori Dağılımı (Halka / Donut Grafik)**: Hem **Gider** hem de **Gelir** dağılımını tek tıkla inceleme imkanı.
- **Nakit Akışı Eğrisi (Alan / Area Grafik)**: Zaman ekseninde Gelir (Yeşil) ve Gider (Kırmızı) hareketlerini eşzamanlı çift eğri olarak izleme.
- **Denge Karşılaştırması (Çubuk / Bar Grafik)**: Toplam nakit giriş ve çıkışının net karşılaştırması.

### ⚡ 4. Hızlı Tarih ve Periyot Filtreleme
- **`⚡ Bugün` Butonu**: Tek tıkla sadece o günün gelir ve giderlerine odaklanma.
- **Dönem Sekmeleri**: *Bu Hafta*, *Bu Ay*, *Bu Yıl*, *Tüm Zamanlar*, *Özel Tarih Aralığı* ve *Belirli Güne Git*.

### 🔒 5. Gizlilik Modu (Bakiye Maskeleme)
- Kalabalık ortamlarda veya ekran paylaşırken tek tıkla (`👁️` butonu) tüm finansal tutarları `••••••` şeklinde anında gizleme.

### 💾 6. Tek Tıkla Yedekleme & Eski Tekinex İçe Aktarma
- **JSON Yedekleme**: Tüm veritabanını tek tıkla JSON dosyası olarak indirme ve dilediğiniz zaman geri yükleme.
- **Eski Sistem Göçü (Legacy Migrator)**: Eski tek dosyalık `tekinex.html` JSON yedeklerini otomatik algılar, dönüştürür ve yeni mimariye eksiksiz taşır.

### 📗 7. Profesyonel Excel (.xls) ve CSV Çıktısı
- Renklendirilmiş başlıklar, otomatik `=TOPLA()` formülleri ve hücre çizgileri içeren **gerçek Microsoft Excel tablosu (.xls)** çıktısı.
- Türkçe Windows Excel uyumlu noktalı virgül (`;`) ve virgüllü ondalık formatlı CSV dökümü.
- Yazdırılabilir tek sayfalık resmi PDF finansal döküm raporu.

### 🎨 8. Aydınlık ve Karanlık Tema (Dark / Light Mode)
- Göz yormayan şık koyu tema ve ferah açık tema arasında tek tıkla geçiş.

---

## 📸 Uygulama Modülleri

| Modül | Açıklama |
| :--- | :--- |
| **🏠 Finansal Özet (Dashboard)** | Toplam gelir, toplam gider, net bakiye kartları, AI finansal içgörüleri ve hızlı işlem listesi. |
| **💳 İşlem Geçmişi (Transactions)** | Gerçek zamanlı arama, gelir/gider tür filtreleme, excel/csv indirme ve sayfalama. |
| **📈 Grafikler & Analiz (Analytics)** | Çift eğrili akış grafiği, halka dağılım ve kategori bazında sıralama tabloları. |
| **🏷️ Kategori Yönetimi (Categories)** | Özel renk paletli kategori oluşturma, net bakiye takibi ve silme esnasında işlem taşıma. |
| **⚙️ Yedekleme & Ayarlar (Settings)** | Dil tercihi (TR/EN), JSON yedek alma/yükleme, veri dışa aktarma ve veritabanı sıfırlama. |

---

## ⌨️ Klavye Kısayolları

| Kısayol | Eylem |
| :--- | :--- |
| `Ctrl + N` / `Cmd + N` | Herhangi bir sayfadayken anında **Yeni İşlem Ekle** modalını açar |
| `Escape` | Açık olan herhangi bir modal veya açılır pencereyi kapatır |

---

## 🛠️ Teknoloji Yığını

- **Çekirdek**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Dil**: [TypeScript](https://www.typescriptlang.org/)
- **Stil & Tasarım**: [Tailwind CSS v4](https://tailwindcss.com/) & Özel CSS Tema Motoru
- **Animasyonlar & Etkileşim**: [Framer Motion](https://www.framer.com/motion/) (Shake doğrulaması, yay efektleri)
- **Görsel Grafikler**: [Recharts](https://recharts.org/)
- **İkon Seti**: [Lucide React](https://lucide.dev/)
- **İstemci Veritabanı**: [Dexie.js](https://dexie.org/) (IndexedDB B-Tree API)

---

## 🚀 Hızlı Kurulum

Projeyi bilgisayarınızda yerel olarak çalıştırmak için:

### Gereksinimler
- **Node.js**: `v18.18+` veya üzeri
- **npm** veya **pnpm** / **yarn**

### Adımlar

1. **Repoyu Klonlayın:**
   ```bash
   git clone https://github.com/mehmetguld/FinanceTracker.git
   cd FinanceTracker
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```

4. **Tarayıcınızda Açın:**
   ```
   http://localhost:3000
   ```

### 📦 Canlıya Alma (Production Build)
Projeyi derleyip optimize edilmiş prodüksiyon sürümünü test etmek için:
```bash
npm run build
npm run start
```

---

## 📁 Proje Dizin Yapısı

```text
FinanceTracker/
├── src/
│   ├── app/                      # Next.js 16 App Router sayfaları
│   │   ├── page.tsx              # Ana sayfa & Finansal Özet
│   │   ├── transactions/         # İşlem Geçmişi sayfası
│   │   ├── analytics/            # Grafikler & Finansal Analiz
│   │   ├── categories/           # Kategori Yönetimi
│   │   ├── settings/             # Yedekleme, Ayarlar & Dil Seçimi
│   │   └── layout.tsx            # Kök layout ve tema/dil sarmalayıcıları
│   ├── components/
│   │   ├── charts/               # Recharts tabanlı çift eğrili ve halka grafikler
│   │   ├── dashboard/            # Özet kartları, dönem seçici, AI analizleri
│   │   ├── layout/               # Navbar, alt mobil menü, tema/dil seçici
│   │   ├── transactions/         # İşlem listesi, shake animasyonlu ekleme modalı
│   │   ├── categories/           # Kategori yönetici kartları ve taşıma modalları
│   │   └── ui/                   # Portal tabanlı modallar, toast ve onay kutuları
│   ├── context/
│   │   ├── LanguageContext.tsx   # Reaktif TR/EN dil sağlayıcısı
│   │   ├── ThemeContext.tsx      # Aydınlık / Karanlık tema sağlayıcısı
│   │   ├── PrivacyContext.tsx    # Bakiye gizleme / Gizlilik modu
│   │   └── ModalContext.tsx      # Global işlem ekleme penceresi
│   ├── locales/
│   │   ├── tr.ts                 # Türkçe çeviri sözlüğü
│   │   └── en.ts                 # İngilizce çeviri sözlüğü
│   ├── lib/
│   │   ├── db.ts                 # Dexie.js veritabanı şeması ve hızlı sorgular
│   │   ├── utils.ts              # Para/tarih formatlayıcılar ve Excel motoru
│   │   └── legacy-import.ts      # Eski tekinex.html verilerini içeri aktarıcı
│   └── types/
│       └── index.ts              # TypeScript tip tanımları ve arayüzler
├── public/                       # Statik varlıklar ve ikonlar
├── LICENSE                       # MIT Lisansı
└── README.md                     # Proje dokümantasyonu
```

---

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak olarak lisanslanmıştır.

Geliştirici: **[mehmetguld](https://github.com/mehmetguld)**
