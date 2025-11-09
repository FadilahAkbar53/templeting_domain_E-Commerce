# Order Management System - Complete Documentation

## 📦 Overview

Sistem order management telah berhasil diimplementasikan dengan lengkap, mencakup flow dari user memilih produk di cart, checkout dengan alamat dan metode pengiriman, hingga admin mengelola dan mengupdate status pesanan.

## ✨ Fitur Utama

### User Features:

1. **Checkbox Selection di Cart** - Pilih produk mana saja yang akan di-checkout
2. **Checkout Process** - Form lengkap untuk alamat, pilih kurir, dan metode pembayaran
3. **Order Tracking** - Lihat history pesanan dengan status tracking detail
4. **Cancel Order** - User bisa cancel pesanan dengan status pending/confirmed

### Admin Features:

1. **Order Management Dashboard** - Lihat semua pesanan dengan filter status
2. **Update Status** - Ubah status pesanan (pending → confirmed → shipped → completed)
3. **Order Details** - Lihat detail lengkap setiap pesanan
4. **Statistics** - Dashboard dengan statistik order

## 🔧 Technical Implementation

### Backend Structure

#### 1. Order Model (`backend/models/Order.js`)

```javascript
{
  user: ObjectId (ref User),
  orderNumber: String (auto-generated: ORD20241109XXXX),
  items: [
    {
      product: ObjectId,
      name, brand, image, price,
      quantity, size
    }
  ],
  shippingAddress: {
    fullName, phone, address,
    city, province, postalCode
  },
  shippingService: {
    name, cost, estimatedDays
  },
  paymentMethod: String,
  itemsPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  status: Enum (pending|confirmed|shipped|completed|cancelled),
  statusHistory: [{ status, note, updatedAt }],
  cancelReason: String
}
```

**Auto-generated Order Number Format:**

- `ORD` + `YYYYMMDD` + `####` (4 digit sequence)
- Contoh: `ORD202411090001`

#### 2. Order Controller (`backend/controllers/orderController.js`)

**User Endpoints:**

- `createOrder(req, res)` - Buat order baru

  - Validasi produk exist
  - Calculate total price
  - Auto-clear cart setelah order
  - Return order dengan orderNumber

- `getUserOrders(req, res)` - Ambil semua order user

  - Sorted by newest first
  - Populate product details

- `getOrderById(req, res)` - Get detail 1 order
  - Check ownership atau admin
- `cancelOrder(req, res)` - Cancel order
  - Only pending/confirmed status
  - Require cancel reason

**Admin Endpoints:**

- `getAllOrders(req, res)` - Semua order dengan pagination
  - Filter by status
  - Pagination support
- `updateOrderStatus(req, res)` - Update status order
  - Validate status transition
  - Add to statusHistory
  - Prevent update completed/cancelled orders
- `getOrderStats(req, res)` - Dashboard statistics
  - Count by status
  - Total revenue (completed orders only)
  - Recent orders

#### 3. Order Routes (`backend/routes/orderRoutes.js`)

```javascript
// User routes (protected)
POST   /api/orders              // Create order
GET    /api/orders/myorders     // Get user's orders
GET    /api/orders/:id          // Get order detail
PUT    /api/orders/:id/cancel   // Cancel order

// Admin routes (protected + admin)
GET    /api/orders/admin/stats  // Statistics
GET    /api/orders              // All orders
PUT    /api/orders/:id/status   // Update status
```

### Frontend Structure

#### 1. Cart Context (`contexts/CartContext.tsx`)

**New Interface:**

```typescript
interface CartItemWithSelection extends CartItem {
  selected: boolean;
  size?: number;
}
```

**Key Methods:**

- `addToCart(product, quantity, size)` - Tambah ke cart dengan size
- `toggleSelectItem(productId, size)` - Toggle checkbox item
- `toggleSelectAll()` - Select/deselect semua
- `getSelectedItems()` - Get items yang dicentang
- `getSelectedTotal()` - Total harga selected items
- `clearSelectedItems()` - Hapus items yang selected (after checkout)

**Local Storage:**

- Cart di-save ke localStorage
- Auto-load saat app start
- Persist across sessions

#### 2. Checkout Page (`pages/CheckoutPage.tsx`)

**Features:**

1. **Review Selected Products**

   - Tampilkan produk yang dipilih dari cart
   - Show name, brand, size, qty, price per item

2. **Shipping Address Form**

   - Full Name (required)
   - Phone Number (required)
   - Complete Address (required)
   - City, Province, Postal Code (required)

3. **Shipping Service Selection**

   - 6 pilihan kurir (JNE, JNT, SiCepat - Regular & Express)
   - Tampilkan ongkir dan estimasi pengiriman
   - Click card untuk select

4. **Payment Method**

   - 4 metode: COD, Bank Transfer, E-Wallet, Credit Card
   - Visual selection dengan highlight

5. **Order Summary**

   - Subtotal produk
   - Ongkos kirim
   - **Total** (sticky sidebar)

6. **Validations:**

   - Semua field address wajib diisi
   - Shipping service harus dipilih
   - Payment method harus dipilih
   - Alert jika ada yang kurang

7. **Submit Flow:**
   - POST ke `/api/orders`
   - Auto-clear selected items from cart
   - Navigate ke My Orders page
   - Show order number

#### 3. My Orders Page (`pages/MyOrdersPage.tsx`)

**Features:**

1. **Order List**

   - Tampilan card per order
   - Order number + tanggal pembuatan
   - Status badge dengan warna:
     - 🟡 Pending (Yellow)
     - 🔵 Confirmed (Blue)
     - 🟣 Shipped (Purple)
     - 🟢 Completed (Green)
     - 🔴 Cancelled (Red)

2. **Order Items Preview**

   - Product image, name, brand
   - Size, quantity, price per item
   - Total order

3. **Expandable Details**

   - Click "Lihat Detail" untuk expand
   - Full shipping address
   - Shipping service info
   - Payment method
   - **Status History Timeline:**
     - Setiap perubahan status tercatat
     - Dengan note dan timestamp
     - Visual timeline dengan dot berwarna

4. **Cancel Order**
   - Textarea untuk alasan pembatalan (required)
   - Hanya bisa cancel pending/confirmed
   - Konfirmasi sebelum cancel

#### 4. Order Management Page (Admin) (`pages/admin/OrderManagementPage.tsx`)

**Features:**

1. **Filter by Status**

   - Dropdown: All, Pending, Confirmed, Shipped, Completed, Cancelled
   - Auto-refresh saat filter change

2. **Order List (Admin View)**

   - Order number
   - Customer name & email
   - Creation date
   - Current status badge
   - Quick product preview (3 items + counter)
   - Item count & total price

3. **Quick Actions:**

   - "Update Status" button (if not completed/cancelled)
   - "Detail" button untuk expand

4. **Update Status Modal:**

   - Select new status (dropdown)
   - Optional note untuk status update
   - Validation:
     - Cannot update completed/cancelled orders
     - Status history automatically tracked
   - Confirmation before update

5. **Detailed View (Expanded):**

   - All product items with images
   - Complete shipping address
   - Shipping service details
   - Payment method
   - Full status history timeline
   - Customer information

6. **Pagination Support:**
   - 20 orders per page
   - Query param `?page=1&limit=20`

#### 5. Navigation & Routing Updates

**App.tsx:**

- Added `checkout` and `myOrders` to Page type
- CartPage updated dengan checkbox selection
- Navigate event listener untuk checkout flow
- Render CheckoutPage dan MyOrdersPage

**AdminLayout.tsx:**

- Added "Orders" menu item dengan icon clipboard
- Position: antara Brands dan Users

**AdminPanel.tsx:**

- Added OrderManagementPage import
- Added `case "orders"` di renderContent

**Header.tsx:**

- UserProfile dropdown sekarang accept `setActivePage` prop
- Added "My Orders" menu item
- Navigate ke myOrders page

## 📊 Order Status Flow

```
┌─────────┐
│ PENDING │ ← User creates order
└────┬────┘
     │
     ├→ CONFIRMED ← Admin confirms
     │      │
     │      ├→ SHIPPED ← Admin marks as shipped
     │      │      │
     │      │      └→ COMPLETED ← Admin marks as delivered
     │      │
     │      └→ CANCELLED ← Admin/User cancels
     │
     └→ CANCELLED ← User cancels immediately
```

**Status Transitions:**

- `pending` → `confirmed` | `cancelled`
- `confirmed` → `shipped` | `cancelled`
- `shipped` → `completed`
- `completed` → ❌ (final state)
- `cancelled` → ❌ (final state)

## 🚀 API Usage Examples

### 1. Create Order (User)

```javascript
POST /api/orders
Headers: Authorization: Bearer <token>
Body: {
  items: [
    { product: "product_id", quantity: 2, size: 42 }
  ],
  shippingAddress: {
    fullName: "John Doe",
    phone: "08123456789",
    address: "Jl. Merdeka No. 123",
    city: "Jakarta",
    province: "DKI Jakarta",
    postalCode: "12345"
  },
  shippingService: {
    name: "JNE Express",
    cost: 25000,
    estimatedDays: "1-2 hari"
  },
  paymentMethod: "COD"
}

Response: {
  _id: "...",
  orderNumber: "ORD202411090001",
  status: "pending",
  ...
}
```

### 2. Get My Orders (User)

```javascript
GET /api/orders/myorders
Headers: Authorization: Bearer <token>

Response: [
  {
    orderNumber: "ORD202411090001",
    status: "confirmed",
    totalPrice: 1250000,
    items: [...],
    statusHistory: [...]
  }
]
```

### 3. Get All Orders (Admin)

```javascript
GET /api/orders?status=pending&page=1&limit=20
Headers: Authorization: Bearer <token>

Response: {
  orders: [...],
  totalPages: 5,
  currentPage: 1,
  totalOrders: 95
}
```

### 4. Update Order Status (Admin)

```javascript
PUT /api/orders/:id/status
Headers: Authorization: Bearer <token>
Body: {
  status: "confirmed",
  note: "Pesanan telah dikonfirmasi, akan segera dikirim"
}

Response: {
  _id: "...",
  status: "confirmed",
  statusHistory: [
    { status: "pending", note: "Pesanan dibuat", ... },
    { status: "confirmed", note: "Pesanan telah dikonfirmasi...", ... }
  ]
}
```

### 5. Cancel Order (User/Admin)

```javascript
PUT /api/orders/:id/cancel
Headers: Authorization: Bearer <token>
Body: {
  reason: "Salah pilih ukuran"
}

Response: {
  _id: "...",
  status: "cancelled",
  cancelReason: "Salah pilih ukuran"
}
```

### 6. Get Order Statistics (Admin)

```javascript
GET /api/orders/admin/stats
Headers: Authorization: Bearer <token>

Response: {
  totalOrders: 150,
  pendingOrders: 25,
  confirmedOrders: 30,
  shippedOrders: 20,
  completedOrders: 70,
  cancelledOrders: 5,
  totalRevenue: 125000000,
  recentOrders: [...]
}
```

## 📱 User Flow Examples

### Customer Order Flow:

1. **Browse & Add to Cart**

   - User browse products
   - Add to cart dengan pilih size
   - Cart badge counter update

2. **View Cart**

   - Lihat cart items
   - Centang checkbox produk yang mau di-checkout
   - Bisa select all atau select individual
   - Update quantity dengan +/- button
   - Remove items

3. **Proceed to Checkout**

   - Click "Proceed to Checkout"
   - Validasi: minimal 1 item selected
   - Navigate ke CheckoutPage

4. **Fill Checkout Form**

   - Review selected products
   - Isi shipping address (semua field required)
   - Pilih shipping service (click card)
   - Pilih payment method
   - Lihat summary di sidebar

5. **Create Order**

   - Click "Buat Pesanan"
   - Validasi semua field
   - POST ke backend
   - Alert order number
   - Cart cleared automatically
   - Navigate ke My Orders

6. **Track Order**
   - Lihat order di "My Orders"
   - Status badge menunjukkan progress
   - Click "Lihat Detail" untuk full info
   - Lihat status history timeline
   - Bisa cancel jika masih pending/confirmed

### Admin Order Management Flow:

1. **View Orders Dashboard**

   - Login as admin
   - Click "Orders" di sidebar
   - Lihat list semua orders

2. **Filter Orders**

   - Pilih status di dropdown
   - View pending orders yang perlu dikonfirmasi
   - View shipped orders untuk diupdate

3. **Review Order Detail**

   - Click "Detail" untuk expand
   - Lihat produk, alamat, customer info
   - Check status history

4. **Confirm Order**

   - Click "Update Status"
   - Select "Konfirmasi"
   - Add note: "Pesanan dikonfirmasi, akan diproses"
   - Submit

5. **Mark as Shipped**

   - Update status ke "Dikirim"
   - Add note: "Pesanan dikirim via JNE, resi: XXX"

6. **Complete Order**

   - Update status ke "Selesai"
   - Add note: "Pesanan telah diterima customer"

7. **Handle Cancellation**
   - If need to cancel: update status "Batalkan"
   - Add cancellation reason

## 🔒 Security & Validation

### Backend Validations:

- ✅ JWT authentication required for all order endpoints
- ✅ Admin middleware untuk admin-only endpoints
- ✅ Ownership check (user only see their orders)
- ✅ Product existence validation
- ✅ Status transition rules enforced
- ✅ Cannot update completed/cancelled orders
- ✅ Cannot cancel shipped/completed orders
- ✅ Required fields validation

### Frontend Validations:

- ✅ Must select at least 1 item untuk checkout
- ✅ All shipping address fields required
- ✅ Must select shipping service
- ✅ Must select payment method
- ✅ Cancel reason required when cancelling
- ✅ Loading states untuk prevent double-submit
- ✅ Error messages user-friendly

## 📁 File Structure

### Backend Files (NEW):

```
backend/
├── models/
│   └── Order.js                    ✨ NEW
├── controllers/
│   └── orderController.js          ✨ NEW
└── routes/
    └── orderRoutes.js              ✨ NEW
```

### Backend Files (MODIFIED):

```
backend/
└── index.js                        ✏️ Register order routes
```

### Frontend Files (NEW):

```
contexts/
└── CartContext.tsx                 ✨ NEW - Separate cart context

pages/
├── CheckoutPage.tsx                ✨ NEW
├── MyOrdersPage.tsx                ✨ NEW
└── admin/
    └── OrderManagementPage.tsx     ✨ NEW
```

### Frontend Files (MODIFIED):

```
types.ts                            ✏️ Added Order types
App.tsx                             ✏️ Added checkout & myOrders routing
components/
├── Header.tsx                      ✏️ Added My Orders menu
└── AdminLayout.tsx                 ✏️ Added Orders menu
pages/
└── AdminPanel.tsx                  ✏️ Added OrderManagementPage routing
```

## 🎨 UI/UX Highlights

### Design Patterns:

- **Card-based layout** untuk order list (clean & modern)
- **Badge colors** untuk status (visual indication)
- **Timeline visualization** untuk status history
- **Sticky sidebar** di checkout (always visible summary)
- **Expandable details** (minimize clutter)
- **Modal dialogs** untuk update actions
- **Toast/Alert notifications** untuk feedback
- **Loading states** untuk async operations
- **Responsive design** (mobile-friendly)

### Color Coding:

- 🟡 **Yellow** - Pending (Waiting)
- 🔵 **Blue** - Confirmed (In Progress)
- 🟣 **Purple** - Shipped (On The Way)
- 🟢 **Green** - Completed (Success)
- 🔴 **Red** - Cancelled (Failed)

## 🧪 Testing Checklist

### User Flow Testing:

- [ ] Add products to cart dengan different sizes
- [ ] Select/deselect items di cart dengan checkbox
- [ ] Proceed to checkout dengan selected items
- [ ] Fill complete shipping address
- [ ] Select shipping service (semua options)
- [ ] Select payment method (semua options)
- [ ] Submit order successfully
- [ ] Verify order number generated
- [ ] Check cart cleared after order
- [ ] View order di My Orders page
- [ ] Expand order details
- [ ] View status history
- [ ] Cancel pending order dengan reason
- [ ] Try cancel shipped order (should fail)

### Admin Flow Testing:

- [ ] Login as admin
- [ ] View all orders
- [ ] Filter by each status
- [ ] Expand order details
- [ ] Update status pending → confirmed
- [ ] Update status confirmed → shipped (dengan note)
- [ ] Update status shipped → completed
- [ ] Try update completed order (should be disabled)
- [ ] Cancel order via admin
- [ ] Check status history updates
- [ ] View order statistics
- [ ] Test pagination

### Edge Cases:

- [ ] Create order dengan cart kosong (should fail)
- [ ] Checkout tanpa select items (should alert)
- [ ] Submit order tanpa shipping address (should validate)
- [ ] Submit order tanpa pilih kurir (should validate)
- [ ] Cancel completed order (should fail)
- [ ] Update cancelled order (should fail)
- [ ] Non-admin access admin orders (should 403)
- [ ] View other user's order (should 403)

## 🚦 Next Steps / Future Enhancements

### Immediate (Priority 1):

1. **Test End-to-End** - Complete user & admin flow
2. **Fix Any Bugs** - Based on testing results
3. **Add Order Notifications** - Email/SMS saat status change
4. **Print/Export Order** - PDF invoice generation

### Short-term (Priority 2):

1. **Order Search** - Search by order number, customer name
2. **Bulk Status Update** - Update multiple orders at once
3. **Return/Refund System** - Handle order returns
4. **Payment Integration** - Real payment gateway (Midtrans, Xendit)
5. **Shipping Tracking** - Real API integration (JNE, JNT tracking)
6. **Order Analytics** - Charts & metrics dashboard

### Long-term (Priority 3):

1. **Inventory Management** - Auto-reduce stock on order
2. **Review System** - Customer review setelah completed
3. **Loyalty Points** - Reward system untuk repeat customers
4. **Voucher/Discount** - Promo code system
5. **Chat Customer Service** - Real-time support
6. **Multi-vendor** - Marketplace dengan multiple sellers

## 💡 Tips & Best Practices

### For Development:

1. **Always seed sample orders** untuk testing
2. **Use Postman/Insomnia** untuk test API endpoints
3. **Check MongoDB** untuk verify data structure
4. **Test semua status transitions** before deployment
5. **Handle loading states** untuk better UX
6. **Add proper error messages** yang informatif

### For Production:

1. **Add rate limiting** pada order creation
2. **Implement retry logic** untuk failed payments
3. **Add order backup** sebelum status change
4. **Monitor order statistics** untuk business insights
5. **Set up alerts** untuk pending orders > 24h
6. **Implement audit logs** untuk semua order changes
7. **Add CAPTCHA** untuk prevent spam orders

## 📞 Troubleshooting

### Order tidak tercreate:

- Check authentication token valid
- Check selected items tidak kosong
- Check product IDs valid di database
- Check all required fields filled
- Check network console untuk error details

### Status tidak bisa diupdate:

- Check order tidak completed/cancelled
- Check user memiliki role admin
- Check status transition valid
- Check authorization header present

### Cart tidak cleared after order:

- Check clearSelectedItems() dipanggil
- Check response success dari API
- Check localStorage cleared
- Check cart context re-rendered

### Order tidak muncul di My Orders:

- Check user logged in
- Check token valid
- Check API endpoint /myorders
- Check order.user === current user
- Check network response status

## 🎉 Summary

Sistem order management sekarang sudah **COMPLETE** dengan:

✅ **Backend API** - 7 endpoints dengan validasi lengkap  
✅ **Order Model** - Schema dengan auto-generated order number  
✅ **Status Tracking** - 5 status dengan history timeline  
✅ **Cart Selection** - Checkbox untuk pilih items checkout  
✅ **Checkout Flow** - Form lengkap address, kurir, payment  
✅ **User Orders Page** - History dengan detail & tracking  
✅ **Admin Management** - Dashboard untuk kelola semua orders  
✅ **Navigation** - Routing & menu terintegrasi

**Total Files Created:** 4 backend + 4 frontend = **8 files**  
**Total Files Modified:** 1 backend + 5 frontend = **6 files**

**Sistem siap untuk testing dan deployment! 🚀**
