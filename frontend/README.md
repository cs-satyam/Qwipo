# BytXl Frontend (React + Vite)

This is the React frontend for the BytXl project. It provides a modern retail dashboard and storefront experience with authentication, cart, orders, coupons, analytics, and printable order invoices.

## Features

- **Authentication**: Protected routes via `auth/ProtectedRoute.jsx` using `authToken` in localStorage.
- **Products & Storefront**: `/mymarket` listing with quick quantity add via `ProductCard`.
- **Cart (server synced)**:
  - Persists per user via backend `/api/cart`.
  - Add/update/remove/clear items; local fallback when not authenticated.
  - Checkout with optional coupon and required shipping details.
- **Coupons**: Apply on Cart with server validation via `/api/coupons/validate`.
- **Orders**:
  - Create orders with stock validation, coupon discount, and shipping details.
  - View orders list `/orders`, order confirmation `/order/:id/confirmation` with print invoice.
  - Order Items page `/order-items` aggregates all purchased items.
- **Analytics**: Revenue, AOV, coupon savings, coupon usage, top products, revenue-by-day chart with date filters and CSV export.
- **Dashboard**: KPIs and recent orders from real backend data.
- **Toasts**: Global toast notifications via `ToastContext`.
- **Retailer Role & Dashboard**:
  - Register as retailer (toggle on Register page) or upgrade from Settings (Become a Retailer).
  - Retailer-only dashboard at `/retailer` with Product CRUD, Orders including your items, and Seller Analytics.
  - Seller Analytics include revenue, AOV, low stock alerts, top products by revenue, and revenue-by-day with 7/30/90 day filters and CSV export.

## Tech Stack

- React 18 + Vite
- React Router
- Axios
- Bootstrap Icons + custom CSS

## Getting Started

1. **Prerequisites**
   - Node.js 18+

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment variables**
   - Create a `.env` file in `frontend/` (same folder as this README) and set:
   ```env
   VITE_API_BASE=http://localhost:5000
   ```
   - This should point to your backend server base URL.

4. **Run the app**
   ```bash
   npm run dev
   ```
   - Default dev server: http://localhost:5173

## Important Paths

- Contexts
  - `src/context/CartContext.jsx`: Cart state, server sync, checkout.
  - `src/context/ToastContext.jsx`: Toast provider and `useToast()` hook.

- Pages
  - `src/pages/MyMarket.jsx`: Storefront with product grid and quick add-to-cart.
  - `src/pages/Cart.jsx`: Cart page with coupon, shipping form, totals; checkout navigates to confirmation.
  - `src/pages/Orders.jsx`: Lists user’s orders from backend; discount/coupon columns; modal details; invoice link.
  - `src/pages/OrderConfirmation.jsx`: Shows order summary, shipping, lines, totals, and print button.
  - `src/pages/OrderItems.jsx`: Flattens all order items for quick searching and invoice access.
  - `src/pages/Analytics.jsx`: Real metrics (orders, AOV, coupon savings), coupon usage, top products, revenue-by-day chart, date filters, CSV export.
  - `src/pages/Dashboard.jsx`: KPIs from orders and recent orders table.
  - `src/pages/RetailerDashboard.jsx`: Retailer tabs (Products, Orders, Analytics), onboarding progress, badges, confetti on first product.

- Layout
  - `src/pages/components/layout/TopNav.jsx`: Top navigation with cart badge and account dropdown.
  - `src/pages/components/layout/Sidebar.jsx`: Sidebar navigation including Orders, Order Items, Analytics, Settings.

## Routes

- Public: `/`, `/login`, `/register`
- Protected:
  - `/mymarket` (storefront)
  - `/dashboard`
  - `/product`
  - `/orders`
  - `/order/:id/confirmation`
  - `/order-items`
  - `/customers`
  - `/analytics`
  - `/settings`
  - `/cart`
  - `/retailer` (retailer-only)

## Cart & Checkout Flow

1. Add products from `/mymarket` or product page via `Add` button with quantity stepper.
2. Open `/cart` to review items, apply coupon, and fill shipping details (name and address required).
3. Click Place Order to create the order; on success, you’re redirected to `/order/:id/confirmation`.
4. Use `Print Invoice` to print/download.

## Coupons

- Validate a code on Cart via `GET /api/coupons/validate?code=CODE&amount=SUBTOTAL`.
- On checkout, send `couponCode` to apply discount.

## Notes

- Protected routes require `authToken` in localStorage. Retailer-only pages also require `user.role === 'retailer'`.
- Frontend expects backend endpoints mounted at `VITE_API_BASE` with the following relevant paths:
  - `/api/products`, `/api/cart`, `/api/orders`, `/api/coupons/validate`
  - Retailer: `/api/products/mine/list`, `/api/orders/retailer/sales`, `/api/users/upgrade-retailer`
- Order schema includes `products`, `totalAmount`, `discount`, `couponCode`, and `shipping` details.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run preview` — preview production build

## Troubleshooting
