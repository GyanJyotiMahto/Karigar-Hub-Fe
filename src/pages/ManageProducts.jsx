// API integrated
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, BarChart2, Eye, EyeOff,
  Package, LayoutDashboard, ShoppingBag, Settings, LogOut, Menu,
  X, TrendingUp, IndianRupee, Search, AlertTriangle
} from 'lucide-react';
import { getMyProducts, deleteProduct, updateProduct } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ─── Sidebar nav (mirrors Dashboard.jsx) ─────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: 'Overview',  href: '/dashboard' },
  { icon: Package,         label: 'Products',  href: '/dashboard/products' },
  { icon: ShoppingBag,     label: 'Orders',    href: '/dashboard' },
  { icon: BarChart2,       label: 'Analytics', href: '/dashboard' },
  { icon: Settings,        label: 'Settings',  href: '/dashboard' },
];

const statusStyle = {
  active:   'bg-green-100 text-green-700',
  inactive: 'bg-[#C0522B]/10 text-[#C0522B]',
  draft:    'bg-[#E8D5B0] text-[#7B5C3A]',
};

// ─── Sales Modal ─────────────────────────────────────────────────────────────
function SalesModal({ product, onClose }) {
  const data = { monthly: [0,0,0,0,0,0], labels: ['Jan','Feb','Mar','Apr','May','Jun'], revenue: 0, units: product.numReviews || 0 };
  const max = Math.max(...data.monthly, 1);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display text-lg font-bold text-[#2C1A0E]">Sales Overview</h3>
            <p className="text-xs text-[#7B5C3A] mt-0.5 line-clamp-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-[#7B5C3A] hover:text-[#C0522B] transition-colors"><X size={20} /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#F5ECD8]/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee size={14} className="text-[#C0522B]" />
              <span className="text-xs font-semibold text-[#7B5C3A]">Total Revenue</span>
            </div>
            <p className="font-display text-xl font-bold text-[#2C1A0E]">₹{data.revenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-[#F5ECD8]/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={14} className="text-[#1E4D2B]" />
              <span className="text-xs font-semibold text-[#7B5C3A]">Units Sold</span>
            </div>
            <p className="font-display text-xl font-bold text-[#2C1A0E]">{data.units}</p>
          </div>
        </div>

        {/* Bar chart */}
        <p className="text-xs font-bold text-[#7B5C3A] uppercase tracking-wider mb-3">Monthly Sales (2025)</p>
        <div className="flex items-end gap-2 h-24">
          {data.monthly.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#C0522B]/15 rounded-t-md relative overflow-hidden"
                style={{ height: `${(val / max) * 80}px`, minHeight: val > 0 ? '4px' : '2px' }}>
                <motion.div initial={{ height: 0 }} animate={{ height: '100%' }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="absolute bottom-0 left-0 right-0 bg-[#C0522B] rounded-t-md" />
              </div>
              <span className="text-[9px] text-[#9B7A5A] font-semibold">{data.labels[i]}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ product, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 w-full max-w-sm shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-red-500" />
        </div>
        <h3 className="font-display text-lg font-bold text-[#2C1A0E] mb-2">Delete Product?</h3>
        <p className="text-sm text-[#7B5C3A] mb-6">
          "<span className="font-semibold text-[#2C1A0E]">{product.name}</span>" will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-[#E8D5B0] text-[#5C3317] font-semibold hover:bg-[#F5ECD8] transition-colors text-sm">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-2.5 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm">
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ManageProducts() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user }  = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('all');
  const [salesProduct,  setSalesProduct]  = useState(null);
  const [deleteProductModal, setDeleteProductModal] = useState(null);

  useEffect(() => {
    getMyProducts()
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
                        p.category?.toLowerCase().includes(search.toLowerCase());
    const status = p.status || 'active';
    const matchFilter = filter === 'all' || status === filter;
    return matchSearch && matchFilter;
  });

  const toggleStatus = async (id) => {
    const product = products.find(p => (p._id || p.id) === id);
    if (!product || product.status === 'draft') return;
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      await updateProduct(id, { status: newStatus });
      setProducts(prev => prev.map(p => (p._id || p.id) === id ? { ...p, status: newStatus } : p));
    } catch {}
  };

  const confirmDelete = async () => {
    if (!deleteProductModal) return;
    try {
      await deleteProduct(deleteProductModal._id || deleteProductModal.id);
      setProducts(prev => prev.filter(p => (p._id || p.id) !== (deleteProductModal._id || deleteProductModal.id)));
    } catch {}
    setDeleteProductModal(null);
  };

  const counts = {
    all:      products.length,
    active:   products.filter(p => (p.status || 'active') === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    draft:    products.filter(p => p.status === 'draft').length,
  };

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
            <div className="w-10 h-10 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold">
              {user?.name?.[0] || 'K'}
            </div>
            <div>
              <p className="text-white text-sm font-bold">{user?.name || 'Karigar'}</p>
              <p className="text-[#B8A080] text-xs">{user?.category || 'Artist'} · {user?.address?.state || 'India'}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.label} to={item.href} onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                location.pathname === item.href ? 'bg-[#C0522B] text-white' : 'text-[#B8A080] hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon size={16} /> {item.label}
            </Link>
          ))}
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
              <h1 className="font-display text-xl font-bold text-[#2C1A0E]">मेरे Products</h1>
              <p className="text-xs text-[#7B5C3A]">Manage your product listings</p>
            </div>
          </div>
          <Link to="/dashboard/products/add"
            className="flex items-center gap-2 bg-[#C0522B] text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-colors">
            <Plus size={14} /> Add Product
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

            {/* Filter tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="flex gap-2 flex-wrap">
                {['all', 'active', 'inactive', 'draft'].map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                      filter === f
                        ? 'bg-[#C0522B] text-white shadow-sm'
                        : 'bg-white border border-[#E8D5B0] text-[#5C3317] hover:border-[#C0522B]'
                    }`}>
                    {f} <span className="ml-1 text-xs opacity-70">({counts[f]})</span>
                  </button>
                ))}
              </div>
              <div className="relative sm:ml-auto">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7B5C3A]" />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  type="text" placeholder="Search products..."
                  className="pl-9 pr-4 py-2 rounded-full border border-[#E8D5B0] bg-white text-[#2C1A0E] text-sm focus:outline-none focus:border-[#C0522B] w-full sm:w-56 transition-all" />
              </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">
              {filtered.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-[#F5ECD8] flex items-center justify-center mb-4">
                    <Package size={28} className="text-[#C0522B]" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#2C1A0E] mb-2">
                    {search ? 'कोई परिणाम नहीं' : 'अभी कोई product नहीं'}
                  </h3>
                  <p className="text-[#7B5C3A] text-sm mb-6 max-w-xs">
                    {search ? 'Try a different search term.' : 'Start by adding your first handcrafted product.'}
                  </p>
                  {!search && (
                    <Link to="/dashboard/products/add"
                      className="flex items-center gap-2 bg-[#C0522B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-colors text-sm">
                      <Plus size={14} /> Add Your First Product
                    </Link>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F5ECD8]/50">
                      <tr>
                        {['Product', 'Category', 'Price', 'Stock', 'Status', 'Sales', 'Actions'].map(h => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-bold text-[#7B5C3A] uppercase tracking-wide whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D5B0]/40">
                      <AnimatePresence>
                        {filtered.map(product => (
                          <motion.tr key={product._id || product.id}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="hover:bg-[#F5ECD8]/30 transition-colors">
                            {/* Product */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img src={product.images?.[0] || product.image} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[#E8D5B0]" />
                                <div className="min-w-0">
                                  <p className="font-semibold text-[#2C1A0E] truncate max-w-[160px]">{product.name}</p>
                                </div>
                              </div>
                            </td>
                            {/* Category */}
                            <td className="px-4 py-3 text-[#5C3317] whitespace-nowrap">{product.category}</td>
                            {/* Price */}
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="font-bold text-[#2C1A0E]">₹{product.price.toLocaleString('en-IN')}</span>
                              {product.originalPrice && (
                                <span className="text-xs text-[#9B7A5A] line-through ml-1">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                              )}
                            </td>
                            {/* Stock */}
                            <td className="px-4 py-3">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                (product.stock || 0) === 0 ? 'bg-red-100 text-red-600'
                                : (product.stock || 0) <= 5 ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                              }`}>
                                {(product.stock || 0) === 0 ? 'Out of Stock' : `${product.stock} left`}
                              </span>
                            </td>
                            {/* Status toggle */}
                            <td className="px-4 py-3">
                              <button onClick={() => toggleStatus(product._id || product.id)}
                                className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-all ${statusStyle[product.status || 'active']} cursor-pointer hover:opacity-80`}>
                                {(product.status || 'active') === 'active' ? <Eye size={11} /> : <EyeOff size={11} />}
                                <span className="capitalize">{product.status || 'active'}</span>
                              </button>
                            </td>
                            {/* Sales */}
                            <td className="px-4 py-3 font-semibold text-[#2C1A0E]">{product.numReviews || 0} sold</td>
                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1">
                                {/* View Sales */}
                                <button onClick={() => setSalesProduct(product)}
                                  title="View Sales"
                                  className="p-1.5 rounded-lg hover:bg-[#F5ECD8] text-[#5C3317] hover:text-[#C0522B] transition-colors">
                                  <BarChart2 size={14} />
                                </button>
                                {/* Edit */}
                                <Link to="/dashboard/products/add" state={{ product }}
                                  title="Edit"
                                  className="p-1.5 rounded-lg hover:bg-[#F5ECD8] text-[#5C3317] hover:text-[#1E4D2B] transition-colors">
                                  <Edit size={14} />
                                </Link>
                                {/* Delete */}
                                <button onClick={() => setDeleteProductModal(product)}
                                  title="Delete"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#5C3317] hover:text-red-500 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Modals */}
      {salesProduct  && <SalesModal  product={salesProduct}  onClose={() => setSalesProduct(null)} />}
      {deleteProductModal && <DeleteModal product={deleteProductModal} onConfirm={confirmDelete} onClose={() => setDeleteProductModal(null)} />}
    </div>
  );
}
