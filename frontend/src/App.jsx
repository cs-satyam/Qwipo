import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import RetailerRoute from "./auth/RetailerRoute.jsx";
import RetailerDashboard from "./pages/RetailerDashboard.jsx";
import Orders from "./pages/Orders.jsx";
import Customers from "./pages/Customers.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import MyMarket from "./pages/MyMarket.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import Cart from "./pages/Cart.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import OrderItems from "./pages/OrderItems.jsx";

function App() {
  return (
    <Router>
      <ToastProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* MyMarket storefront (public) */}
            <Route path="/mymarket" element={<MyMarket />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            {/* Product listing (public) */}
            <Route path="/product" element={<Product />} />
            <Route
              path="/orders"
              element={<ProtectedRoute><Orders /></ProtectedRoute>}
            />
            <Route
              path="/customers"
              element={<ProtectedRoute><Customers /></ProtectedRoute>}
            />
            <Route
              path="/analytics"
              element={<ProtectedRoute><Analytics /></ProtectedRoute>}
            />
            <Route
              path="/settings"
              element={<ProtectedRoute><Settings /></ProtectedRoute>}
            />
            <Route
              path="/cart"
              element={<ProtectedRoute><Cart /></ProtectedRoute>}
            />
            <Route
              path="/order/:id/confirmation"
              element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>}
            />
            <Route
              path="/order-items"
              element={<ProtectedRoute><OrderItems /></ProtectedRoute>}
            />

            {/* Retailer-only dashboard */}
            <Route
              path="/retailer"
              element={<RetailerRoute><RetailerDashboard /></RetailerRoute>}
            />
          </Routes>
        </CartProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
