# Dokumentasi Pemisahan Sistem Admin dan User

## 📋 Overview

Dokumentasi ini menjelaskan perubahan yang telah dilakukan untuk memisahkan sistem admin dan user dalam aplikasi OneDering Shoes Store.

## 🎯 Permasalahan yang Dipecahkan

1. **Wishlist tercampur** - Wishlist user dan admin tersimpan di localStorage yang sama
2. **Routing tidak terpisah** - Admin dan user menggunakan layout yang sama
3. **Tidak ada isolasi data** - Data wishlist tidak ter-asosiasi dengan user tertentu

## ✅ Solusi yang Diimplementasikan

### 1. Backend Changes

#### a. Update User Model (`backend/models/User.js`)

```javascript
// Tambah field wishlist dan cart ke User Schema
wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
cart: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
}]
```

#### b. Wishlist Controller Baru (`backend/controllers/wishlistController.js`)

- `GET /api/wishlist` - Ambil wishlist user yang sedang login
- `POST /api/wishlist/:productId` - Tambah produk ke wishlist
- `DELETE /api/wishlist/:productId` - Hapus produk dari wishlist

#### c. Wishlist Routes (`backend/routes/wishlistRoutes.js`)

- Semua route protected dengan middleware `protect`
- Wishlist per-user berdasarkan JWT token

#### d. Update `backend/index.js`

```javascript
const wishlistRoutes = require("./routes/wishlistRoutes");
app.use("/api/wishlist", wishlistRoutes);
```

### 2. Frontend Changes

#### a. AdminLayout Component Baru (`components/AdminLayout.tsx`)

- Layout khusus untuk admin
- Header dengan branding "OneDering Admin"
- Tombol logout terpisah
- Footer admin panel
- **Tidak ada sidebar navigasi user**

#### b. Update AdminPage (`pages/AdminPage.tsx`)

- Sekarang menggunakan `<AdminLayout>` wrapper
- Tampilan terpisah dari user interface
- Hanya bisa diakses oleh role admin

#### c. Update WishlistContext (`contexts/RegionContext.tsx`)

**Sebelum:**

```typescript
// Menyimpan wishlist di localStorage
const [wishlist, setWishlist] = useState<string[]>(() => {
  const item = window.localStorage.getItem("wishlist");
  return item ? JSON.parse(item) : [];
});
```

**Sesudah:**

```typescript
// Wishlist dari backend API dengan authentication
const fetchWishlist = async () => {
  const token = userData.token;
  const response = await fetch("/api/wishlist", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // ...
};
```

**Perubahan Method:**

- `addToWishlist` - Sekarang `async` dan call API
- `removeFromWishlist` - Sekarang `async` dan call API
- `fetchWishlist` - Method baru untuk fetch wishlist dari server
- Tambah `loading` state

#### d. Update App.tsx (Router Logic)

**Key Changes:**

```typescript
// Auto redirect admin ke admin page
useEffect(() => {
  if (user?.role === "admin") {
    setActivePage("admin");
  }
}, [user]);

// Admin tidak melihat layout user
if (user.role === "admin") {
  return pageContent; // AdminPage dengan AdminLayout
}

// User biasa melihat Layout normal
return (
  <>
    <PromotionsWidget />
    <Layout setActivePage={handlePageChange} activePage={activePage}>
      {pageContent}
    </Layout>
  </>
);
```

#### e. Update Types (`types.ts`)

```typescript
// Product menggunakan _id sesuai MongoDB
export interface Product {
  _id: string; // Dulu: id: number
  // ...
}

// Tambah User interface
export interface User {
  id: string;
  username: string;
  role: "user" | "admin";
  token: string;
}
```

#### f. Sidebar (`components/Sidebar.tsx`)

- Menu "Admin Panel" hanya muncul jika `user?.role === 'admin'`
- User biasa tidak bisa melihat link admin

## 🔐 Security Features

### 1. Backend Protection

- Semua wishlist routes menggunakan middleware `protect`
- Verifikasi JWT token untuk setiap request
- Wishlist hanya bisa diakses oleh pemiliknya

### 2. Frontend Protection

- Redirect admin ke admin panel saat login
- User biasa tidak bisa akses halaman admin
- Alert "Access denied" jika user coba akses admin page

## 📊 Flow Diagram

### User Login Flow

```
User Login → Role: 'user'
    ↓
Regular Layout dengan Sidebar
    ↓
- Home
- Products
- Wishlist (data dari API per-user)
- Cart
```

### Admin Login Flow

```
Admin Login → Role: 'admin'
    ↓
AdminLayout (no sidebar)
    ↓
Product Management Panel
    ↓
- View All Products
- Add/Edit/Delete Products
- No access to wishlist/cart
```

## 🧪 Testing Checklist

### Backend Testing

```bash
# Login as user
POST /api/users/login
{ "username": "user1", "password": "password" }

# Add to wishlist (dengan token user1)
POST /api/wishlist/PRODUCT_ID
Headers: { "Authorization": "Bearer TOKEN" }

# Get wishlist (hanya melihat wishlist user1)
GET /api/wishlist
Headers: { "Authorization": "Bearer TOKEN" }
```

### Frontend Testing

1. **Login sebagai User**

   - ✅ Melihat layout normal dengan sidebar
   - ✅ Bisa akses Home, Products, Wishlist, Cart
   - ✅ Tidak melihat menu "Admin Panel"
   - ✅ Wishlist tersimpan per-user

2. **Login sebagai Admin**

   - ✅ Auto redirect ke Admin Panel
   - ✅ Melihat AdminLayout (tidak ada sidebar)
   - ✅ Bisa manage products
   - ✅ Logout langsung dari header admin

3. **Wishlist Isolation**
   - ✅ User A menambah wishlist → hanya muncul di akun User A
   - ✅ User B menambah wishlist → hanya muncul di akun User B
   - ✅ Admin tidak memiliki wishlist

## 🚀 Cara Deploy/Run

### 1. Restart Backend

```bash
cd backend
npm start
```

### 2. Restart Frontend

```bash
npm run dev
```

### 3. Test dengan Akun

**User Account:**

- Username: `user`
- Password: `user123`
- Role: `user`

**Admin Account:**

- Username: `admin`
- Password: `admin123`
- Role: `admin`

## 📝 Migration Notes

### Data Migration

Jika ada wishlist lama di localStorage, data akan hilang karena sekarang menggunakan database. Untuk migrate:

1. Backup wishlist dari localStorage
2. Login sebagai user
3. Manually add products ke wishlist lagi

### Breaking Changes

- Wishlist sekarang memerlukan authentication
- Admin tidak bisa menggunakan wishlist
- Layout admin terpisah total dari user

## 🔧 Future Improvements

1. **Admin Dashboard**

   - Tambah statistics panel
   - User management
   - Order management

2. **User Features**

   - Multiple wishlist (public/private)
   - Share wishlist
   - Wishlist notifications

3. **Cart Integration**
   - Move cart ke database (seperti wishlist)
   - Cart persistence across devices
   - Save for later feature

## 📞 Support

Jika ada issue atau pertanyaan:

1. Check console browser untuk error
2. Check terminal backend untuk API errors
3. Verify JWT token di localStorage

---

**Last Updated:** November 9, 2025
**Version:** 2.0.0
