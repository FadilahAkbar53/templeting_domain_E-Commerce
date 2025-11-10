# Brand Management Feature

## Overview

Sistem manajemen brand telah ditambahkan untuk mencegah typo dan menjaga konsistensi data brand pada produk sepatu. Sekarang admin harus menambahkan brand terlebih dahulu sebelum membuat produk baru.

## Perubahan yang Dilakukan

### Backend

#### 1. Model Brand (`backend/models/Brand.js`)

```javascript
{
  name: String (unique, required),
  logo: String (URL),
  description: String,
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Controller Brand (`backend/controllers/brandController.js`)

5 endpoint utama:

- `GET /api/brands` - Public: Mendapatkan semua brand aktif
- `GET /api/brands/admin` - Admin: Mendapatkan semua brand dengan jumlah produk
- `POST /api/brands` - Admin: Membuat brand baru (dengan validasi duplikat)
- `PUT /api/brands/:id` - Admin: Update brand (cascade update ke produk)
- `DELETE /api/brands/:id` - Admin: Hapus brand (validasi tidak ada produk)

#### 3. Routes Brand (`backend/routes/brandRoutes.js`)

- Public route: `GET /`
- Admin routes (protected): `GET /admin`, `POST /`, `PUT /:id`, `DELETE /:id`

#### 4. Seed Script (`backend/seedBrands.js`)

Script untuk mengisi database dengan brand populer:

- Nike
- Adidas
- Puma
- New Balance
- Converse
- Vans
- Reebok

### Frontend

#### 1. Brand Management Page (`pages/admin/BrandManagementPage.tsx`)

Halaman admin untuk CRUD brand dengan fitur:

- Grid layout dengan card brand
- Status active/inactive toggle
- Jumlah produk per brand
- Modal form untuk create/edit
- Konfirmasi delete dengan validasi

#### 2. Product Form Modal (`components/ProductFormModal.tsx`)

Diubah dari text input ke dropdown:

- Fetch brand dari API saat modal dibuka
- Dropdown select untuk memilih brand
- Validasi jika belum ada brand
- Pesan untuk menambah brand di Brand Management

#### 3. Admin Layout (`components/AdminLayout.tsx`)

Ditambahkan menu baru:

- Menu "Brands" dengan icon tag
- Posisi antara Products dan Users

#### 4. Admin Panel (`pages/AdminPanel.tsx`)

Routing ditambahkan:

- Case "brands" menampilkan BrandManagementPage

## Cara Menggunakan

### 1. Seed Initial Brands

Jalankan script untuk mengisi brand awal:

```bash
cd backend
node seedBrands.js
```

### 2. Akses Brand Management

1. Login sebagai admin
2. Klik menu "Brands" di sidebar
3. Kelola brand (Create, Edit, Toggle Active, Delete)

### 3. Tambah Brand Baru

1. Klik tombol "Add New Brand"
2. Isi form:
   - Name (required, unique)
   - Logo URL (optional)
   - Description (optional)
   - Active status (default: true)
3. Klik "Add Brand"

### 4. Edit Brand

1. Klik tombol "Edit" pada card brand
2. Ubah data brand
3. Klik "Save Changes"
   **Note:** Jika nama brand diubah, semua produk dengan brand lama akan otomatis terupdate.

### 5. Delete Brand

1. Klik tombol "Delete" pada card brand
2. Sistem akan validasi apakah ada produk menggunakan brand ini
3. Jika ada produk, delete akan ditolak dengan pesan error
4. Jika tidak ada produk, konfirmasi delete akan muncul

### 6. Toggle Active Status

1. Klik tombol "Deactivate" atau "Activate"
2. Brand inactive tidak akan muncul di dropdown product form
3. Brand dapat diaktifkan kembali kapan saja

### 7. Membuat Produk dengan Brand

1. Di Product Management, klik "Add Product"
2. Pilih brand dari dropdown (bukan text input lagi)
3. Jika belum ada brand, akan muncul pesan untuk tambah brand dulu
4. Isi form lainnya dan save

## Validasi dan Business Logic

### Backend Validations

1. **Create Brand:**

   - Nama harus unique (case-insensitive)
   - Jika duplikat, return 400 dengan pesan error

2. **Update Brand:**

   - Validasi ID brand exist
   - Jika nama diubah, cascade update ke semua produk
   - Update `updatedAt` timestamp

3. **Delete Brand:**

   - Cek apakah ada produk menggunakan brand ini
   - Jika ada, return 400 dengan jumlah produk
   - Jika tidak ada, allow delete

4. **Get Brands Admin:**
   - Return semua brand dengan jumlah produk
   - Aggregate count dari collection products

### Frontend Validations

1. **Product Form:**

   - Brand field required
   - Harus pilih dari dropdown (tidak bisa input manual)
   - Jika tidak ada brand, disable form dengan pesan

2. **Brand Form:**

   - Name required
   - Logo dan description optional
   - Loading state saat fetch/save

3. **Delete Confirmation:**
   - Modal konfirmasi sebelum delete
   - Tampilkan jumlah produk jika ada
   - Disable delete button jika sedang loading

## Testing Checklist

### Backend Testing

- [ ] GET /api/brands - Return hanya brand aktif
- [ ] GET /api/brands/admin - Return semua brand dengan product count
- [ ] POST /api/brands - Create brand baru
- [ ] POST /api/brands (duplicate) - Return error 400
- [ ] PUT /api/brands/:id - Update brand dan cascade ke produk
- [ ] DELETE /api/brands/:id (dengan produk) - Return error 400
- [ ] DELETE /api/brands/:id (tanpa produk) - Success delete

### Frontend Testing

- [ ] Brand Management Page load dengan semua brand
- [ ] Create new brand via modal
- [ ] Edit brand dan lihat perubahan
- [ ] Toggle active/inactive brand
- [ ] Delete brand yang tidak dipakai
- [ ] Coba delete brand yang sedang dipakai (harus error)
- [ ] Product form hanya tampilkan brand aktif
- [ ] Product form tampilkan pesan jika belum ada brand

## API Endpoints Summary

### Public Endpoints

```
GET /api/brands
```

Response: Array of active brands

```json
[
  {
    "_id": "...",
    "name": "Nike",
    "logo": "https://...",
    "description": "...",
    "isActive": true
  }
]
```

### Admin Endpoints (Requires Authentication + Admin Role)

```
GET /api/brands/admin
```

Response: Array of all brands with product count

```json
[
  {
    "_id": "...",
    "name": "Nike",
    "logo": "https://...",
    "description": "...",
    "isActive": true,
    "productCount": 15
  }
]
```

```
POST /api/brands
```

Body:

```json
{
  "name": "Nike",
  "logo": "https://...",
  "description": "...",
  "isActive": true
}
```

```
PUT /api/brands/:id
```

Body: Same as POST

```
DELETE /api/brands/:id
```

No body needed

## Struktur File Baru

```
backend/
  models/
    Brand.js (NEW)
  controllers/
    brandController.js (NEW)
  routes/
    brandRoutes.js (NEW)
  seedBrands.js (NEW)

pages/
  admin/
    BrandManagementPage.tsx (NEW)

components/
  ProductFormModal.tsx (MODIFIED - dropdown instead of text)
  AdminLayout.tsx (MODIFIED - added brands menu)

pages/
  AdminPanel.tsx (MODIFIED - added brands routing)
```

## Future Enhancements

Beberapa improvement yang bisa ditambahkan:

1. **Brand Statistics:** Dashboard per brand dengan sales metrics
2. **Brand Image Upload:** Upload logo ke cloud storage (AWS S3, Cloudinary)
3. **Brand Slug:** URL-friendly slug untuk brand page
4. **Brand Categories:** Kategorisasi brand (Sports, Casual, Luxury, etc.)
5. **Brand Sorting:** Sort brand by name, product count, created date
6. **Brand Search:** Search bar di brand management
7. **Brand Pagination:** Pagination jika brand sudah banyak
8. **Brand Bulk Actions:** Select multiple brands untuk bulk activate/deactivate
9. **Brand History:** Track perubahan brand (audit log)
10. **Brand SEO:** Meta description dan keywords per brand

## Troubleshooting

### Brand tidak muncul di dropdown product form

- Pastikan brand memiliki `isActive: true`
- Check network tab untuk API call `/api/brands`
- Pastikan backend running di port 5000

### Error saat delete brand

- Brand masih digunakan oleh produk
- Hapus/ubah produk yang menggunakan brand tersebut terlebih dahulu
- Atau ubah status brand menjadi inactive

### Seed script error

- Pastikan MongoDB connection string benar di `.env`
- Pastikan MongoDB Atlas cluster bisa diakses
- Check firewall/whitelist IP di MongoDB Atlas

### TypeScript errors

- Run `npm install` di root folder
- Restart VS Code TypeScript server
- Check import paths di AdminPanel.tsx

## Contact

Jika ada pertanyaan atau issue, silakan buat issue di repository atau kontak developer.
