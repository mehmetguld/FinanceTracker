# ⚡ FinanceTracker PRO

> Modern, ultra-fast, offline-first personal finance tracker built with Next.js 16 (Turbopack), TypeScript, Tailwind CSS, and Dexie.js (IndexedDB). Engineered for 20-30+ years of high-volume financial data with zero performance degradation.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Dexie.js](https://img.shields.io/badge/Dexie.js-IndexedDB-orange?style=flat-square)](https://dexie.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

---

## 🌟 Key Features

- **⚡ 20-30 Year Lag-Free Local Database**: Built on IndexedDB using Dexie.js with B-Tree compound indices (`[yearMonth+type]`, `date`, `category`). Tens of thousands of records load in under 10ms with zero memory bloat.
- **🔒 100% Offline & Private**: Zero cloud dependencies, zero external tracking. Your financial data stays strictly on your device. Includes instant Privacy Mode (`••••••` balance masking).
- **🌐 Bilingual (Turkish 🇹🇷 & English 🇬🇧)**: Fully localized reactive i18n engine with one-click language switching from the Navbar or Settings page.
- **📊 Comprehensive Financial Analytics**:
  - **Category Donut Chart**: Toggle between Income and Expense category distribution.
  - **Cash Flow Area Curve**: Simultaneous dual-curve visualization plotting both Income (emerald) and Expenses (rose) over time.
  - **Balance Bar Chart**: Periodical income vs. expense cash balance comparisons.
- **⚡ Quick Date Filtering**:
  - Direct **"⚡ Bugün" (Today)** filter for instant daily accounting.
  - Quick tabs: *Bu Hafta (This Week)*, *Bu Ay (This Month)*, *Bu Yıl (This Year)*, *Tüm Zamanlar (All Time)*, *Özel Aralık (Custom Range)*, and *Güne Git (Go to Date)*.
- **🏷️ Dynamic Category Management**:
  - Full CRUD for categories with custom color pickers.
  - Simultaneous tracking of Income, Expense, Net Balance, and Transaction counts per category.
  - Safe category deletion with transaction migration options.
- **📥 Backup & Seamless Migration**:
  - Single-click JSON backup and restore.
  - **Legacy Tekinex Importer**: Seamlessly imports and converts old single-file `tekinex.html` JSON backups into the modern database architecture.
- **📗 Formatted Excel & CSV Exports**:
  - Native styled Excel (`.xls`) spreadsheets with colors, gridlines, and automatic `=SUM()` total formulas.
  - Turkish Windows Excel compatible CSV (`sep=;\r\n`) with comma decimals.
  - Print-ready PDF financial report generator.
- **🌓 Dark & Light Mode**: Fluid theme engine with system/manual synchronization.
- **📱 Fully Responsive**: Fluid mobile bottom drawer navigation and desktop modal experiences with spring micro-interactions.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16 (App Router + Turbopack)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with CSS theme variables
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Local Database**: [Dexie.js](https://dexie.org/) (Client-side IndexedDB wrapper)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js 18.18+** installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mehmetguld/FinanceTracker.git
   cd FinanceTracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

To test and create an optimized production build:

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
Finance-Tracker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Main Financial Overview & Dashboard
│   │   ├── transactions/       # Transaction management page
│   │   ├── analytics/          # Deep-dive charts & ranking tables
│   │   ├── categories/         # Category organizer & stats
│   │   ├── settings/           # Backup, restore & language options
│   │   └── layout.tsx          # Root layout & providers
│   ├── components/
│   │   ├── charts/             # Dual-curve area & donut charts
│   │   ├── dashboard/          # Summary cards, period selector, AI insights
│   │   ├── layout/             # Responsive navbar & bottom navigation
│   │   ├── transactions/       # Transaction list & add/edit modal
│   │   ├── categories/         # Category manager & migration dialogs
│   │   └── ui/                 # Reusable modals, toast notifications, confirm dialogs
│   ├── context/
│   │   ├── LanguageContext.tsx # Bilingual TR/EN reactive i18n engine
│   │   ├── ThemeContext.tsx    # Dark/light theme manager
│   │   ├── PrivacyContext.tsx  # Balance masking context
│   │   └── ModalContext.tsx    # Global transaction modal state
│   ├── locales/
│   │   ├── tr.ts               # Turkish translation dictionary
│   │   └── en.ts               # English translation dictionary
│   ├── lib/
│   │   ├── db.ts               # IndexedDB schema & B-Tree queries (Dexie.js)
│   │   ├── utils.ts            # Currency, date, and Excel/.xls generators
│   │   └── legacy-import.ts    # Tekinex.html legacy data parser
│   └── types/
│       └── index.ts            # TypeScript interfaces & models
└── README.md
```

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

Developed with ❤️ by [mehmetguld](https://github.com/mehmetguld).
