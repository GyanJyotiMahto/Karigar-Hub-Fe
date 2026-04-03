const BASE = import.meta.env.PROD
  ? 'https://karigar-hub-be.onrender.com/api'
  : 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('kh_token');

const req = async (path, options = {}) => {
  const token = getToken();
  const { headers: extraHeaders, ...restOptions } = options;
  const res = await fetch(`${BASE}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...extraHeaders,
    },
  });

  // Guard: if response is not JSON (e.g. HTML 404/500 page), give a clear error
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server error (${res.status}): endpoint not found or server is down`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

// ── Auth ──────────────────────────────────────────────────────────────────────
// API integrated here
export const register = (body) => req('/auth/register', { method: 'POST', body: JSON.stringify(body) });
export const login    = (body) => req('/auth/login',    { method: 'POST', body: JSON.stringify(body) });
export const getMe    = ()     => req('/auth/me');

// ── Upload (multipart — no Content-Type header so browser sets boundary) ──────
const upload = async (path, formData) => {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Server error (${res.status}): endpoint not found or server is down`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
};

export const uploadProductImages = (files) => {
  const fd = new FormData();
  files.forEach(f => fd.append('images', f));
  return upload('/products/upload/images', fd);
};

export const uploadProductVideo = (file) => {
  const fd = new FormData();
  fd.append('video', file);
  return upload('/products/upload/video', fd);
};

export const uploadArtistProfileImage = (file) => {
  const fd = new FormData();
  fd.append('profileImage', file);
  return upload('/artists/upload/profile-image', fd);
};

export const uploadUserProfileImage = (file) => {
  const fd = new FormData();
  fd.append('profileImage', file);
  return upload('/users/upload/profile-image', fd);
};

// ── Products ──────────────────────────────────────────────────────────────────
// API integrated here
export const getBestSellers = () => req('/products/bestsellers');
export const getProducts    = (params = {}) => req('/products?' + new URLSearchParams(params));
export const getMyProducts  = ()             => req('/products/my');
export const getProduct     = (id)           => req(`/products/${id}`);
export const createProduct = (body)        => req('/products', { method: 'POST', body: JSON.stringify(body) });
export const updateProduct = (id, body)    => req(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteProduct = (id)          => req(`/products/${id}`, { method: 'DELETE' });

// ── Artisans ──────────────────────────────────────────────────────────────────
// API integrated here
export const getArtisans = (params = {}) => req('/artists?' + new URLSearchParams(params));
export const getArtisan  = (id)          => req(`/artists/${id}`);
export const updateArtistProfile = (body) => req('/artists/profile', { method: 'PUT', body: JSON.stringify(body) });
export const toggleFollow        = (id)   => req(`/artists/${id}/follow`, { method: 'POST' });
export const getArtistFollowers  = (id)   => req(`/artists/${id}/followers`);

// ── Wishlist ───────────────────────────────────────────────────────────────────
export const toggleWishlist     = (productId) => req(`/users/wishlist/${productId}`, { method: 'POST' });
export const getWishlist        = ()           => req('/users/profile');
export const updateUserProfile  = (body)       => req('/users/profile', { method: 'PUT', body: JSON.stringify(body) });
export const saveAddress        = (body)       => req('/users/address',  { method: 'PUT', body: JSON.stringify(body) });
export const addAddress         = (body)        => req('/users/addresses',        { method: 'POST',   body: JSON.stringify(body) });
export const editAddress        = (index, body) => req(`/users/addresses/${index}`, { method: 'PUT',    body: JSON.stringify(body) });
export const deleteAddress      = (index)       => req(`/users/addresses/${index}`, { method: 'DELETE' });

// ── Orders ───────────────────────────────────────────────────────────────────
export const placeOrder      = (body)       => req('/orders',         { method: 'POST', body: JSON.stringify(body) });
export const getMyOrders     = ()           => req('/orders/my');
export const getArtistOrders = ()           => req('/orders/artist');
export const getOrder        = (id)         => req(`/orders/${id}`);
export const updateStatus    = (id, status) => req(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });

// ── Workshops ────────────────────────────────────────────────────────────────
export const getAllWorkshops  = ()     => req('/workshops');
export const createWorkshop  = (body) => req('/workshops',     { method: 'POST',   body: JSON.stringify(body) });
export const getMyWorkshops  = ()     => req('/workshops/my');
export const updateWorkshop  = (id, body) => req(`/workshops/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteWorkshop  = (id)   => req(`/workshops/${id}`, { method: 'DELETE' });

// ── Invoice ──────────────────────────────────────────────────────────────────
export const downloadInvoice = async (orderId) => {
  const token = getToken();
  const res = await fetch(`${BASE}/invoice/${orderId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to generate invoice');
  }
  return res.blob();
};

export const createPaymentOrder = (amount) => req('/payment/create-order', { method: 'POST', body: JSON.stringify({ amount }) });
export const verifyPayment      = (body)   => req('/payment/verify',        { method: 'POST', body: JSON.stringify(body) });

// ── Cart ─────────────────────────────────────────────────────────────────────
export const getCart         = ()                    => req('/cart');
export const addToCartAPI    = (body)                => req('/cart', { method: 'POST', body: JSON.stringify(body) });
export const removeCartItem  = (itemId)              => req(`/cart/${itemId}`, { method: 'DELETE' });
export const updateCartItem  = (itemId, quantity)    => req(`/cart/${itemId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) });

// ── Customization ─────────────────────────────────────────────────────────────
export const getKarigarCustomizationRequests = ()             => req('/customization/karigar');
export const updateCustomizationStatus       = (orderItemId, status) => req(`/customization/${orderItemId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
