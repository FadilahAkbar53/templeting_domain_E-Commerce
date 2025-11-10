# OneDering Shoes Store

Dokumentasi singkat proyek e‑commerce front-end ini. Aplikasi dibuat dengan React + TypeScript dan Vite. README ini menjelaskan struktur file, komponen utama, dan fitur yang sudah diimplementasikan.

## Ringkasan proyek

Project ini adalah contoh toko sepatu (front-end) yang menggunakan struktur komponen tersendiri, konteks untuk theme dan region, hooks khusus, serta beberapa halaman (home, detail produk, users, wishlist). Fokusnya adalah modularitas komponen, state management sederhana melalui React Context, dan utilitas layanan untuk data/export.

Teknologi utama:

- React
- TypeScript
- Vite

## Cara menjalankan (lokal)

Prerequisite: Node.js (disarankan LTS terbaru)

1. Pasang dependensi:

   npm install

2. Jalankan server development:

   npm run dev

Catatan: file konfigurasi (mis. .env) tidak disertakan di repo ini — tambahkan variabel lingkungan jika diperlukan oleh layanan eksternal.

## Struktur proyek (intinya)

Root

- `index.html` — entry HTML
- `index.tsx` — bootstrap aplikasi
- `App.tsx` — routing / wrapper utama
- `vite.config.ts`, `tsconfig.json`, `package.json`
- `types.ts` — definisi tipe/utility types

Direktori penting

- `components/` — komponen UI yang dapat digunakan ulang

  - `Header.tsx` — header aplikasi / navigasi
  - `Footer.tsx` — footer
  - `Layout.tsx` — layout umum untuk halaman
  - `Region.tsx` — UI terkait region (pemilihan wilayah)
  - `Sidebar.tsx` — sidebar navigasi atau filter
  - `ThemeSwitcher.tsx` — tombol pengubah tema (light/dark)
  - `UsersTable.tsx` — tabel untuk menampilkan daftar pengguna

- `contexts/` — React Context untuk state global

  - `ThemeContext.tsx` — mengatur tema aplikasi (light/dark)
  - `RegionContext.tsx` — mengatur region/locale saat ini

- `hooks/` — custom hooks

  - `useTheme.ts` — hook untuk mengakses/mengubah tema
  - `useRegions.ts` — hook untuk bekerja dengan region data

- `pages/` — halaman aplikasi

  - `HomePage.tsx` — halaman utama / katalog
  - `ProductDetailPage.tsx` — detail produk
  - `UsersPage.tsx` — tampilan dan manajemen pengguna
  - `WishlistPage.tsx` — daftar wishlist pengguna

- `plugins/`

  - `SamplePluginWidget.tsx` — contoh widget/plugin modular

- `services/`
  - `dataService.ts` — lapisan akses data (mock/HTTP)
  - `exportService.ts` — utilitas ekspor data (mis. CSV/JSON)

## Komponen & modules — penjelasan singkat

- Header/Footer: komponen UI dasar untuk navigasi dan informasi kaki halaman.
- Layout: membungkus halaman dengan header/footer/sidebar.
- Region / `RegionContext`: memungkinkan aplikasi menyimpan pilihan wilayah (berguna untuk harga/localization atau pilihan region). `Region.tsx` kemungkinan menampilkan dropdown/selector.
- ThemeSwitcher / `ThemeContext`: menyediakan dukungan tema gelap/terang lewat konteks dan hook `useTheme`.
- UsersTable: tabel interaktif untuk menampilkan data pengguna (digunakan di `UsersPage`).
- WishlistPage: halaman yang menampilkan produk yang disimpan user.
- ProductDetailPage: halaman untuk melihat detail produk termasuk gambar, deskripsi, dan aksi (tambah ke wishlist/keranjang).
- services/dataService: lapisan abstraksi akses data — bisa berisi mock data atau fetch ke API.
- services/exportService: fitur ekspor data (mis. unduh CSV) untuk data pengguna atau laporan.

## Fitur yang sudah diimplementasikan

- Theme switching (light/dark) menggunakan React Context dan hook (`ThemeContext.tsx`, `ThemeSwitcher.tsx`, `useTheme.ts`).
- Region management: menentukan/mengganti region melalui `RegionContext` dan hook `useRegions.ts`.
- Halaman utama (`HomePage`) untuk menampilkan katalog produk dasar.
- Halaman detail produk (`ProductDetailPage`) dengan informasi produk.
- Wishlist: halaman dan alur untuk menyimpan produk ke wishlist (`WishlistPage`).
- Users page dengan tabel (`UsersPage`, `UsersTable.tsx`) — menampilkan daftar pengguna.
- Plugin/widget sample (`plugins/SamplePluginWidget.tsx`) sebagai contoh arsitektur ekstensi.
- Layanan ekspor (`exportService.ts`) untuk ekspor data (mis. CSV/JSON).
- Struktur TypeScript (tipe terpusat di `types.ts`).

Catatan: daftar fitur di atas didasarkan pada struktur file — beberapa fungsi (mis. panggilan API nyata, otentikasi, pembayaran) mungkin hanya menggunakan mock atau belum terhubung ke back-end.

## Kontrak singkat (inputs/outputs) — untuk developer

- Input: sumber data produk/pengguna (mock atau API)
- Output: tampilan UI (katalog, detail produk, wishlist, users table)
- Error modes: jika dataService menggunakan fetch, tampilkan fallback UI/loader; saat ekspor, fallback jika tidak ada data.

Edge cases umum:

- Tidak ada produk / daftar kosong — tampilkan pesan informatif.
- Region atau tema tidak tersimpan — gunakan nilai default (mis. region=default, theme=light).
- Ekspor saat tidak ada data — tampilkan peringatan.

## Cara berkontribusi singkat

1. Fork repository
2. Buat branch fitur: `git checkout -b feat/nama-fitur`
3. Tambah/ubah kode dan test secara lokal
4. Buat PR ke branch `main` dengan deskripsi perubahan

## Saran pengembangan lanjutan (opsional)

- Sambungkan `dataService` ke API back-end sesungguhnya.
- Tambahkan manajemen state lebih besar (mis. Redux / Zustand) jika aplikasi tumbuh.
- Tambahkan unit/integration tests (Jest + React Testing Library).
- Tambahkan e2e tests (Playwright / Cypress) untuk alur penting.
- Dokumentasikan komponen publik dengan Storybook.

## Lisensi

Cantumkan lisensi proyek sesuai kebutuhan (mis. MIT). Jika belum, tambahkan file `LICENSE`.

---

Jika ingin, saya bisa:

- menambahkan badge, CI (GitHub Actions) untuk build/test, atau
- membuat dokumentasi komponen (Storybook) atau menambahkan contoh integrasi dataService.

Kabarikan jika mau saya tulis README dalam gaya lain (lebih teknis / lebih singkat), atau langsung commit perubahan tambahan.
