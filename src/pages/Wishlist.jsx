import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2, MapPin, Star, Sparkles } from 'lucide-react';
import { toggleWishlist, getWishlist } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState([]);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getWishlist()
      .then(data => setItems(data.wishlist || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  const remove = async (id) => {
    try {
      await toggleWishlist(id);
      setItems(prev => prev.filter(p => (p._id || p.id) !== id));
    } catch (err) {
      console.error('Remove wishlist error:', err);
    }
  };

  const addToCart = id => {
    setAddedIds(prev => [...prev, id]);
    setTimeout(() => setAddedIds(prev => prev.filter(x => x !== id)), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Heart size={24} className="text-[#C0522B] fill-[#C0522B]" />
          <h1 className="font-display text-3xl font-bold text-[#2C1A0E]">मेरी Wishlist</h1>
          <span className="bg-[#C0522B] text-white text-xs font-bold px-2.5 py-1 rounded-full">{items.length}</span>
        </div>

        {!user ? (
          <div className="text-center py-20">
            <Heart size={52} className="text-[#E8D5B0] mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">Sign in to view your Wishlist</h2>
            <p className="text-[#7B5C3A] mb-6">Save your favourite handcrafted pieces here.</p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
              Sign In <ArrowRight size={16} />
            </Link>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8D5B0]/50 overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#E8D5B0]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#E8D5B0] rounded w-1/2" />
                  <div className="h-4 bg-[#E8D5B0] rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <Heart size={52} className="text-[#E8D5B0] mx-auto mb-4" />
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">Wishlist खाली है</h2>
            <p className="text-[#7B5C3A] mb-6">Save your favourite handcrafted pieces here.</p>
            <Link to="/products"
              className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
              Products देखें <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {items.map((product, i) => {
                const pid = product._id || product.id;
                const imgSrc = product.images?.[0] || product.image;
                const artisanName = product.artisan || product.artist?.name || '';
                const inStock = product.stock === undefined || product.stock === null ? true : product.stock > 0;
                return (
                <motion.div key={pid}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8D5B0]/50 shadow-sm hover:shadow-lg transition-shadow group">

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-[#F5ECD8]">
                    {imgSrc
                      ? <img src={imgSrc} alt={product.name || 'Product'}
                          onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>
                    }

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.customizable && (
                        <span className="flex items-center gap-1 bg-[#1E4D2B] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                          <Sparkles size={9} /> Custom
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="bg-[#C0522B] text-white text-[10px] font-semibold px-2 py-1 rounded-full">Sale</span>
                      )}
                      {!inStock && (
                        <span className="bg-gray-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full">Sold Out</span>
                      )}
                    </div>

                    {/* Remove from wishlist */}
                    <button onClick={() => remove(pid)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                      title="Remove from wishlist">
                      <Trash2 size={13} className="text-[#C0522B]" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <MapPin size={10} className="text-[#C0522B]" />
                      <p className="text-[10px] text-[#C0522B] font-semibold tracking-wide uppercase">{product.state || ''}</p>
                      {artisanName && <><span className="text-[#E8D5B0] mx-1">·</span>
                      <p className="text-[10px] text-[#7B5C3A]">{artisanName}</p></>}
                    </div>

                    <Link to={`/products/${pid}`}>
                      <h3 className="font-display text-[#2C1A0E] font-semibold text-sm leading-snug mb-2 line-clamp-2 hover:text-[#C0522B] transition-colors">
                        {product.name || 'Unnamed Product'}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1 mb-3">
                      <Star size={11} className="fill-[#C9920A] text-[#C9920A]" />
                      <span className="text-xs font-semibold text-[#2C1A0E]">{product.ratings || product.rating || 0}</span>
                      <span className="text-xs text-[#7B5C3A]">({product.numReviews || product.reviews || 0})</span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="font-display text-lg font-bold text-[#2C1A0E]">₹{(product.price || 0).toLocaleString('en-IN')}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-[#7B5C3A] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>

                    <button onClick={() => addToCart(pid)} disabled={!inStock}
                      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        !inStock
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : addedIds.includes(pid)
                          ? 'bg-[#1E4D2B] text-white'
                          : 'bg-[#C0522B] text-white hover:bg-[#9A3E1E]'
                      }`}>
                      <ShoppingBag size={14} />
                      {!inStock ? 'Out of Stock' : addedIds.includes(pid) ? 'Added ✓' : 'Cart में जोड़ें'}
                    </button>
                  </div>
                </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {items.length > 0 && (
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
