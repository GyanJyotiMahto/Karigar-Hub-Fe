import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Sparkles, Leaf, ChevronRight, MessageSquare, MapPin, Award } from 'lucide-react';
import { getProduct, getProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { StarRating, Badge } from '../components/UI';
import CustomizationForm from '../components/CustomizationForm';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [customValues, setCustomValues] = useState({});
  const [customErrors, setCustomErrors] = useState({});
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // Live price: base + sum of priceAdd for chosen options
  const livePrice = product ? (() => {
    if (!product.isCustomizable) return product.price;
    const extra = (product.customizationOptions || []).reduce((sum, opt) => {
      return customValues[opt.name] && opt.priceAdd ? sum + opt.priceAdd : sum;
    }, 0);
    return product.price + extra;
  })() : 0;

  useEffect(() => {
    getProduct(id)
      .then(data => {
        setProduct(data);
        if (data.category) {
          getProducts({ category: data.category })
            .then(all => setRelated((Array.isArray(all) ? all : []).filter(p => p._id !== data._id).slice(0, 3)))
            .catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const validateCustomizations = () => {
    if (!product?.isCustomizable) return true;
    const errs = {};
    (product.customizationOptions || []).forEach(opt => {
      if (opt.required && !customValues[opt.name]?.toString().trim()) {
        errs[opt.name] = `${opt.name} is required`;
      }
      if (customValues[opt.name] && opt.options?.length && !opt.options.includes(customValues[opt.name])) {
        errs[opt.name] = `Invalid option selected for ${opt.name}`;
      }
    });
    setCustomErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = () => {
    if (!validateCustomizations()) return;
    addToCart({ ...product, price: livePrice, quantity: qty }, product.isCustomizable ? customValues : {});
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 flex items-center justify-center">
      <div className="animate-pulse text-[#C0522B] text-lg font-display">Loading...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">Product not found</h3>
        <Link to="/products" className="text-[#C0522B] font-semibold hover:underline">Browse all products</Link>
      </div>
    </div>
  );

  const artisan = product.artist;

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#7B5C3A] mb-8">
          <Link to="/" className="hover:text-[#C0522B]">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products" className="hover:text-[#C0522B]">Products</Link>
          <ChevronRight size={14} />
          <span className="text-[#2C1A0E] font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Gallery */}
          <div>
            <motion.div key={activeImg} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="aspect-square rounded-3xl overflow-hidden bg-[#F5ECD8] mb-4">
              {product.images?.[activeImg]
                ? <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-6xl">🎨</div>
              }
            </motion.div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-[#C0522B]' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              {product.category && <Badge variant="default">{product.category}</Badge>}
              {product.isCustomizable && <Badge variant="green"><Sparkles size={10} /> Customizable</Badge>}
              {product.stock === 0 && <Badge variant="maroon">Sold Out</Badge>}
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2C1A0E] mb-3 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <StarRating rating={product.ratings || 0} />
              <span className="text-sm font-bold text-[#2C1A0E]">{product.ratings || 0}</span>
              <span className="text-sm text-[#7B5C3A]">({product.numReviews || 0} reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-4xl font-bold text-[#2C1A0E]">₹{livePrice?.toLocaleString('en-IN')}</span>
              {livePrice !== product.price && (
                <span className="text-sm text-[#7B5C3A] line-through">₹{product.price?.toLocaleString('en-IN')}</span>
              )}
            </div>

            <p className="text-[#5C3317] leading-relaxed mb-6">{product.description}</p>

            {/* Customization */}
            {product.isCustomizable && product.customizationOptions?.length > 0 && (
              <div className="mb-5">
                <CustomizationForm
                  options={product.customizationOptions}
                  values={customValues}
                  onChange={setCustomValues}
                  errors={customErrors}
                />
              </div>
            )}

            {/* Qty + Add to Cart */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center border border-[#E8D5B0] rounded-full overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 text-[#5C3317] hover:bg-[#F5ECD8] transition-colors font-bold">−</button>
                <span className="px-4 py-3 font-bold text-[#2C1A0E] min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 text-[#5C3317] hover:bg-[#F5ECD8] transition-colors font-bold">+</button>
              </div>
              <button onClick={handleAdd} disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold transition-all ${
                  product.stock > 0
                    ? added ? 'bg-[#1E4D2B] text-white' : 'bg-[#C0522B] text-white hover:bg-[#9A3E1E] shadow-md'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}>
                <ShoppingBag size={18} />
                {added ? 'Cart में जोड़ा! ✓' : product.stock > 0 ? 'Cart में जोड़ें' : 'Out of Stock'}
              </button>
              <button className="w-12 h-12 rounded-full border border-[#E8D5B0] flex items-center justify-center hover:border-[#C0522B] hover:text-[#C0522B] transition-colors">
                <Heart size={18} />
              </button>
            </div>

            {/* Stock info / Customize CTA */}
            {product.isCustomizable ? (
              <div className="flex items-start gap-3 bg-[#C0522B]/8 border border-[#C0522B]/20 rounded-2xl p-4">
                <Sparkles size={18} className="text-[#C0522B] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-[#C0522B]">Customize this product</p>
                  <p className="text-xs text-[#7B5C3A] mt-0.5">Handmade — each piece is unique. Fill in your preferences above before adding to cart.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-[#1E4D2B]/8 border border-[#1E4D2B]/20 rounded-2xl p-4">
                <Leaf size={18} className="text-[#1E4D2B] mt-0.5 shrink-0" />
                <p className="text-sm text-[#1E4D2B] leading-relaxed">
                  {product.stock > 0 ? 'Handmade — each piece is unique.' : 'Currently out of stock. Check back soon!'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Artisan Story */}
        {artisan && (
          <div className="bg-white rounded-3xl border border-[#E8D5B0]/60 p-8 mb-12">
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-6">कारीगर की कहानी — Artisan Story</h2>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-20 h-20 rounded-full border-2 border-[#E8D5B0] bg-[#C0522B] flex items-center justify-center text-white text-2xl font-bold font-display shrink-0 overflow-hidden">
                {artisan.profileImage
                  ? <img src={artisan.profileImage} alt={artisan.name} className="w-full h-full object-cover" />
                  : artisan.name?.[0]?.toUpperCase()
                }
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-1">
                  <h3 className="font-display text-xl font-bold text-[#2C1A0E]">{artisan.name}</h3>
                  <span className="text-xs bg-[#C0522B]/10 text-[#C0522B] px-2 py-0.5 rounded-full font-semibold">{artisan.category}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#7B5C3A] mb-3">
                  {artisan.address?.city && <span className="flex items-center gap-1"><MapPin size={12} /> {artisan.address.city}, {artisan.address.state}</span>}
                  {artisan.isVerified && <span className="flex items-center gap-1"><Award size={12} /> Verified</span>}
                </div>
                {artisan.bio && <p className="text-[#5C3317] leading-relaxed mb-4 italic font-display">"{artisan.bio}"</p>}
                <Link to={`/artisans/${artisan._id}`}
                  className="inline-flex items-center gap-1 text-[#C0522B] font-semibold text-sm hover:gap-2 transition-all">
                  Full Profile देखें <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-6">आपको यह भी पसंद आ सकता है</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map(p => (
                <ProductCard key={p._id} product={{ ...p, id: p._id, image: p.images?.[0] }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
