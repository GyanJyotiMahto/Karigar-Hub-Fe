import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Leaf, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQty, totalItems, subtotal } = useCart();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingBag size={24} className="text-[#C0522B]" />
          <h1 className="font-display text-3xl font-bold text-[#2C1A0E]">आपकी Cart</h1>
          <span className="bg-[#C0522B] text-white text-xs font-bold px-2.5 py-1 rounded-full">{totalItems}</span>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag size={48} className="text-[#E8D5B0] mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">Cart खाली है</h2>
            <p className="text-[#7B5C3A] mb-6">Discover handcrafted treasures from India's finest karigars.</p>
            <Link to="/products" className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
              Shopping शुरू करें <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item, i) => (
                  <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-4 flex gap-4">
                    <Link to={`/products/${item._id}`}>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F5ECD8] shrink-0">
                        {item.images?.[0]
                          ? <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-3xl">🎨</div>
                        }
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1 mb-0.5">
                            <MapPin size={10} className="text-[#C0522B]" />
                            <p className="text-[10px] text-[#C0522B] font-bold uppercase tracking-wide">
                              {item.artist?.name || '—'}
                            </p>
                          </div>
                          <Link to={`/products/${item._id}`}>
                            <h3 className="font-display font-bold text-[#2C1A0E] text-sm leading-snug hover:text-[#C0522B] transition-colors line-clamp-2">{item.name}</h3>
                          </Link>
                          <p className="text-xs text-[#7B5C3A] mt-0.5">{item.category}</p>
                          {/* Customization tags */}
                          {item.customizations && Object.keys(item.customizations).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {Object.entries(item.customizations).map(([k, v]) => (
                                <span key={k} className="text-[10px] bg-[#C0522B]/10 text-[#C0522B] px-2 py-0.5 rounded-full font-semibold">
                                  {k}: {v}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(item._cartItemId || item._id)} className="text-[#7B5C3A] hover:text-red-500 transition-colors shrink-0 p-1">
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#E8D5B0] rounded-full overflow-hidden">
                          <button onClick={() => updateQty(item._cartItemId || item._id, -1)} className="px-3 py-1.5 text-[#5C3317] hover:bg-[#F5ECD8] transition-colors text-sm font-bold">−</button>
                          <span className="px-3 py-1.5 text-sm font-bold text-[#2C1A0E]">{item.quantity}</span>
                          <button onClick={() => updateQty(item._cartItemId || item._id, 1)} className="px-3 py-1.5 text-[#5C3317] hover:bg-[#F5ECD8] transition-colors text-sm font-bold">+</button>
                        </div>
                        <span className="font-display font-bold text-[#2C1A0E]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex items-start gap-3 bg-[#1E4D2B]/8 border border-[#1E4D2B]/20 rounded-2xl p-4">
                <Leaf size={18} className="text-[#1E4D2B] mt-0.5 shrink-0" />
                <p className="text-sm text-[#1E4D2B] leading-relaxed">
                  आपकी cart <strong>{cart.length} karigar परिवारों</strong> को सहारा देती है। 80% of your payment goes directly to the makers.
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-2xl border border-[#E8D5B0]/60 p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold text-[#2C1A0E] mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm text-[#5C3317]">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-[#5C3317]">
                    <span>Shipping</span>
                    <span className={`font-bold ${shipping === 0 ? 'text-[#1E4D2B]' : ''}`}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-[#7B5C3A]">Add ₹{(1000 - subtotal).toLocaleString('en-IN')} more for free shipping</p>
                  )}
                  <div className="border-t border-[#E8D5B0] pt-3 flex justify-between">
                    <span className="font-bold text-[#2C1A0E]">Total</span>
                    <span className="font-display text-xl font-bold text-[#2C1A0E]">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link to="/checkout"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#C0522B] text-white rounded-xl font-bold hover:bg-[#9A3E1E] transition-all shadow-md mb-3">
                  Checkout करें <ArrowRight size={16} />
                </Link>
                <Link to="/products"
                  className="flex items-center justify-center w-full py-3 border border-[#E8D5B0] text-[#5C3317] rounded-xl text-sm font-semibold hover:bg-[#F5ECD8] transition-colors">
                  Shopping जारी रखें
                </Link>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-[#7B5C3A]">
                  <span>🔒 Secure Checkout</span>
                  <span>🇮🇳 Made in India</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
