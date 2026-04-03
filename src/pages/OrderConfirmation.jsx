// TODO: Replace with backend API later
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MapPin, CreditCard, Package, ArrowRight, ClipboardList } from 'lucide-react';
import InvoiceButton from '../components/InvoiceButton';

// ─── Status badge helper ──────────────────────────────────────────────────────
function StatusBadge({ label, color }) {
  const styles = {
    yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    blue:   'bg-blue-100  text-blue-700  border-blue-200',
    green:  'bg-green-100 text-green-700 border-green-200',
  };
  return (
    <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${styles[color]}`}>
      {label}
    </span>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between items-start gap-4 py-2.5 border-b border-[#E8D5B0]/60 last:border-0">
      <span className="text-sm text-[#7B5C3A] shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#2C1A0E] text-right">{value}</span>
    </div>
  );
}

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate  = useNavigate();

  // Order passed from Checkout via navigate state
  // TODO: Replace with backend API later — GET /api/orders/:id
  const order = location.state?.order;

  // If someone lands here directly without placing an order, redirect to home
  useEffect(() => {
    if (!order) navigate('/', { replace: true });
  }, [order, navigate]);

  if (!order) return null;

  const { orderId, shippingAddress: addr, paymentMethod, totalPrice, products, isPaid, isDelivered, placedAt } = order;

  const payLabel = { upi: 'UPI Payment', card: 'Credit / Debit Card', cod: 'Cash on Delivery' };
  const dateStr  = new Date(placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">

        {/* ── Success Header ── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10">

          {/* Animated checkmark ring */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-[#1E4D2B]/10 flex items-center justify-center">
              <CheckCircle size={44} className="text-[#1E4D2B]" />
            </motion.div>
            {/* Ripple rings */}
            {[1, 2].map(i => (
              <motion.div key={i}
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1.2, delay: 0.2 * i, repeat: Infinity, repeatDelay: 1 }}
                className="absolute inset-0 rounded-full border-2 border-[#1E4D2B]/30"
              />
            ))}
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="font-devanagari text-[#C0522B] text-xl mb-2">धन्यवाद! 🙏</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="font-display text-3xl font-bold text-[#2C1A0E] mb-3">Order Confirmed!</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-[#7B5C3A] leading-relaxed max-w-sm mx-auto">
            Your order <span className="font-bold text-[#C0522B]">{orderId}</span> has been placed. The karigar will begin crafting your item with love and care.
          </motion.p>
        </motion.div>

        {/* ── Order Status Badges ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="flex justify-center gap-3 mb-8">
          <StatusBadge label={`Payment: ${isPaid ? 'Paid' : 'Pending'}`}   color={isPaid ? 'green' : 'yellow'} />
          <StatusBadge label={`Delivery: ${isDelivered ? 'Delivered' : 'Processing'}`} color={isDelivered ? 'green' : 'blue'} />
        </motion.div>

        {/* ── Order Details Card ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden mb-5">

          {/* Header */}
          <div className="bg-[#F5ECD8]/60 px-6 py-4 border-b border-[#E8D5B0]/60 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#7B5C3A] font-semibold uppercase tracking-wider">Order ID</p>
              <p className="font-display text-lg font-bold text-[#C0522B]">{orderId}</p>
            </div>
            <p className="text-xs text-[#7B5C3A]">{dateStr}</p>
          </div>

          <div className="p-6 space-y-0">
            {/* Products ordered */}
            <div className="mb-4">
              <p className="text-xs font-bold text-[#7B5C3A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Package size={12} /> Items Ordered
              </p>
              <div className="space-y-3">
                {products.map((item, idx) => {
                  // Safe field resolution with fallbacks
                  const imgSrc  = item?.image || item?.imageUrl || item?.product?.image || item?.product?.images?.[0] || '';
                  const price   = Number(item?.price || item?.product?.price || 0);
                  const qty     = Number(item?.quantity || 1);
                  const total   = isNaN(price * qty) ? 0 : price * qty;
                  console.log('Order item data:', item);
                  return (
                  <div key={item.id || item._id || idx} className="flex gap-3 items-center">
                    {imgSrc
                      ? <img src={imgSrc} alt={item.name || 'Product'} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-[#E8D5B0]" />
                      : <div className="w-12 h-12 rounded-xl shrink-0 border border-[#E8D5B0] bg-[#F5ECD8] flex items-center justify-center text-xl">🎨</div>
                    }
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2C1A0E] line-clamp-1">{item.name || 'Product'}</p>
                      <p className="text-xs text-[#7B5C3A]">Qty: {qty} · by {item.artisan || item.product?.artist?.name || 'Karigar'}</p>
                    </div>
                    <span className="text-sm font-bold text-[#2C1A0E] shrink-0">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[#E8D5B0]/60 pt-4">
              {/* Shipping address */}
              <p className="text-xs font-bold text-[#7B5C3A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin size={12} /> Shipping Address
              </p>
              <InfoRow label="Name"    value={addr.fullName} />
              <InfoRow label="Phone"   value={`+91 ${addr.phone}`} />
              <InfoRow label="Address" value={[addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean).join(', ')} />
            </div>

            <div className="border-t border-[#E8D5B0]/60 pt-4">
              {/* Payment */}
              <p className="text-xs font-bold text-[#7B5C3A] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard size={12} /> Payment
              </p>
              <InfoRow label="Method"  value={payLabel[paymentMethod] || paymentMethod} />
              <InfoRow label="Status"  value={isPaid ? '✅ Paid' : '⏳ Pending'} />
            </div>

            <div className="border-t border-[#E8D5B0]/60 pt-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#2C1A0E]">Total Paid</span>
                <span className="font-display text-2xl font-bold text-[#2C1A0E]">₹{(Number(totalPrice) || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── CTA Buttons ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}
          className="flex flex-col sm:flex-row gap-3">
          <Link to="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#C0522B] text-white rounded-full font-bold hover:bg-[#9A3E1E] transition-all shadow-md">
            Shopping जारी रखें <ArrowRight size={16} />
          </Link>
          <Link to="/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 border border-[#E8D5B0] text-[#5C3317] rounded-full font-semibold hover:bg-[#F5ECD8] transition-all">
            <ClipboardList size={16} /> My Orders देखें
          </Link>
          <div className="flex-1">
            <InvoiceButton orderId={orderId} fullWidth />
          </div>
        </motion.div>

        <p className="text-center text-xs text-[#7B5C3A] mt-6">
          A confirmation has been sent to <span className="font-semibold">{order.user.email}</span>
        </p>
      </div>
    </div>
  );
}
