import { createContext, useContext, useState, useCallback } from 'react';
import { addToCartAPI, getCart, removeCartItem, updateCartItem } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

// Compute price for a cart item including customization priceAdd
export function computeItemPrice(item) {
  const base = item.price ?? item.product?.price ?? 0;
  if (!item.customizations || !item.customizationOptions) return base;
  const extra = item.customizationOptions.reduce((sum, opt) => {
    const chosen = item.customizations[opt.name];
    return chosen && opt.priceAdd ? sum + opt.priceAdd : sum;
  }, 0);
  return base + extra;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  // ── Local-only helpers (used when not logged in) ──────────────────────────
  const addToCart = useCallback(async (product, customizations = {}) => {
    if (user) {
      try {
        const updated = await addToCartAPI({
          productId: product._id,
          quantity: product.quantity ?? 1,
          customizations,
        });
        // Normalise server cart items to match local shape
        setCart(updated.items.map(i => ({
          ...i.product,
          _cartItemId: i._id,
          quantity: i.quantity,
          customizations: i.customizations ? Object.fromEntries(i.customizations) : {},
        })));
        return;
      } catch (err) {
        // Fall through to local cart on API error
        console.warn('Cart API error, using local cart:', err.message);
      }
    }

    // Local cart (guest or API failure)
    setCart(prev => {
      const hasCustom = Object.keys(customizations).length > 0;
      if (!hasCustom) {
        const existing = prev.find(i => i._id === product._id && !Object.keys(i.customizations || {}).length);
        if (existing) {
          return prev.map(i =>
            i._id === product._id && !Object.keys(i.customizations || {}).length
              ? { ...i, quantity: i.quantity + (product.quantity ?? 1) }
              : i
          );
        }
      }
      return [...prev, { ...product, customizations: hasCustom ? customizations : {}, quantity: product.quantity ?? 1 }];
    });
  }, [user]);

  const removeFromCart = useCallback(async (id) => {
    const item = cart.find(i => (i._cartItemId || i._id) === id);
    if (user && item?._cartItemId) {
      try {
        await removeCartItem(item._cartItemId);
      } catch (e) { /* ignore */ }
    }
    setCart(prev => prev.filter(i => (i._cartItemId || i._id) !== id));
  }, [cart, user]);

  const updateQty = useCallback(async (id, delta) => {
    const item = cart.find(i => (i._cartItemId || i._id) === id);
    const newQty = Math.max(1, (item?.quantity ?? 1) + delta);
    if (user && item?._cartItemId) {
      try { await updateCartItem(item._cartItemId, newQty); } catch (e) { /* ignore */ }
    }
    setCart(prev => prev.map(i =>
      (i._cartItemId || i._id) === id ? { ...i, quantity: newQty } : i
    ));
  }, [cart, user]);

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const subtotal   = cart.reduce((s, i) => s + computeItemPrice(i) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
