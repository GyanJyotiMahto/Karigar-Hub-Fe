import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Lock, ChevronRight, AlertCircle, Leaf,
  CreditCard, CheckCircle2, XCircle, Loader2,
  ShieldCheck, Zap, Truck,
} from 'lucide-react';
import { placeOrder, createPaymentOrder, verifyPayment, saveAddress } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LocationPicker from "../components/LocationPicker";

const RAZORPAY_KEY_ID = 'rzp_test_SXij1zXDGrKPrt';

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala',
  'Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

const inputCls = 'w-full px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#B09070] text-sm focus:outline-none focus:border-[#C0522B] focus:ring-2 focus:ring-[#C0522B]/10 transition-all';
const errCls   = 'text-xs text-red-500 mt-1 flex items-center gap-1';

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">{label}</label>
      {children}
      {error && <p className={errCls}><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

/* ── Razorpay script loader ── */
function loadRazorpayScript() {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const shipping = subtotal > 999 ? 0 : 99;
  const total    = subtotal + shipping;

  const [addr, setAddr] = useState({
    fullName: user?.name || '',
    phone:    user?.phone || '',
    email:    user?.email || '',
    line1: '', line2: '', city: '', pincode: '', state: '',
    lat: null,   // ✅ ADD
    lng: null    // ✅ ADD
  });

  const [customizationNotes, setCustomizationNotes] = useState({});  // keyed by cart item _id

  const [addressMode, setAddressMode] = useState('manual');
  const [errors,     setErrors]     = useState({});
  const [loading,    setLoading]    = useState(false);
  const [orderError, setOrderError] = useState('');
  const [payStatus,  setPayStatus]  = useState(null); // null | 'success' | 'failed'

  const setA = (k, v) => setAddr(a => ({ ...a, [k]: v }));

  /* ── Address validation only (no card/UPI fields needed) ── */
  const validate = () => {
    const e = {};
    if (!addr.fullName.trim())             e.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(addr.phone))      e.phone    = 'Enter a valid 10-digit mobile number';
    if (!/\S+@\S+\.\S+/.test(addr.email)) e.email    = 'Enter a valid email address';
    if (!addr.line1.trim())                e.line1    = 'Address is required';
    if (!addr.city.trim())                 e.city     = 'City is required';
    if (!/^\d{6}$/.test(addr.pincode))     e.pincode  = 'Enter a valid 6-digit PIN code';
    if (!addr.state)                       e.state    = 'Please select your state';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ── Main pay handler ── */
  const handlePayNow = async () => {
    if (cart.length === 0) return;
    if (!validate()) return;

    setLoading(true);
    setOrderError('');
    setPayStatus(null);

    try {
      /* 1. Load Razorpay script */
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load. Check your internet connection.');

      /* 2. Create Razorpay order on backend */
      const { orderId: rzpOrderId, amount: rzpAmount, currency } = await createPaymentOrder(total);

      /* 3. Open Razorpay checkout popup */
      await new Promise((resolve, reject) => {
        const options = {
          key:         RAZORPAY_KEY_ID,
          amount:      rzpAmount,
          currency,
          name:        'Karigar Hub',
          description: `Order of ${cart.length} item${cart.length > 1 ? 's' : ''}`,
          order_id:    rzpOrderId,
          prefill: {
            name:    addr.fullName,
            email:   addr.email,
            contact: `+91${addr.phone}`,
          },
          theme: { color: '#C0522B' },
          handler: async (response) => {
            try {
              /* 4. Verify signature on backend */
              const verification = await verifyPayment({
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });

              if (!verification.success) throw new Error('Signature mismatch');

              /* 5. Place order in DB */
              const orderPayload = {
                products: cart.map(i => ({
                  product: i._id,
                  quantity: i.quantity,
                  customizationNote: customizationNotes[i._id] || "",
                })),
                totalPrice: total,
                paymentMethod: 'razorpay',
                shippingAddress: {
                  addressLine: `${addr.line1}${addr.line2 ? ', ' + addr.line2 : ''}`,
                  city:    addr.city,
                  state:   addr.state,
                  pincode: addr.pincode,
                },
              };
              const order = await placeOrder(orderPayload);

              // Save address to user profile after successful payment
              saveAddress(addr).catch(() => {});

              console.log('Payment successful:', {
                payment_id: response.razorpay_payment_id,
                status: 'success',
              });

              setPayStatus('success');
              clearCart();

              // Enrich order products with cart data (image, name, price, artisan)
              const enrichedProducts = cart.map(i => ({
                id:       i._id,
                name:     i.name || '',
                price:    Number(i.price) || 0,
                quantity: Number(i.quantity) || 1,
                image:    i.images?.[0] || i.image || '',
                artisan:  i.artisan || i.artist?.name || '',
              }));

              setTimeout(() => {
                navigate('/order-confirmation', {
                  state: {
                    order: {
                      ...order,
                      orderId: order._id,
                      products: enrichedProducts,
                      shippingAddress: addr,
                      paymentMethod: 'razorpay',
                      paymentId: response.razorpay_payment_id,
                    },
                  },
                });
              }, 1800);

              resolve();
            } catch (err) {
              console.log('Payment failed after handler:', err.message);
              setPayStatus('failed');
              setOrderError(err.message || 'Payment verification failed.');
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              console.log('Payment dismissed by user');
              setLoading(false);
              reject(new Error('dismissed'));
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          console.log('Payment failed:', {
            payment_id: response.error.metadata?.payment_id,
            status: 'failed',
          });
          setPayStatus('failed');
          setOrderError(response.error.description || 'Payment failed. Please try again.');
          reject(new Error(response.error.description));
        });
        rzp.open();
      });

    } catch (err) {
      if (err.message !== 'dismissed') {
        setOrderError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6EC] pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">Cart is empty</h2>
          <Link to="/products" className="text-[#C0522B] font-semibold hover:underline">Browse products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#7B5C3A] mb-8">
          <Link to="/cart" className="hover:text-[#C0522B] transition-colors">Cart</Link>
          <ChevronRight size={14} />
          <span className="text-[#2C1A0E] font-semibold">Checkout</span>
        </nav>

        <h1 className="font-display text-3xl font-bold text-[#2C1A0E] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Address + Payment section ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping Address */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin size={18} className="text-[#C0522B]" />
                <h2 className="font-display text-xl font-bold text-[#2C1A0E]">Delivery Address</h2>
              </div>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setAddressMode('manual')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    addressMode === 'manual' ? 'bg-[#C0522B] text-white' : 'bg-[#F5ECD8] text-[#2C1A0E]'
                  }`}
                >
                  Enter Manually
                </button>
                <button
                  type="button"
                  onClick={() => setAddressMode('map')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                    addressMode === 'map' ? 'bg-[#C0522B] text-white' : 'bg-[#F5ECD8] text-[#2C1A0E]'
                  }`}
                >
                  Use Map 📍
                </button>
              </div>
              {addressMode === 'map' && (
                <div className="mb-4">
                  <LocationPicker setAddr={setAddr} />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full Name *" error={errors.fullName}>
                  <input value={addr.fullName} onChange={e => setA('fullName', e.target.value)} type="text" placeholder="Aapka Naam" className={inputCls} />
                </Field>
                <Field label="Mobile Number *" error={errors.phone}>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] text-sm font-semibold shrink-0">🇮🇳 +91</span>
                    <input value={addr.phone} onChange={e => setA('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} type="tel" placeholder="98765 43210" className={inputCls} />
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email Address *" error={errors.email}>
                    <input value={addr.email} onChange={e => setA('email', e.target.value)} type="email" placeholder="aap@example.com" className={inputCls} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address Line 1 *" error={errors.line1}>
                    <input value={addr.line1} onChange={e => setA('line1', e.target.value)} type="text" placeholder="Flat / House No., Street, Area" className={inputCls} />
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Address Line 2">
                    <input value={addr.line2} onChange={e => setA('line2', e.target.value)} type="text" placeholder="Landmark (optional)" className={inputCls} />
                  </Field>
                </div>
                <Field label="City *" error={errors.city}>
                  <input value={addr.city} onChange={e => setA('city', e.target.value)} type="text" placeholder="e.g. Jaipur" className={inputCls} />
                </Field>
                <Field label="PIN Code *" error={errors.pincode}>
                  <input value={addr.pincode} onChange={e => setA('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} type="text" placeholder="302001" className={inputCls} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="State *" error={errors.state}>
                    <select value={addr.state} onChange={e => setA('state', e.target.value)} className={inputCls + ' cursor-pointer'}>
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </Field>
                </div>
              </div>
            </motion.div>

            {/* ── Payment Section ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="bg-white rounded-2xl border border-[#E8D5B0]/60 overflow-hidden">

              {/* Header */}
              <div className="px-6 py-5 border-b border-[#F5ECD8] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF4EC] flex items-center justify-center">
                  <CreditCard size={20} className="text-[#C0522B]" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-[#2C1A0E]">Payment</h2>
                  <p className="text-xs text-[#7B5C3A] font-medium">Secured by Razorpay</p>
                </div>
                <img
                  src="https://razorpay.com/assets/razorpay-glyph.svg"
                  alt="Razorpay"
                  className="ml-auto h-7 opacity-70"
                  onError={e => e.target.style.display = 'none'}
                />
              </div>

              {/* Accepted methods */}
              <div className="px-6 py-5">
                <p className="text-sm font-semibold text-[#5C3317] mb-4">Accepted Payment Methods</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { icon: '📱', label: 'UPI',          sub: 'GPay · PhonePe · Paytm · BHIM' },
                    { icon: '💳', label: 'Cards',         sub: 'Visa · Mastercard · RuPay'     },
                    { icon: '🏦', label: 'Net Banking',   sub: 'All major Indian banks'         },
                  ].map(m => (
                    <div key={m.label}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[#E8D5B0] bg-[#FDFAF5]">
                      <span className="text-xl">{m.icon}</span>
                      <div>
                        <p className="text-sm font-bold text-[#2C1A0E]">{m.label}</p>
                        <p className="text-[11px] text-[#7B5C3A]">{m.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {[
                    { icon: ShieldCheck, text: '100% Secure Payments' },
                    { icon: Zap,         text: 'Instant Confirmation'  },
                    { icon: Truck,       text: 'Free Returns'          },
                  ].map(b => (
                    <div key={b.text} className="flex items-center gap-1.5 text-xs font-semibold text-[#5C3317]">
                      <b.icon size={13} className="text-[#C0522B]" />
                      {b.text}
                    </div>
                  ))}
                </div>

                {/* Amount summary */}
                <div className="bg-[#FDF4EC] rounded-xl px-5 py-4 flex items-center justify-between border border-[#E8D5B0]">
                  <div>
                    <p className="text-xs font-semibold text-[#7B5C3A] mb-0.5">Amount to Pay</p>
                    <p className="text-2xl font-extrabold text-[#C0522B] font-display">
                      ₹{total.toLocaleString('en-IN')}
                    </p>
                    {shipping === 0 && (
                      <p className="text-[11px] text-[#1E4D2B] font-semibold mt-0.5">✓ Free shipping applied</p>
                    )}
                  </div>
                  <div className="text-right text-xs text-[#7B5C3A] space-y-0.5">
                    <p>Subtotal: ₹{subtotal.toLocaleString('en-IN')}</p>
                    <p>Shipping: {shipping === 0 ? 'FREE' : `₹${shipping}`}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Karigar support note */}
            <div className="flex items-start gap-3 bg-[#1E4D2B]/8 border border-[#1E4D2B]/20 rounded-2xl p-4">
              <Leaf size={18} className="text-[#1E4D2B] mt-0.5 shrink-0" />
              <p className="text-sm text-[#1E4D2B] leading-relaxed">
                आपकी खरीद <strong>{cart.length} karigar परिवारों</strong> को सहारा देती है। 80% of your payment goes directly to the makers.
              </p>
            </div>
          </div>

          {/* ── Right: Order Summary + Pay button ── */}
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold text-[#2C1A0E] mb-5">Order Summary</h2>

              {/* Cart items */}
              <div className="space-y-3 mb-5">
                {cart.map(item => (
                  <div key={item._id} className="flex flex-col gap-2">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5ECD8] shrink-0 border border-[#E8D5B0]">
                        {item.images?.[0]
                          ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-xl">🎨</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#2C1A0E] line-clamp-1">{item.name}</p>
                        <p className="text-xs text-[#7B5C3A]">Qty: {item.quantity} · {item.category}</p>
                      </div>
                      <span className="text-sm font-bold text-[#2C1A0E] shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                    <textarea
                      rows={2}
                      value={customizationNotes[item._id] || ''}
                      onChange={e => setCustomizationNotes(n => ({ ...n, [item._id]: e.target.value }))}
                      placeholder="Add customization note (optional)"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8D5B0] bg-[#FDF6EC] text-[#2C1A0E] placeholder-[#B09070] focus:outline-none focus:border-[#C0522B] focus:ring-1 focus:ring-[#C0522B]/20 resize-none transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-[#E8D5B0] pt-4 space-y-2 mb-5">
                <div className="flex justify-between text-sm text-[#5C3317]">
                  <span>Subtotal</span>
                  <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-[#5C3317]">
                  <span>Shipping</span>
                  <span className={`font-bold ${shipping === 0 ? 'text-[#1E4D2B]' : ''}`}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-[#2C1A0E] pt-2 border-t border-[#E8D5B0]">
                  <span>Total</span>
                  <span className="font-display text-xl">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Error message */}
              {orderError && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
                  <XCircle size={15} className="shrink-0 mt-0.5" />
                  {orderError}
                </div>
              )}

              {/* Payment status feedback */}
              <AnimatePresence>
                {payStatus === 'success' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    Payment Successful! Redirecting…
                  </motion.div>
                )}
                {payStatus === 'failed' && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-2">
                    <XCircle size={16} />
                    Payment Failed. Please try again.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pay Now button */}
              <button
                onClick={handlePayNow}
                disabled={loading || payStatus === 'success'}
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#C0522B] text-white rounded-xl font-bold hover:bg-[#9A3E1E] active:scale-[0.98] transition-all shadow-md mb-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> Processing…</>
                ) : payStatus === 'success' ? (
                  <><CheckCircle2 size={18} /> Payment Successful</>
                ) : (
                  <><Lock size={16} /> Pay ₹{total.toLocaleString('en-IN')}</>
                )}
              </button>

              <p className="text-center text-xs text-[#7B5C3A]">🔒 Secured by Razorpay · 🇮🇳 Made in India</p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
