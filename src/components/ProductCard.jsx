import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Sparkles, MapPin, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toggleWishlist } from '../services/api';

const shareOptions = [
  { label: 'WhatsApp',  getUrl: (u) => `https://wa.me/?text=${encodeURIComponent('Check this out: ' + u)}` },
  { label: 'Facebook',  getUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { label: 'LinkedIn',  getUrl: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { label: 'Telegram',  getUrl: (u) => `https://t.me/share/url?url=${encodeURIComponent(u)}` },
  { label: 'Threads',   getUrl: null, copy: true, toast: 'Link copied. Share on Threads' },
  { label: 'Instagram', getUrl: null, copy: true, toast: 'Link copied. Share on Instagram' },
  { label: 'Copy Link', getUrl: null, copy: true, toast: 'Link copied successfully' },
];

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [toast, setToast] = useState('');
  const shareRef = useRef(null);

  // Close share dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (shareRef.current && !shareRef.current.contains(e.target)) setShareOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleShare = async () => {
    const pid = product._id || product.id;
    const url = `https://karigarhub.co.in/products/${pid}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name || 'Karigar Hub', text: 'Discover this handcrafted product on Karigar Hub', url });
      } catch (_) {}
    } else {
      setShareOpen(prev => !prev);
    }
  };

  const handleShareOption = (option) => {
    const pid = product._id || product.id;
    const url = `https://karigarhub.co.in/products/${pid}`;
    setShareOpen(false);
    if (option.copy) {
      navigator.clipboard.writeText(url).then(() => showToast(option.toast));
    } else {
      window.open(option.getUrl(url), '_blank', 'noopener');
    }
  };

  const handleWishlist = async () => {
    if (!user) return;
    try {
      await toggleWishlist(product._id || product.id);
      setLiked(p => !p);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-[#E8D5B0]/50"
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-[#F5ECD8]">
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8D5B0] to-[#F5ECD8] animate-pulse" />
        )}
        {product.image
          ? <img
              src={product.image}
              alt={product.name || 'Product'}
              onLoad={() => setImgLoaded(true)}
              onError={e => { e.target.onerror = null; e.target.style.display = 'none'; setImgLoaded(true); }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          : <div className="w-full h-full flex items-center justify-center text-5xl">🎨</div>
        }
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestSeller && (
            <span className="flex items-center gap-1 bg-[#C9920A] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
              🏆 Best Seller
            </span>
          )}
          {(product.isCustomizable || product.customizable) && (
            <span className="flex items-center gap-1 bg-[#1E4D2B] text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              <Sparkles size={9} /> Customize
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-[#C0522B] text-white text-[10px] font-semibold px-2 py-1 rounded-full">Sale</span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-600 text-white text-[10px] font-semibold px-2 py-1 rounded-full">Sold Out</span>
          )}
        </div>
        {/* Wishlist + Share buttons — top-right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <button
            onClick={handleWishlist}
            title={!user ? 'Sign in to save' : ''}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Heart size={14} className={liked ? 'fill-[#C0522B] text-[#C0522B]' : 'text-[#7B5C3A]'} />
          </button>

          {/* Share button with dropdown */}
          <div ref={shareRef} className="relative">
            <button
              onClick={handleShare}
              title="Share product"
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
            >
              <Share2 size={14} className="text-[#7B5C3A]" />
            </button>

            {/* Fallback dropdown */}
            {shareOpen && (
              <div className="absolute top-9 right-0 bg-white border border-[#E8D5B0] rounded-xl shadow-xl py-1.5 w-40 z-50">
                {shareOptions.map(opt => (
                  <button key={opt.label} onClick={() => handleShareOption(opt)}
                    className="w-full text-left px-3 py-1.5 text-xs text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1E4D2B] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg z-50">
            {toast}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          <MapPin size={10} className="text-[#C0522B]" />
          <p className="text-[10px] text-[#C0522B] font-semibold tracking-wide uppercase">{product.state}</p>
          <span className="text-[#E8D5B0] mx-1">·</span>
          <p className="text-[10px] text-[#7B5C3A]">{product.artisan}</p>
        </div>
        <Link to={`/products/${product._id || product.id}`}>
          <h3 className="font-display text-[#2C1A0E] font-semibold text-sm leading-snug mb-2 line-clamp-2 hover:text-[#C0522B] transition-colors">
            {product.name || 'Unnamed Product'}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <Star size={11} className="fill-[#C9920A] text-[#C9920A]" />
          <span className="text-xs font-semibold text-[#2C1A0E]">{product.ratings || product.rating || 0}</span>
          <span className="text-xs text-[#7B5C3A]">({product.numReviews || product.reviews || 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-[#2C1A0E]">₹{(product.price || 0).toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-xs text-[#7B5C3A] line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>
          <Link to={`/products/${product._id || product.id}`} className="text-xs font-semibold text-[#C0522B] hover:text-[#9A3E1E] transition-colors">
            show →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
