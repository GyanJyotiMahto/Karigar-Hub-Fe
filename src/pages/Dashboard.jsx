import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ShoppingBag, BarChart2, Settings, LogOut, Eye, Plus, Edit, Trash2, Menu, X, IndianRupee, Bell, User, Store, Shield, Save, CheckCircle, Video, Loader2, Sparkles, Check, XCircle, Users } from 'lucide-react';
import { getMyProducts, getMyOrders, deleteProduct, updateArtistProfile, createWorkshop, getMyWorkshops, deleteWorkshop, getKarigarCustomizationRequests, updateCustomizationStatus, getArtistOrders, getArtistFollowers } from '../services/api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  Shipped: 'bg-blue-100 text-blue-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

const navItems = [
  { icon: LayoutDashboard, label: 'Overview',        id: 'overview' },
  { icon: Package,         label: 'Products',        id: 'products' },
  { icon: ShoppingBag,     label: 'Orders',          id: 'orders' },
  { icon: Sparkles,        label: 'Customizations',  id: 'customizations' },
  { icon: Users,           label: 'Followers',       id: 'followers' },
  { icon: Video,           label: 'Workshops',       id: 'workshops' },
  { icon: BarChart2,       label: 'Analytics',       id: 'analytics' },
  { icon: Settings,        label: 'Settings',        id: 'settings' },
];

function StatCard({ title, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="font-display text-2xl font-bold text-[#2C1A0E] mb-0.5">{value}</p>
      <p className="text-sm text-[#7B5C3A]">{title}</p>
      {sub && <p className="text-xs text-[#C0522B] mt-1">{sub}</p>}
    </div>
  );
}

function AddProductForm({ onClose }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold text-[#2C1A0E]">नया Product जोड़ें</h3>
        <button onClick={onClose} className="text-[#7B5C3A] hover:text-[#C0522B]"><X size={20} /></button>
      </div>
      <p className="text-sm text-[#7B5C3A]">Use the <Link to="/dashboard/products/add" className="text-[#C0522B] font-semibold hover:underline">Add Product page</Link> to create a new listing.</p>
    </div>
  );
}

const SETTING_TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business', icon: Store },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account & Security', icon: Shield },
];

function SettingsPanel({ user }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [profile, setProfile] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const [business, setBusiness] = useState({
    businessName: user?.businessName || '',
    category: user?.category || '',
    addressLine: user?.address?.addressLine || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('kh_notif_prefs');
      return saved ? JSON.parse(saved) : { orderAlerts: true, paymentAlerts: true, reviewAlerts: true, marketingEmails: false };
    } catch { return { orderAlerts: true, paymentAlerts: true, reviewAlerts: true, marketingEmails: false }; }
  });

  const [account, setAccount] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveProfile = async () => {
    setSaving(true); setError('');
    try {
      await updateArtistProfile({ name: profile.name, phone: profile.phone, bio: profile.bio });
      showSaved();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleSaveBusiness = async () => {
    setSaving(true); setError('');
    try {
      await updateArtistProfile({
        businessName: business.businessName,
        category: business.category,
        address: {
          addressLine: business.addressLine,
          city: business.city,
          state: business.state,
          pincode: business.pincode,
        },
      });
      showSaved();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('kh_notif_prefs', JSON.stringify(notifications));
    showSaved();
  };

  const handleChangePassword = async () => {
    setError('');
    if (!account.newPassword || account.newPassword !== account.confirmPassword) {
      setError('New passwords do not match.'); return;
    }
    if (account.newPassword.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setSaving(true);
    try {
      await updateArtistProfile({ password: account.newPassword });
      setAccount({ currentPassword: '', newPassword: '', confirmPassword: '' });
      showSaved();
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const inputCls = 'w-full border border-[#E8D5B0] rounded-xl px-3 py-2.5 text-sm text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C0522B]/30 focus:border-[#C0522B] bg-white';
  const labelCls = 'block text-xs font-bold text-[#7B5C3A] mb-1.5 uppercase tracking-wide';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Section Nav */}
        <div className="lg:w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-2 flex lg:flex-col gap-1">
            {SETTING_TABS.map(tab => (
              <button key={tab.id} onClick={() => { setActiveSection(tab.id); setError(''); }}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all w-full ${
                  activeSection === tab.id ? 'bg-[#C0522B] text-white' : 'text-[#7B5C3A] hover:bg-[#F5ECD8] hover:text-[#2C1A0E]'
                }`}>
                <tab.icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{error}</div>
          )}
          {saved && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 flex items-center gap-2">
              <CheckCircle size={15} /> Changes saved successfully!
            </div>
          )}

          {/* Profile */}
          {activeSection === 'profile' && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-5">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Profile Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input className={inputCls} value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input className={inputCls} value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Bio / About You</label>
                <textarea rows={4} className={inputCls} value={profile.bio}
                  placeholder="Tell customers about your craft and story..."
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
              </div>
              <div className="pt-1">
                <label className={labelCls}>Email</label>
                <input className={`${inputCls} bg-[#F5ECD8]/50 cursor-not-allowed`} value={user?.email || ''} disabled />
                <p className="text-xs text-[#7B5C3A] mt-1">Email cannot be changed. Contact support if needed.</p>
              </div>
              <button onClick={handleSaveProfile} disabled={saving}
                className="flex items-center gap-2 bg-[#C0522B] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-colors disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {/* Business */}
          {activeSection === 'business' && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-5">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Business Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Business Name</label>
                  <input className={inputCls} value={business.businessName}
                    onChange={e => setBusiness(b => ({ ...b, businessName: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Craft Category</label>
                  <input className={inputCls} value={business.category}
                    onChange={e => setBusiness(b => ({ ...b, category: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Address Line</label>
                <input className={inputCls} value={business.addressLine}
                  onChange={e => setBusiness(b => ({ ...b, addressLine: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>City</label>
                  <input className={inputCls} value={business.city}
                    onChange={e => setBusiness(b => ({ ...b, city: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>State</label>
                  <input className={inputCls} value={business.state}
                    onChange={e => setBusiness(b => ({ ...b, state: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Pincode</label>
                  <input className={inputCls} value={business.pincode}
                    onChange={e => setBusiness(b => ({ ...b, pincode: e.target.value }))} />
                </div>
              </div>
              <button onClick={handleSaveBusiness} disabled={saving}
                className="flex items-center gap-2 bg-[#C0522B] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-colors disabled:opacity-60">
                <Save size={14} /> {saving ? 'Saving...' : 'Save Business Info'}
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-5">
              <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'orderAlerts', label: 'New Order Alerts', desc: 'Get notified when a customer places an order' },
                  { key: 'paymentAlerts', label: 'Payment Confirmations', desc: 'Receive alerts when payments are received' },
                  { key: 'reviewAlerts', label: 'New Reviews', desc: 'Know when customers leave a review on your products' },
                  { key: 'marketingEmails', label: 'Marketing & Tips', desc: 'Receive tips to grow your business on Karigar Hub' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-[#E8D5B0]/50 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#2C1A0E]">{label}</p>
                      <p className="text-xs text-[#7B5C3A] mt-0.5">{desc}</p>
                    </div>
                    <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[key] ? 'bg-[#C0522B]' : 'bg-[#E8D5B0]'
                      }`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[key] ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveNotifications}
                className="flex items-center gap-2 bg-[#C0522B] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-colors">
                <Save size={14} /> Save Preferences
              </button>
            </div>
          )}

          {/* Account & Security */}
          {activeSection === 'account' && (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 space-y-4">
                <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Change Password</h3>
                <div>
                  <label className={labelCls}>New Password</label>
                  <input type="password" className={inputCls} value={account.newPassword}
                    placeholder="Min. 6 characters"
                    onChange={e => setAccount(a => ({ ...a, newPassword: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <input type="password" className={inputCls} value={account.confirmPassword}
                    onChange={e => setAccount(a => ({ ...a, confirmPassword: e.target.value }))} />
                </div>
                <button onClick={handleChangePassword} disabled={saving}
                  className="flex items-center gap-2 bg-[#C0522B] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-colors disabled:opacity-60">
                  <Shield size={14} /> {saving ? 'Updating...' : 'Update Password'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-1">Account Status</h3>
                <p className="text-sm text-[#7B5C3A] mb-3">Your verification and account standing.</p>
                <div className="flex flex-wrap gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    user?.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user?.isVerified ? '✓ Verified Karigar' : '⏳ Verification Pending'}
                  </span>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 text-blue-700">
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function WorkshopModal({ onClose, onCreated }) {
  const inputCls = 'w-full border border-[#E8D5B0] rounded-xl px-3 py-2.5 text-sm text-[#2C1A0E] focus:outline-none focus:ring-2 focus:ring-[#C0522B]/30 focus:border-[#C0522B] bg-white';
  const labelCls = 'block text-xs font-bold text-[#7B5C3A] mb-1.5 uppercase tracking-wide';

  const [form, setForm] = useState({
    title: '', description: '', date: '', fromTime: '', toTime: '',
    duration: '', zoomLink: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setF = (k, v) => {
    setForm(f => {
      const updated = { ...f, [k]: v };
      // Auto-calculate duration when both times set
      if ((k === 'fromTime' || k === 'toTime') && updated.fromTime && updated.toTime) {
        const [fh, fm] = updated.fromTime.split(':').map(Number);
        const [th, tm] = updated.toTime.split(':').map(Number);
        const diff = (th * 60 + tm) - (fh * 60 + fm);
        if (diff > 0) updated.duration = `${Math.floor(diff / 60)}h ${diff % 60}m`;
        else updated.duration = '';
      }
      return updated;
    });
    setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())           e.title           = 'Title is required';
    if (!form.description.trim())     e.description     = 'Description is required';
    if (!form.date)                   e.date            = 'Date is required';
    if (!form.fromTime)               e.fromTime        = 'From time is required';
    if (!form.toTime)                 e.toTime          = 'To time is required';
    if (form.fromTime && form.toTime && form.fromTime >= form.toTime)
                                      e.toTime          = 'To Time must be after From Time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true); setSubmitError('');
    try {
      const res = await createWorkshop({ ...form });
      onCreated(res.workshop);
      onClose();
    } catch (e) { setSubmitError(e.message); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#E8D5B0]/60">
          <div className="flex items-center gap-2">
            <Video size={18} className="text-[#C0522B]" />
            <h3 className="font-display text-xl font-bold text-[#2C1A0E]">Create Workshop</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F5ECD8] transition-colors">
            <X size={18} className="text-[#7B5C3A]" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {submitError && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{submitError}</div>
          )}

          <div>
            <label className={labelCls}>Workshop Title *</label>
            <input className={inputCls} value={form.title} placeholder="e.g. Madhubani Painting Basics"
              onChange={e => setF('title', e.target.value)} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className={labelCls}>Description *</label>
            <textarea rows={3} className={inputCls} value={form.description}
              placeholder="What will participants learn?"
              onChange={e => setF('description', e.target.value)} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Date *</label>
              <input type="date" className={inputCls} value={form.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={e => setF('date', e.target.value)} />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className={labelCls}>From Time *</label>
              <input type="time" className={inputCls} value={form.fromTime}
                onChange={e => setF('fromTime', e.target.value)} />
              {errors.fromTime && <p className="text-xs text-red-500 mt-1">{errors.fromTime}</p>}
            </div>
            <div>
              <label className={labelCls}>To Time *</label>
              <input type="time" className={inputCls} value={form.toTime}
                onChange={e => setF('toTime', e.target.value)} />
              {errors.toTime && <p className="text-xs text-red-500 mt-1">{errors.toTime}</p>}
            </div>
          </div>

          <div>
            <label className={labelCls}>Duration (auto-calculated)</label>
            <input className={`${inputCls} bg-[#F5ECD8]/50`} value={form.duration}
              placeholder="e.g. 1h 30m"
              onChange={e => setF('duration', e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Meeting Link</label>
            <input className={inputCls} value={form.zoomLink}
              placeholder="Add link"
              onChange={e => setF('zoomLink', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-[#E8D5B0]/60">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[#E8D5B0] text-[#7B5C3A] text-sm font-semibold hover:border-[#C0522B] transition-all">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#C0522B] text-white text-sm font-semibold hover:bg-[#9A3E1E] transition-all disabled:opacity-60">
            {saving ? <><Loader2 size={14} className="animate-spin" /> Creating...</> : <><Video size={14} /> Create Workshop</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const { user, logout } = useAuth();
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [customizationRequests, setCustomizationRequests] = useState([]);
  const [customizationLoading, setCustomizationLoading] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [followersLoading, setFollowersLoading] = useState(false);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    getMyProducts()
      .then(data => setArtisanProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingProducts(false));
    getArtistOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {});
    getMyWorkshops()
      .then(data => setWorkshops(Array.isArray(data) ? data : []))
      .catch(() => {});
    setCustomizationLoading(true);
    getKarigarCustomizationRequests()
      .then(data => setCustomizationRequests(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setCustomizationLoading(false));
    if (user?._id || user?.id) {
      setFollowersLoading(true);
      getArtistFollowers(user._id || user.id)
        .then(data => setFollowers(Array.isArray(data) ? data : []))
        .catch(() => {})
        .finally(() => setFollowersLoading(false));
    }
  }, []);

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setArtisanProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch {}
  };

  const handleDeleteWorkshop = async (id) => {
    try {
      await deleteWorkshop(id);
      setWorkshops(prev => prev.filter(w => w._id !== id));
    } catch {}
  };

  const handleCustomizationAction = async (orderItemId, status) => {
    try {
      await updateCustomizationStatus(orderItemId, status);
      setCustomizationRequests(prev =>
        prev.map(r => r.orderItemId.toString() === orderItemId.toString()
          ? { ...r, customizationStatus: status }
          : r
        )
      );
    } catch {}
  };

  const OrderRow = ({ order, idx }) => (
    <tr key={order._id || idx} className="hover:bg-[#F5ECD8]/30 transition-colors">
      <td className="px-4 py-3 font-mono text-xs text-[#C0522B] font-bold">
        {order._id ? `#KH-${order._id.slice(-4).toUpperCase()}` : '—'}
      </td>
      <td className="px-4 py-3 font-semibold text-[#2C1A0E]">{order.user?.name || 'Customer'}</td>
      <td className="px-4 py-3 text-[#5C3317] max-w-[160px] truncate">{order.products?.[0]?.product?.name || 'Product'}</td>
      <td className="px-4 py-3 font-bold text-[#2C1A0E]">₹{(order.totalPrice || 0).toLocaleString('en-IN')}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${order.isDelivered ? statusColors.Delivered : order.isPaid ? statusColors.Shipped : statusColors.Processing}`}>
          {order.isDelivered ? 'Delivered' : order.isPaid ? 'Shipped' : 'Processing'}
        </span>
      </td>
      <td className="px-4 py-3 text-[#7B5C3A]">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}</td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-[#F5ECD8]/30 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#1E0E06] flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold font-display">क</div>
            <div>
              <span className="font-display text-base font-bold text-white block">Karigar Hub</span>
              <span className="text-[9px] tracking-widest text-[#C0522B]">KARIGAR DASHBOARD</span>
            </div>
          </Link>
        </div>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold text-sm overflow-hidden">
              {user?.profileImage
                ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" />
                : user?.name?.[0]?.toUpperCase() || 'K'
              }
            </div>
            <div>
              <p className="text-white text-sm font-bold">{user?.name || 'Karigar'}</p>
              <p className="text-[#B8A080] text-xs">{user?.category || 'Artisan'} · {user?.address?.state || 'India'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const pendingCount = item.id === 'customizations'
              ? customizationRequests.filter(r => r.customizationStatus === 'pending').length
              : 0;
            return (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id ? 'bg-[#C0522B] text-white' : 'text-[#B8A080] hover:bg-white/10 hover:text-white'
                }`}>
                <item.icon size={16} /> {item.label}
                {pendingCount > 0 && (
                  <span className="ml-auto bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#B8A080] hover:bg-white/10 hover:text-white text-sm font-semibold transition-all">
            <LogOut size={16} /> Back to Store
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E8D5B0]/60 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F5ECD8] text-[#5C3317]">
              <Menu size={20} />
            </button>
            <div>
              <h1 className="font-display text-xl font-bold text-[#2C1A0E] capitalize">{activeTab}</h1>
              <p className="text-xs text-[#7B5C3A]">नमस्ते, {user?.name?.split(' ')[0] || 'Karigar'} जी! 🙏</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard/products/add"
              className="flex items-center gap-2 bg-[#C0522B] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-colors">
              <Plus size={14} /> Add Product
            </Link>
            <button onClick={() => setShowWorkshopModal(true)}
              className="flex items-center gap-2 bg-[#1E4D2B] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#163a20] transition-colors">
              <Video size={14} /> Create Workshop
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {/* Overview */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Earnings" value="₹0"
                  sub="Connect payments to track"
                  icon={IndianRupee} color="bg-[#C0522B]/10 text-[#C0522B]" />
                <StatCard title="Active Products" value={artisanProducts.length}
                  sub={`${artisanProducts.filter(p => !p.stock || p.stock === 0).length} out of stock`}
                  icon={Package} color="bg-[#1E4D2B]/10 text-[#1E4D2B]" />
                <StatCard title="Total Orders" value={orders.length}
                  sub={`${orders.filter(o => !o.isDelivered).length} pending`}
                  icon={ShoppingBag} color="bg-blue-100 text-blue-600" />
                <StatCard title="Followers" value={followers.length}
                  sub="People following you"
                  icon={Users} color="bg-purple-100 text-purple-600" />
              </div>

              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
                <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Recent Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-[#C0522B] font-semibold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5ECD8]/50">
                      <tr>{['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#7B5C3A] uppercase tracking-wide">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D5B0]/40">
                      {orders.length === 0
                        ? <tr><td colSpan={6} className="text-center py-10 text-[#7B5C3A]">No orders yet.</td></tr>
                        : orders.slice(0, 5).map((order, idx) => <OrderRow key={order._id || idx} order={order} idx={idx} />)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {showAddForm && <div className="mb-6"><AddProductForm onClose={() => setShowAddForm(false)} /></div>}
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
                <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#2C1A0E]">मेरे Products ({artisanProducts.length})</h3>
                  <Link to="/dashboard/products/add" className="flex items-center gap-1.5 text-sm text-[#C0522B] font-semibold hover:underline">
                    <Plus size={14} /> Add New
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5ECD8]/50">
                      <tr>{['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#7B5C3A] uppercase tracking-wide">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D5B0]/40">
                      {artisanProducts.length === 0
                        ? <tr><td colSpan={6} className="text-center py-10 text-[#7B5C3A]">No products yet. <Link to="/dashboard/products/add" className="text-[#C0522B] font-semibold hover:underline">Add your first product</Link></td></tr>
                        : artisanProducts.map(product => (
                          <tr key={product._id} className="hover:bg-[#F5ECD8]/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                {product.images?.[0] && <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                <span className="font-semibold text-[#2C1A0E] max-w-[160px] truncate">{product.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#5C3317]">{product.category}</td>
                            <td className="px-4 py-3 font-bold text-[#2C1A0E]">₹{product.price?.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-bold text-[#2C1A0E]">⭐ {product.ratings || 0}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Link to="/dashboard/products/add" state={{ product }} className="p-1.5 rounded-lg hover:bg-[#F5ECD8] text-[#5C3317] hover:text-[#C0522B] transition-colors"><Edit size={14} /></Link>
                                <button onClick={() => handleDeleteProduct(product._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#5C3317] hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
                <div className="p-5 border-b border-[#E8D5B0]/60">
                  <h3 className="font-display text-lg font-bold text-[#2C1A0E]">All Orders ({orders.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5ECD8]/50">
                      <tr>{['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#7B5C3A] uppercase tracking-wide">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D5B0]/40">
                      {orders.length === 0
                        ? <tr><td colSpan={6} className="text-center py-10 text-[#7B5C3A]">No orders yet.</td></tr>
                        : orders.map((order, idx) => <OrderRow key={order._id || idx} order={order} idx={idx} />)
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Customizations Tab */}
          {activeTab === 'customizations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
                <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-[#C0522B]" />
                    <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Customization Requests ({customizationRequests.length})</h3>
                  </div>
                  {customizationRequests.filter(r => r.customizationStatus === 'pending').length > 0 && (
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200 px-2.5 py-1 rounded-full">
                      {customizationRequests.filter(r => r.customizationStatus === 'pending').length} Pending
                    </span>
                  )}
                </div>

                {customizationLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin text-[#C0522B]" />
                  </div>
                ) : customizationRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">✏️</p>
                    <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">No customization requests</h3>
                    <p className="text-[#7B5C3A] text-sm">Requests will appear here when customers add customization notes.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8D5B0]/40">
                    {customizationRequests.map(req => (
                      <div key={req.orderItemId} className="p-4 hover:bg-[#F5ECD8]/20 transition-colors">
                        <div className="flex items-start gap-4">
                          {/* Product image */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F5ECD8] shrink-0 border border-[#E8D5B0]">
                            {req.product?.images?.[0]
                              ? <img src={req.product.images[0]} alt={req.product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center text-xl">🎨</div>
                            }
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-semibold text-[#2C1A0E] text-sm truncate">{req.product?.name || 'Product'}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                req.customizationStatus === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                                req.customizationStatus === 'rejected' ? 'bg-red-100 text-red-600 border-red-200' :
                                'bg-yellow-100 text-yellow-700 border-yellow-200'
                              }`}>
                                {req.customizationStatus === 'accepted' ? '✓ Accepted' :
                                 req.customizationStatus === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                              </span>
                            </div>
                            <p className="text-xs text-[#7B5C3A] mb-1">
                              <span className="font-semibold">{req.user?.name || 'Customer'}</span>
                              {req.user?.email && <span className="ml-1 opacity-70">· {req.user.email}</span>}
                              <span className="ml-1">· Qty: {req.quantity}</span>
                            </p>
                            <div className="bg-[#FDF6EC] border border-[#E8D5B0] rounded-lg px-3 py-2 mb-2">
                              <p className="text-[10px] font-bold text-[#7B5C3A] uppercase tracking-wide mb-0.5">Customization Note</p>
                              <p className="text-xs text-[#5C3317]">{req.customizationNote}</p>
                            </div>
                            <p className="text-[10px] text-[#B09070]">
                              Order #{String(req.orderId).slice(-6).toUpperCase()} · {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>

                          {/* Action buttons — only show when pending */}
                          {req.customizationStatus === 'pending' && (
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() => handleCustomizationAction(req.orderItemId, 'accepted')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-xs font-bold transition-colors">
                                <Check size={12} /> Accept
                              </button>
                              <button
                                onClick={() => handleCustomizationAction(req.orderItemId, 'rejected')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-xs font-bold transition-colors">
                                <XCircle size={12} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Followers Tab */}
          {activeTab === 'followers' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
                <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center gap-2">
                  <Users size={16} className="text-[#C0522B]" />
                  <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Followers ({followers.length})</h3>
                </div>
                {followersLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={24} className="animate-spin text-[#C0522B]" />
                  </div>
                ) : followers.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">👥</p>
                    <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">No followers yet</h3>
                    <p className="text-[#7B5C3A] text-sm">When users follow you, they'll appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8D5B0]/40">
                    {followers.map((f, i) => (
                      <div key={f._id || i} className="flex items-center gap-4 px-5 py-3 hover:bg-[#F5ECD8]/30 transition-colors">
                        <div className="w-9 h-9 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {f.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2C1A0E] truncate">{f.name || 'User'}</p>
                          <p className="text-xs text-[#7B5C3A] truncate">{f.email || ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Workshops Tab */}
          {activeTab === 'workshops' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
                <div className="p-5 border-b border-[#E8D5B0]/60 flex items-center justify-between">
                  <h3 className="font-display text-lg font-bold text-[#2C1A0E]">My Workshops ({workshops.length})</h3>
                  <button onClick={() => setShowWorkshopModal(true)}
                    className="flex items-center gap-1.5 text-sm text-[#1E4D2B] font-semibold hover:underline">
                    <Plus size={14} /> Create New
                  </button>
                </div>
                {workshops.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-5xl mb-4">🎓</p>
                    <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">No workshops yet</h3>
                    <p className="text-[#7B5C3A] mb-6">Share your craft knowledge with the world.</p>
                    <button onClick={() => setShowWorkshopModal(true)}
                      className="inline-flex items-center gap-2 bg-[#1E4D2B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#163a20] transition-all">
                      <Video size={16} /> Create First Workshop
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-[#E8D5B0]/40">
                    {workshops.map(w => (
                      <div key={w._id} className="flex items-start gap-4 p-4 hover:bg-[#F5ECD8]/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-[#1E4D2B]/10 flex items-center justify-center shrink-0">
                          <Video size={18} className="text-[#1E4D2B]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-[#2C1A0E] truncate">{w.title}</p>
                          <p className="text-xs text-[#7B5C3A] mt-0.5">
                            {new Date(w.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {w.fromTime} – {w.toTime}
                            {w.duration && ` · ${w.duration}`}
                          </p>
                          <a href={w.zoomLink} target="_blank" rel="noreferrer"
                            className="text-xs text-[#C0522B] font-semibold hover:underline mt-0.5 block truncate">{w.zoomLink}</a>
                        </div>
                        <button onClick={() => handleDeleteWorkshop(w._id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-[#5C3317] hover:text-red-500 transition-colors shrink-0">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

              {/* ── KPI Cards ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
                  const paidOrders   = orders.filter(o => o.isPaid).length;
                  const outOfStock   = artisanProducts.filter(p => !p.stock || p.stock === 0).length;
                  const avgOrderVal  = orders.length ? Math.round(totalRevenue / orders.length) : 0;
                  return [
                    { label: 'Total Investment',  value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'bg-[#C0522B]/10 text-[#C0522B]',   sub: `${paidOrders} paid orders` },
                    { label: 'Total Orders',     value: orders.length,                               icon: ShoppingBag, color: 'bg-blue-100 text-blue-600',         sub: `${orders.filter(o=>!o.isDelivered).length} pending` },
                    { label: 'Products Listed',  value: artisanProducts.length,                      icon: Package,     color: 'bg-[#1E4D2B]/10 text-[#1E4D2B]',   sub: `${outOfStock} out of stock` },
                    { label: 'Avg Order Value',  value: `₹${avgOrderVal.toLocaleString('en-IN')}`,  icon: BarChart2,   color: 'bg-purple-100 text-purple-600',     sub: `across ${orders.length} orders` },
                  ].map(({ label, value, icon: Icon, color, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-5 hover:shadow-md transition-shadow">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                        <Icon size={18} />
                      </div>
                      <p className="font-display text-2xl font-bold text-[#2C1A0E] mb-0.5">{value}</p>
                      <p className="text-sm text-[#7B5C3A]">{label}</p>
                      <p className="text-xs text-[#C0522B] mt-1">{sub}</p>
                    </div>
                  ));
                })()}
              </div>

              {/* ── Orders Over Time (monthly bar chart) ── */}
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-5">Orders — Last 6 Months</h3>
                {(() => {
                  const months = [];
                  for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    months.push({ label: d.toLocaleString('en-IN', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() });
                  }
                  const counts = months.map(m =>
                    orders.filter(o => {
                      const d = new Date(o.createdAt);
                      return d.getMonth() === m.month && d.getFullYear() === m.year;
                    }).length
                  );
                  const max = Math.max(...counts, 1);
                  return (
                    <div className="flex items-end gap-3 h-36">
                      {months.map((m, i) => (
                        <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-xs font-bold text-[#C0522B]">{counts[i] || ''}</span>
                          <div className="w-full rounded-t-lg bg-[#C0522B]/15 relative" style={{ height: '96px' }}>
                            <div
                              className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-[#C0522B] transition-all duration-500"
                              style={{ height: `${(counts[i] / max) * 96}px` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#7B5C3A] font-semibold">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ── Revenue Over Time ── */}
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-5">Revenue — Last 6 Months</h3>
                {(() => {
                  const months = [];
                  for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    months.push({ label: d.toLocaleString('en-IN', { month: 'short' }), year: d.getFullYear(), month: d.getMonth() });
                  }
                  const revenues = months.map(m =>
                    orders
                      .filter(o => { const d = new Date(o.createdAt); return d.getMonth() === m.month && d.getFullYear() === m.year; })
                      .reduce((s, o) => s + (o.totalPrice || 0), 0)
                  );
                  const max = Math.max(...revenues, 1);
                  return (
                    <div className="flex items-end gap-3 h-36">
                      {months.map((m, i) => (
                        <div key={m.label} className="flex-1 flex flex-col items-center gap-1">
                          <span className="text-[10px] font-bold text-[#1E4D2B]">{revenues[i] ? `₹${(revenues[i]/1000).toFixed(1)}k` : ''}</span>
                          <div className="w-full rounded-t-lg bg-[#1E4D2B]/10 relative" style={{ height: '96px' }}>
                            <div
                              className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-[#1E4D2B] transition-all duration-500"
                              style={{ height: `${(revenues[i] / max) * 96}px` }}
                            />
                          </div>
                          <span className="text-[10px] text-[#7B5C3A] font-semibold">{m.label}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ── Bottom Row: Product Performance + Order Status + Followers ── */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Top Products by order frequency */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                  <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-4">Top Products</h3>
                  {(() => {
                    const freq = {};
                    orders.forEach(o =>
                      o.products?.forEach(p => {
                        const name = p.product?.name || 'Unknown';
                        freq[name] = (freq[name] || 0) + (p.quantity || 1);
                      })
                    );
                    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
                    const maxQ = sorted[0]?.[1] || 1;
                    if (!sorted.length) return <p className="text-sm text-[#7B5C3A]">No order data yet.</p>;
                    return (
                      <div className="space-y-3">
                        {sorted.map(([name, qty]) => (
                          <div key={name}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-[#2C1A0E] truncate max-w-[70%]">{name}</span>
                              <span className="text-[#C0522B] font-bold">{qty} sold</span>
                            </div>
                            <div className="h-2 bg-[#F5ECD8] rounded-full overflow-hidden">
                              <div className="h-full bg-[#C0522B] rounded-full" style={{ width: `${(qty / maxQ) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>

                {/* Order Status Breakdown */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                  <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-4">Order Status</h3>
                  {(() => {
                    const delivered  = orders.filter(o => o.isDelivered).length;
                    const paid       = orders.filter(o => o.isPaid && !o.isDelivered).length;
                    const processing = orders.filter(o => !o.isPaid && !o.isDelivered).length;
                    const total      = orders.length || 1;
                    const rows = [
                      { label: 'Delivered',  count: delivered,  color: 'bg-green-500',  light: 'bg-green-100 text-green-700' },
                      { label: 'Shipped',    count: paid,       color: 'bg-blue-500',   light: 'bg-blue-100 text-blue-700' },
                      { label: 'Processing', count: processing, color: 'bg-yellow-400', light: 'bg-yellow-100 text-yellow-700' },
                    ];
                    if (!orders.length) return <p className="text-sm text-[#7B5C3A]">No orders yet.</p>;
                    return (
                      <div className="space-y-3">
                        {rows.map(r => (
                          <div key={r.label}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="font-semibold text-[#2C1A0E]">{r.label}</span>
                              <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${r.light}`}>{r.count}</span>
                            </div>
                            <div className="h-2 bg-[#F5ECD8] rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.count / total) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                        <p className="text-xs text-[#7B5C3A] pt-1">Total: {orders.length} orders</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Followers + Workshops summary */}
                <div className="lg:col-span-1 bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                  <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-4">Audience & Reach</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#F5ECD8]/60 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-[#C0522B]" />
                        <span className="text-sm font-semibold text-[#2C1A0E]">Followers</span>
                      </div>
                      <span className="font-display text-xl font-bold text-[#C0522B]">{followers.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F5ECD8]/60 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Video size={16} className="text-[#1E4D2B]" />
                        <span className="text-sm font-semibold text-[#2C1A0E]">Workshops</span>
                      </div>
                      <span className="font-display text-xl font-bold text-[#1E4D2B]">{workshops.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F5ECD8]/60 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-600" />
                        <span className="text-sm font-semibold text-[#2C1A0E]">Custom Requests</span>
                      </div>
                      <span className="font-display text-xl font-bold text-purple-600">{customizationRequests.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#F5ECD8]/60 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-blue-600" />
                        <span className="text-sm font-semibold text-[#2C1A0E]">In Stock</span>
                      </div>
                      <span className="font-display text-xl font-bold text-blue-600">
                        {artisanProducts.filter(p => p.stock > 0).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Category Breakdown ── */}
              {artisanProducts.length > 0 && (() => {
                const cats = {};
                artisanProducts.forEach(p => { cats[p.category || 'Other'] = (cats[p.category || 'Other'] || 0) + 1; });
                const entries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
                const total = artisanProducts.length;
                const palette = ['bg-[#C0522B]','bg-[#1E4D2B]','bg-blue-500','bg-purple-500','bg-yellow-500','bg-pink-500'];
                return (
                  <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
                    <h3 className="font-display text-base font-bold text-[#2C1A0E] mb-4">Products by Category</h3>
                    <div className="flex gap-2 mb-4 flex-wrap">
                      {entries.map(([cat, count], i) => (
                        <div key={cat} className="flex items-center gap-1.5">
                          <span className={`w-3 h-3 rounded-full ${palette[i % palette.length]}`} />
                          <span className="text-xs text-[#5C3317] font-semibold">{cat} ({count})</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex h-4 rounded-full overflow-hidden gap-0.5">
                      {entries.map(([cat, count], i) => (
                        <div key={cat} className={`${palette[i % palette.length]} transition-all`}
                          style={{ width: `${(count / total) * 100}%` }}
                          title={`${cat}: ${count}`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

            </motion.div>
          )}

          {activeTab === 'settings' && (
            <SettingsPanel user={user} />
          )}
        </main>
      </div>

      {showWorkshopModal && (
        <WorkshopModal
          onClose={() => setShowWorkshopModal(false)}
          onCreated={w => setWorkshops(prev => [w, ...prev])}
        />
      )}
    </div>
  );
}
