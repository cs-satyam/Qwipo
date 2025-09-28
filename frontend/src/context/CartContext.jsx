import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const CartContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
  const [busy, setBusy] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Load server cart if authenticated
  useEffect(() => {
    const load = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_BASE}/api/cart`, { headers: { Authorization: `Bearer ${token}` } });
        const serverItems = (res.data?.items || []).map(i => ({ id: i.product?._id || i.product, name: i.product?.name, price: i.product?.price, image: i.product?.image || i.product?.thumbnail, qty: i.quantity }));
        setItems(serverItems);
      } catch { /* ignore */ }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addLocal = (p, qty = 1) => {
    const id = p._id || p.id || p.sku;
    if (!id) return;
    setItems(prev => {
      const found = prev.find(it => it.id === id);
      if (found) return prev.map(it => it.id === id ? { ...it, qty: it.qty + qty } : it);
      return [...prev, { id, name: p.name, price: p.price, image: p.image || p.thumbnail, qty }];
    });
  };

  const add = async (p, qty = 1) => {
    if (!token) return addLocal(p, qty);
    try {
      const body = { product: p._id || p.id || p.sku, quantity: qty };
      const res = await axios.post(`${API_BASE}/api/cart/add`, body, { headers: { Authorization: `Bearer ${token}` } });
      const serverItems = (res.data?.items || []).map(i => ({ id: i.product?._id || i.product, name: i.product?.name, price: i.product?.price, image: i.product?.image || i.product?.thumbnail, qty: i.quantity }));
      setItems(serverItems);
    } catch {
      addLocal(p, qty);
    }
  };

  const updateQty = async (id, qty) => {
    if (!token) return setItems(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, qty) } : it));
    try {
      const body = { product: id, quantity: Math.max(1, qty) };
      const res = await axios.put(`${API_BASE}/api/cart/item`, body, { headers: { Authorization: `Bearer ${token}` } });
      const serverItems = (res.data?.items || []).map(i => ({ id: i.product?._id || i.product, name: i.product?.name, price: i.product?.price, image: i.product?.image || i.product?.thumbnail, qty: i.quantity }));
      setItems(serverItems);
    } catch {
      setItems(prev => prev.map(it => it.id === id ? { ...it, qty: Math.max(1, qty) } : it));
    }
  };

  const remove = async (id) => {
    if (!token) return setItems(prev => prev.filter(it => it.id !== id));
    try {
      const res = await axios.delete(`${API_BASE}/api/cart/item/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      const serverItems = (res.data?.items || []).map(i => ({ id: i.product?._id || i.product, name: i.product?.name, price: i.product?.price, image: i.product?.image || i.product?.thumbnail, qty: i.quantity }));
      setItems(serverItems);
    } catch {
      setItems(prev => prev.filter(it => it.id !== id));
    }
  };

  const clear = async () => {
    if (!token) return setItems([]);
    try {
      await axios.delete(`${API_BASE}/api/cart/clear`, { headers: { Authorization: `Bearer ${token}` } });
      setItems([]);
    } catch {
      setItems([]);
    }
  };

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 1), 0);
    const count = items.reduce((c, it) => c + (Number(it.qty) || 1), 0);
    return { subtotal, count };
  }, [items]);

  const checkout = async (couponCode, shipping) => {
    if (items.length === 0) return;
    if (!token) {
      return { ok: false, error: 'Please login to place your order.' };
    }
    try {
      setBusy(true);
      const body = {
        products: items.map(it => ({ product: it.id, quantity: it.qty })),
        ...(couponCode ? { couponCode } : {}),
        ...(shipping ? { shipping } : {}),
      };
      const res = await axios.post(`${API_BASE}/api/orders`, body, { headers: { Authorization: `Bearer ${token}` } });
      await clear();
      return { ok: true, order: res.data?.order };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || err.message };
    } finally {
      setBusy(false);
    }
  };

  const value = { items, totals, busy, add, updateQty, remove, clear, checkout };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
