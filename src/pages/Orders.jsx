import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClipboardList, Package, ArrowRight, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import InvoiceButton from '../components/InvoiceButton';
import { getMyOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';

function Badge({ label, color }) {
  const cls = {
    green:  'bg-green-100  text-green-700  border-green-200',
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue:   'bg-blue-100   text-blue-700   border-blue-200',
    gray:   'bg-[#E8D5B0]  text-[#7B5C3A]  border-[#E8D5B0]',
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cls[color]}`}>
      {label}
    </span>
  );
}

function OrderCard({ order, index }) {
  const [expanded, setExpanded] = useState(false);
  const date     = new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const orderId  = order.orderId || order._id;
  const products = order.products || order.items || [];
  const addr     = order.shippingAddress || {};
  const PAY_LABEL = { upi: 'UPI', card: 'Card', cod: 'COD', razorpay: 'Razorpay' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden hover:shadow-md transition-shadow">

      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">

        {/* Product thumbnails */}
        <div className="flex -space-x-2 shrink-0">
          {products.slice(0, 3).map((p, i) => {
            const imgSrc = p.image || p.product?.images?.[0] || '';
            return imgSrc
              ? <img key={i} src={imgSrc} alt={p.name || 'Product'} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
              : <div key={i} className="w-12 h-12 rounded-xl bg-[#F5ECD8] border-2 border-white flex items-center justify-center text-lg">🎨</div>;
          })}
          {products.length > 3 && (
            <div className="w-12 h-12 rounded-xl bg-[#F5ECD8] border-2 border-white flex items-center justify-center text-xs font-bold text-[#7B5C3A]">
              +{products.length - 3}
            </div>
          )}
        </div>

        {/* Order meta */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-display font-bold text-[#C0522B] text-sm">{String(orderId).slice(-8).toUpperCase()}</span>
            <span className="text-[#E8D5B0]">·</span>
            <span className="text-xs text-[#7B5C3A]">{date}</span>
          </div>
          <p className="text-sm text-[#5C3317] line-clamp-1">
            {products.map(p => p.name || p.product?.name || 'Product').join(', ')}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge label={order.isPaid ? '✓ Paid' : '⏳ Payment Pending'} color={order.isPaid ? 'green' : 'yellow'} />
            <Badge label={order.isDelivered ? '✓ Delivered' : '🚚 Processing'} color={order.isDelivered ? 'green' : 'blue'} />
            <Badge label={PAY_LABEL[order.paymentMethod] || order.paymentMethod || 'Online'} color="gray" />
          </div>
        </div>

        {/* Total + expand */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
          <span className="font-display text-xl font-bold text-[#2C1A0E]">₹{(Number(order.totalPrice) || 0).toLocaleString('en-IN')}</span>
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1 text-xs text-[#C0522B] font-semibold hover:underline transition-all">
            {expanded ? <><ChevronUp size={13} /> Less</> : <><ChevronDown size={13} /> Details</>}
          </button>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-[#E8D5B0]/60 px-5 pb-5 pt-4 space-y-4">
          <div>
            <p className="text-xs font-bold text-[#7B5C3A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Package size={11} /> Items
            </p>
            <div className="space-y-2.5">
              {products.map((item, idx) => {
                const imgSrc = item.image || item.product?.images?.[0] || '';
                const price  = Number(item.price || item.product?.price || 0);
                const qty    = Number(item.quantity || 1);
                return (
                  <div key={item._id || idx} className="flex gap-3 items-start">
                    {imgSrc
                      ? <img src={imgSrc} alt={item.name || 'Product'} className="w-10 h-10 rounded-lg object-cover shrink-0 border border-[#E8D5B0]" />
                      : <div className="w-10 h-10 rounded-lg bg-[#F5ECD8] shrink-0 border border-[#E8D5B0] flex items-center justify-center">🎨</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2C1A0E] line-clamp-1">{item.name || item.product?.name || 'Product'}</p>
                      <p className="text-xs text-[#7B5C3A]">Qty: {qty}</p>
                      {item.customizationNote?.trim() && (
                        <div className="mt-1.5 bg-[#FDF6EC] border border-[#E8D5B0] rounded-lg px-2.5 py-1.5">
                          <p className="text-[10px] font-bold text-[#7B5C3A] uppercase tracking-wide mb-0.5">✏️ Customization Note</p>
                          <p className="text-xs text-[#5C3317]">{item.customizationNote}</p>
                          <span className={`inline-flex items-center mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.customizationStatus === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                            item.customizationStatus === 'rejected' ? 'bg-red-100 text-red-600 border-red-200' :
                            'bg-yellow-100 text-yellow-700 border-yellow-200'
                          }`}>
                            {item.customizationStatus === 'accepted' ? '✓ Accepted' :
                             item.customizationStatus === 'rejected' ? '✕ Rejected' : '⏳ Pending'}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-[#2C1A0E] shrink-0">₹{(price * qty).toLocaleString('en-IN')}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {(addr.city || addr.addressLine || addr.fullName) && (
            <div className="flex items-start gap-2 text-sm text-[#5C3317]">
              <MapPin size={14} className="text-[#C0522B] mt-0.5 shrink-0" />
              <span>{[addr.fullName, addr.addressLine || addr.line1, addr.city, addr.state, addr.pincode].filter(Boolean).join(' · ')}</span>
            </div>
          )}
          <div className="flex justify-end pt-1">
            <InvoiceButton orderId={order._id} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const [filter, setFilter]   = useState('all');
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getMyOrders()
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [user]);

  const filtered = orders.filter(o => {
    if (filter === 'active')    return !o.isDelivered;
    if (filter === 'delivered') return  o.isDelivered;
    if (filter === 'pending')   return !o.isPaid;
    return true;
  });

  const counts = {
    all:       orders.length,
    active:    orders.filter(o => !o.isDelivered).length,
    delivered: orders.filter(o =>  o.isDelivered).length,
    pending:   orders.filter(o => !o.isPaid).length,
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        <div className="flex items-center gap-3 mb-8">
          <ClipboardList size={24} className="text-[#C0522B]" />
          <h1 className="font-display text-3xl font-bold text-[#2C1A0E]">My Orders</h1>
          <span className="bg-[#C0522B] text-white text-xs font-bold px-2.5 py-1 rounded-full">{orders.length}</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: 'all',       label: 'All Orders' },
            { key: 'active',    label: 'Active' },
            { key: 'delivered', label: 'Delivered' },
            { key: 'pending',   label: 'Payment Pending' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f.key
                  ? 'bg-[#C0522B] text-white shadow-sm'
                  : 'bg-white border border-[#E8D5B0] text-[#5C3317] hover:border-[#C0522B]'
              }`}>
              {f.label} <span className="ml-1 text-xs opacity-70">({counts[f.key]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8D5B0]/50 p-5 animate-pulse flex gap-4">
                <div className="flex gap-1">{[...Array(2)].map((_, j) => <div key={j} className="w-12 h-12 rounded-xl bg-[#E8D5B0]" />)}</div>
                <div className="flex-1 space-y-2"><div className="h-4 bg-[#E8D5B0] rounded w-1/3" /><div className="h-3 bg-[#E8D5B0] rounded w-2/3" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <ClipboardList size={48} className="text-[#E8D5B0] mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">कोई order नहीं</h2>
            <p className="text-[#7B5C3A] mb-6">No orders found for this filter.</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
              Shopping शुरू करें <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order, i) => (
              <OrderCard key={order._id || order.orderId || i} order={order} index={i} />
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="mt-8 text-center">
            <Link to="/products"
              className="inline-flex items-center gap-2 border border-[#E8D5B0] text-[#5C3317] px-6 py-3 rounded-full font-semibold hover:bg-[#F5ECD8] transition-colors text-sm">
              और Products देखें <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
