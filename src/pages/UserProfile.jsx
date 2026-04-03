import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, Edit3, Save, X, Package, LogOut, Camera, LayoutDashboard, Plus, Star, Briefcase, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { uploadUserProfileImage, uploadArtistProfileImage, getMyProducts, updateArtistProfile, updateUserProfile, getWishlist, getMyOrders, addAddress, editAddress, deleteAddress } from '../services/api';

export default function UserProfile() {
  const { user, logout, saveUser } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const isArtist = user?.role === 'artist';

  const tabs = isArtist
    ? ['Overview', 'My Products', 'Settings']
    : ['Overview', 'My Orders', 'Wishlist', 'Settings'];

  const [activeTab, setActiveTab] = useState('Overview');
  const [editing, setEditing] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [products, setProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const imgInputRef = useRef();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', bio: '', city: '', state: '',
  });

  // Sync form when user data changes (e.g. after save)
  useEffect(() => {
    if (!user) return;
    setForm({
      name:  user.name  || '',
      email: user.email || '',
      phone: user.phone || '',
      bio:   user.bio   || '',
      city:  user.address?.city  || '',
      state: user.address?.state || '',
    });
    setProfileImage(user.profileImage || null);
  }, [user]);

  // Fetch real data on mount
  useEffect(() => {
    if (!user || isArtist) return;
    // Wishlist count
    getWishlist()
      .then(data => setWishlistItems(data.wishlist || []))
      .catch(() => {});
    // Orders
    getMyOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [user, isArtist]);

  useEffect(() => {
    if (isArtist && activeTab === 'My Products') {
      getMyProducts()
        .then(data => setProducts(Array.isArray(data) ? data : []))
        .catch(() => {});
    }
  }, [activeTab, isArtist]);

  const handleProfileImageChange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingImg(true);
      const fn = isArtist ? uploadArtistProfileImage : uploadUserProfileImage;
      const { profileImage: url } = await fn(file);
      setProfileImage(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImg(false);
    }
  };

  const [saving, setSaving] = useState(false);

  // Address modal state
  const [addressModal, setAddressModal] = useState(false);
  const [addressEditMode, setAddressEditMode] = useState(false);
  const [addressIsNew, setAddressIsNew] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: 'Home', addressLine: '', city: '', state: '', pincode: '' });
  const [editingIndex, setEditingIndex] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressError, setAddressError] = useState('');

  // Seed addresses from user.addresses or legacy user.address
  useEffect(() => {
    if (!user) return;
    if (user.addresses?.length) {
      setAddresses(user.addresses);
    } else if (user.address?.city) {
      setAddresses([{ label: 'Home', addressLine: user.address.addressLine || '', city: user.address.city, state: user.address.state || '', pincode: user.address.pincode || '' }]);
    } else {
      setAddresses([]);
    }
  }, [user]);

  const openAddressModal = () => {
    setAddressForm({ label: 'Home', addressLine: '', city: '', state: '', pincode: '' });
    setAddressIsNew(false);
    setAddressEditMode(false);
    setEditingIndex(null);
    setAddressModal(true);
  };

  const handleSaveAddress = async () => {
    if (!addressForm.city.trim() || !addressForm.state.trim()) {
      setAddressError('City and State are required.');
      return;
    }
    setSavingAddress(true);
    setAddressError('');
    try {
      let updated;
      if (addressIsNew || editingIndex === null) {
        updated = await addAddress(addressForm);
      } else {
        updated = await editAddress(editingIndex, addressForm);
      }
      const arr = Array.isArray(updated) ? updated : [];
      setAddresses(arr);
      saveUser({ ...user, addresses: arr, token: localStorage.getItem('kh_token') });
      setAddressEditMode(false);
      setAddressIsNew(false);
      setEditingIndex(null);
    } catch (err) {
      setAddressError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const updated = await deleteAddress(index);
      setAddresses(updated);
      saveUser({ ...user, addresses: updated, token: localStorage.getItem('kh_token') });
    } catch (err) {
      console.error('Delete address error:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (isArtist) {
        const updated = await updateArtistProfile({ name: form.name, phone: form.phone, bio: form.bio });
        saveUser({ ...user, ...updated, token: localStorage.getItem('kh_token') });
      } else {
        const updated = await updateUserProfile({
          name:  form.name,
          phone: form.phone,
          address: {
            city:    form.city,
            state:   form.state,
            country: 'India',
          },
        });
        saveUser({ ...user, ...updated, token: localStorage.getItem('kh_token') });
      }
      setEditing(false);
    } catch (err) {
      console.error('Save profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#E8D5B0]/60 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-5 sm:px-7 py-5">

            {/* Avatar + Info */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 shrink-0 rounded-full bg-[#C0522B] shadow-md overflow-hidden relative group cursor-pointer flex items-center justify-center text-white font-bold text-xl font-display"
                onClick={() => imgInputRef.current.click()}>
                {profileImage
                  ? <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                  : initials
                }
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  {uploadingImg ? <span className="text-[10px] text-white">...</span> : <Camera size={14} className="text-white" />}
                </div>
              </div>
              <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} />
              <div>
                <h1 className="font-display text-xl font-bold text-[#2C1A0E] leading-tight">{user?.name || 'User'}</h1>
                <p className="text-sm text-[#7B5C3A]">{user?.email}</p>
                {isArtist && user?.businessName && (
                  <p className="text-xs text-[#C0522B] font-semibold mt-0.5">🏪 {user.businessName}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {isArtist && (
                <Link to="/dashboard"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C0522B] text-white text-sm font-semibold hover:bg-[#9A3E1E] transition-all whitespace-nowrap">
                  <LayoutDashboard size={13} /> Dashboard
                </Link>
              )}
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#C0522B] text-[#C0522B] text-sm font-semibold hover:bg-[#C0522B] hover:text-white transition-all whitespace-nowrap">
                <Edit3 size={13} /> Edit Profile
              </button>
              <button onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8D5B0] text-[#7B5C3A] text-sm font-semibold hover:border-red-400 hover:text-red-500 transition-all whitespace-nowrap">
                <LogOut size={13} /> Sign Out
              </button>
            </div>

          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-[#E8D5B0]/60 p-1 mb-6 shadow-sm">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab ? 'bg-[#C0522B] text-white shadow-sm' : 'text-[#7B5C3A] hover:text-[#2C1A0E]'
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>

          {/* ── Overview ── */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isArtist ? (
                <>
                  {[
                    { icon: Package, label: 'Total Products', value: products.length || '—', color: 'bg-orange-50 text-[#C0522B]' },
                    { icon: Star, label: 'Rating', value: user?.rating || '0', color: 'bg-yellow-50 text-yellow-600' },
                    { icon: ShoppingBag, label: 'Total Sales', value: user?.totalSales || '0', color: 'bg-green-50 text-green-600' },
                    { icon: Briefcase, label: 'Category', value: user?.category || '—', color: 'bg-blue-50 text-blue-500' },
                  ].map(({ icon: Icon, label, value, color }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-5 flex items-center gap-4 shadow-sm">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold font-display text-[#2C1A0E]">{value}</p>
                        <p className="text-sm text-[#7B5C3A]">{label}</p>
                      </div>
                    </div>
                  ))}
                  <div className="sm:col-span-2 bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 shadow-sm">
                    <h3 className="font-semibold text-[#2C1A0E] mb-4">Karigar Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { icon: User, label: 'Full Name', value: user?.name || '—' },
                        { icon: Mail, label: 'Email', value: user?.email || '—' },
                        { icon: Phone, label: 'Phone', value: user?.phone || '—' },
                        { icon: MapPin, label: 'Location', value: user?.address?.city ? `${user.address.city}, ${user.address.state}` : '—' },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-[#FDF6EC]">
                          <Icon size={16} className="text-[#C0522B]" />
                          <div>
                            <p className="text-[10px] text-[#7B5C3A] font-semibold uppercase tracking-wide">{label}</p>
                            <p className="text-sm text-[#2C1A0E] font-medium">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {user?.bio && (
                      <div className="mt-4 p-4 bg-[#FDF6EC] rounded-xl">
                        <p className="text-xs text-[#7B5C3A] font-semibold uppercase tracking-wide mb-1">Bio</p>
                        <p className="text-sm text-[#2C1A0E]">{user.bio}</p>
                      </div>
                    )}
                  </div>
                  <div className="sm:col-span-2 flex gap-3">
                    <Link to="/dashboard/products/add"
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#C0522B] text-white font-bold hover:bg-[#9A3E1E] transition-all shadow-md">
                      <Plus size={16} /> Add New Product
                    </Link>
                    <Link to="/dashboard"
                      className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full border-2 border-[#C0522B] text-[#C0522B] font-bold hover:bg-[#C0522B] hover:text-white transition-all">
                      <LayoutDashboard size={16} /> Go to Dashboard
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {[
                    { icon: ShoppingBag, label: 'Total Orders',   value: orders.length,        color: 'bg-orange-50 text-[#C0522B]',  to: '/orders' },
                    { icon: Heart,       label: 'Wishlist Items',  value: wishlistItems.length, color: 'bg-rose-50 text-rose-500',     to: '/wishlist' },
                    { icon: Package,     label: 'In Cart',         value: cart.length,          color: 'bg-green-50 text-green-600',   to: '/cart' },
                    { icon: MapPin, label: 'Saved Address', value: addresses.length, color: 'bg-blue-50 text-blue-500', to: null },
                  ].map(({ icon: Icon, label, value, color, to }) => {
                    const inner = (
                      <>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <p className="text-2xl font-bold font-display text-[#2C1A0E]">{value}</p>
                          <p className="text-sm text-[#7B5C3A]">{label}</p>
                        </div>
                      </>
                    );
                    if (label === 'Saved Address') {
                      return (
                        <button key={label} onClick={openAddressModal}
                          className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-[#C0522B]/40 transition-all cursor-pointer text-left w-full">
                          {inner}
                        </button>
                      );
                    }
                    return to ? (
                      <Link key={label} to={to}
                        className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-[#C0522B]/40 transition-all cursor-pointer">
                        {inner}
                      </Link>
                    ) : (
                      <div key={label} className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-5 flex items-center gap-4 shadow-sm">
                        {inner}
                      </div>
                    );
                  })}

                </>
              )}
            </div>
          )}

          {/* ── My Products (Artist only) ── */}
          {activeTab === 'My Products' && isArtist && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#2C1A0E]">My Products ({products.length})</h3>
                <Link to="/dashboard/products/add"
                  className="flex items-center gap-1.5 text-sm text-[#C0522B] font-semibold hover:underline">
                  <Plus size={14} /> Add New
                </Link>
              </div>
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">🎨</p>
                  <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">No products yet</h3>
                  <p className="text-[#7B5C3A] mb-6">Start adding your handcrafted products.</p>
                  <Link to="/dashboard/products/add"
                    className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
                    <Plus size={16} /> Add First Product
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
                  {products.map(product => (
                    <div key={product._id} className="border border-[#E8D5B0]/60 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-square bg-[#F5ECD8] overflow-hidden">
                        {product.images?.[0]
                          ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-4xl">🎨</div>
                        }
                      </div>
                      <div className="p-3">
                        <p className="font-semibold text-[#2C1A0E] text-sm truncate">{product.name}</p>
                        <p className="text-[#C0522B] font-bold text-sm">₹{product.price?.toLocaleString('en-IN')}</p>
                        <div className="flex gap-2 mt-2">
                          <Link to="/dashboard/products/add" state={{ product }}
                            className="flex-1 text-center py-1.5 rounded-lg border border-[#E8D5B0] text-xs font-semibold text-[#5C3317] hover:border-[#C0522B] transition-colors">
                            Edit
                          </Link>
                          <Link to={`/products/${product._id}`}
                            className="flex-1 text-center py-1.5 rounded-lg bg-[#C0522B]/10 text-xs font-semibold text-[#C0522B] hover:bg-[#C0522B]/20 transition-colors">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── My Orders (User only) ── */}
          {activeTab === 'My Orders' && !isArtist && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#2C1A0E]">My Orders ({orders.length})</h3>
                <Link to="/orders" className="text-sm text-[#C0522B] font-semibold hover:underline">View All</Link>
              </div>
              {orders.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-5xl mb-4">📦</p>
                  <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">No orders yet</h3>
                  <p className="text-[#7B5C3A] mb-6">Your orders will appear here once you start shopping.</p>
                  <Link to="/products" className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">Start Shopping</Link>
                </div>
              ) : (
                <div className="divide-y divide-[#E8D5B0]/60">
                  {orders.slice(0, 5).map((order, i) => {
                    const prods = order.products || [];
                    const imgSrc = prods[0]?.image || prods[0]?.product?.images?.[0] || '';
                    const date = new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
                    return (
                      <div key={order._id || i} className="flex items-center gap-4 p-4 hover:bg-[#FDF6EC] transition-colors">
                        {imgSrc
                          ? <img src={imgSrc} alt="order" className="w-12 h-12 rounded-xl object-cover border border-[#E8D5B0] shrink-0" />
                          : <div className="w-12 h-12 rounded-xl bg-[#F5ECD8] border border-[#E8D5B0] shrink-0 flex items-center justify-center">🎨</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#C0522B]">{order._id?.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-[#7B5C3A]">{prods.length} item{prods.length !== 1 ? 's' : ''} · {date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#2C1A0E]">₹{(Number(order.totalPrice) || 0).toLocaleString('en-IN')}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700' }`}>
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Wishlist (User only) ── */}
          {activeTab === 'Wishlist' && !isArtist && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Wishlist ({wishlistItems.length})</h3>
                <Link to="/wishlist" className="text-sm text-[#C0522B] font-semibold hover:underline">View All</Link>
              </div>
              {wishlistItems.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-5xl mb-4">🤍</p>
                  <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">Wishlist is empty</h3>
                  <p className="text-[#7B5C3A] mb-6">Save items you love and come back to them anytime.</p>
                  <Link to="/products" className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">Explore Products</Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-5">
                  {wishlistItems.map(item => {
                    const imgSrc = item.images?.[0] || item.image || '';
                    return (
                      <Link key={item._id} to={`/products/${item._id}`}
                        className="border border-[#E8D5B0]/60 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-[#F5ECD8] overflow-hidden">
                          {imgSrc
                            ? <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
                          }
                        </div>
                        <div className="p-3">
                          <p className="font-semibold text-[#2C1A0E] text-xs truncate">{item.name}</p>
                          <p className="text-[#C0522B] font-bold text-sm">₹{(item.price || 0).toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Settings ── */}
          {activeTab === 'Settings' && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#2C1A0E]">Account Settings</h3>
              {[
                { label: 'Email Notifications', desc: 'Receive order updates and offers via email' },
                { label: 'SMS Alerts', desc: 'Get delivery updates on your phone' },
                { label: 'Newsletter', desc: 'Artisan stories and new arrivals' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-[#FDF6EC]">
                  <div>
                    <p className="text-sm font-semibold text-[#2C1A0E]">{item.label}</p>
                    <p className="text-xs text-[#7B5C3A]">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-[#C0522B] w-4 h-4 cursor-pointer" />
                </div>
              ))}
              <button onClick={() => { logout(); navigate('/'); }}
                className="w-full mt-2 py-3 rounded-xl border-2 border-red-200 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all">
                Delete Account
              </button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display text-xl font-bold text-[#2C1A0E]">Edit Profile</h3>
              <button onClick={() => setEditing(false)} className="p-2 rounded-full hover:bg-[#F5ECD8] transition-colors">
                <X size={18} className="text-[#7B5C3A]" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                { key: 'phone', label: 'Phone', type: 'tel', placeholder: '98765 43210' },
                ...(isArtist ? [{ key: 'bio', label: 'Bio', type: 'text', placeholder: 'Describe your craft...' }] : [
                  { key: 'city', label: 'City', type: 'text', placeholder: 'Your city' },
                  { key: 'state', label: 'State', type: 'text', placeholder: 'Your state' },
                ]),
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#2C1A0E] mb-1">{label}</label>
                  <input type={type} value={form[key]} placeholder={placeholder}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5B0] text-sm text-[#2C1A0E] focus:outline-none focus:border-[#C0522B] transition-colors" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-xl border border-[#E8D5B0] text-[#7B5C3A] text-sm font-semibold hover:border-[#C0522B] transition-all">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C0522B] text-white text-sm font-semibold hover:bg-[#9A3E1E] transition-all disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Address Modal */}
      {addressModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Home size={18} className="text-[#C0522B]" />
                <h3 className="font-display text-xl font-bold text-[#2C1A0E]">
                  {addressEditMode ? (addressIsNew ? 'Add New Address' : 'Edit Address') : 'Saved Addresses'}
                </h3>
              </div>
              <button onClick={() => { setAddressModal(false); setAddressEditMode(false); setAddressIsNew(false); setEditingIndex(null); setAddressError(''); }}
                className="p-2 rounded-full hover:bg-[#F5ECD8] transition-colors">
                <X size={18} className="text-[#7B5C3A]" />
              </button>
            </div>

            {/* View Mode — list all addresses */}
            {!addressEditMode && (
              <>
                <div className="space-y-3 mb-4">
                  {addresses.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-[#E8D5B0] rounded-2xl">
                      <MapPin size={28} className="text-[#E8D5B0] mx-auto mb-2" />
                      <p className="text-sm text-[#7B5C3A]">No addresses saved yet</p>
                    </div>
                  )}
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="bg-[#FDF6EC] border border-[#E8D5B0]/60 rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                          <Home size={16} className="text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#7B5C3A] uppercase tracking-wide mb-0.5">{addr.label || 'Home'}</p>
                          {addr.addressLine && <p className="text-sm text-[#2C1A0E] font-medium">{addr.addressLine}</p>}
                          <p className="text-sm text-[#5C3317]">{[addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => {
                            setAddressForm({ label: addr.label || 'Home', addressLine: addr.addressLine || '', city: addr.city || '', state: addr.state || '', pincode: addr.pincode || '' });
                            setEditingIndex(idx);
                            setAddressIsNew(false);
                            setAddressEditMode(true);
                          }} className="p-1.5 rounded-lg hover:bg-[#E8D5B0] text-[#7B5C3A] hover:text-[#C0522B] transition-colors">
                            <Edit3 size={13} />
                          </button>
                          <button onClick={() => handleDeleteAddress(idx)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-[#7B5C3A] hover:text-red-500 transition-colors">
                            <X size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  setAddressForm({ label: 'Home', addressLine: '', city: '', state: '', pincode: '' });
                  setAddressIsNew(true);
                  setEditingIndex(null);
                  setAddressEditMode(true);
                }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#C0522B] text-[#C0522B] text-sm font-semibold hover:bg-[#C0522B] hover:text-white transition-all">
                  <Plus size={14} /> Add New Address
                </button>
              </>
            )}

            {/* Edit / Add Form */}
            {addressEditMode && (
              <>
                {addressError && (
                  <div className="mb-3 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                    {addressError}
                  </div>
                )}
                <div className="space-y-3">
                  {[
                    { key: 'label',       label: 'Label',        placeholder: 'Home / Work / Other' },
                    { key: 'addressLine', label: 'Address Line', placeholder: 'House no., Street, Area' },
                    { key: 'city',        label: 'City',         placeholder: 'e.g. Bhubaneswar' },
                    { key: 'state',       label: 'State',        placeholder: 'e.g. Odisha' },
                    { key: 'pincode',     label: 'Pincode',      placeholder: '6 digit pincode' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-[#2C1A0E] mb-1">{label}</label>
                      <input
                        value={addressForm[key]}
                        placeholder={placeholder}
                        onChange={e => setAddressForm(f => ({ ...f, [key]: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5B0] text-sm text-[#2C1A0E] focus:outline-none focus:border-[#C0522B] transition-colors" />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setAddressEditMode(false); setAddressIsNew(false); setEditingIndex(null); setAddressError(''); }}
                    className="flex-1 py-2.5 rounded-xl border border-[#E8D5B0] text-[#7B5C3A] text-sm font-semibold hover:border-[#C0522B] transition-all">
                    Back
                  </button>
                  <button onClick={handleSaveAddress} disabled={savingAddress}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C0522B] text-white text-sm font-semibold hover:bg-[#9A3E1E] transition-all disabled:opacity-60">
                    <Save size={14} /> {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </>
            )}

          </motion.div>
        </div>
      )}
    </div>
  );
}
