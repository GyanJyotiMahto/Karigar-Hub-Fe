import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { categories } from '../data/sampleData';
import { getProducts, getBestSellers } from '../services/api';
import ProductCard from '../components/ProductCard';
import { SectionHeader } from '../components/UI';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
];

const states = ['All States', 'Odisha', 'Rajasthan', 'West Bengal', 'Gujarat', 'Uttar Pradesh', 'Bihar', 'Assam', 'Kashmir', 'Maharashtra', 'Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Madhya Pradesh', 'Punjab', 'Himachal Pradesh', 'Uttarakhand', 'Jharkhand', 'Chhattisgarh', 'Manipur', 'Nagaland', 'Meghalaya', 'Tripura', 'Mizoram', 'Arunachal Pradesh', 'Sikkim', 'Goa'];

export default function Products() {
  const location = useLocation();

  // Read query params from URL (set by footer links)
  const params = new URLSearchParams(location.search);
  const urlCategory = params.get('category') || 'All';
  const urlState    = params.get('state')    || 'All States';

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [activeState, setActiveState] = useState(urlState);
  const [sort, setSort] = useState('featured');
  const [maxPrice, setMaxPrice] = useState(10000);

  // Re-apply filters whenever URL query params change (e.g. footer link clicked)
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setActiveCategory(p.get('category') || 'All');
    setActiveState(p.get('state') || 'All States');
    setSearch('');
  }, [location.search]);

  // API integrated here
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getProducts(),
      getBestSellers(),
    ])
      .then(([allData, bsData]) => {
        setProducts(Array.isArray(allData) ? allData : []);
        setBestSellers(Array.isArray(bsData) ? bsData : []);
      })
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const allCategories = ['All', ...categories.map(c => c.name)];

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      (p.artisan || p.artist?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.state || '').toLowerCase().includes(search.toLowerCase())
    );
    if (activeCategory !== 'All') list = list.filter(p => p.category === activeCategory);
    if (activeState !== 'All States') list = list.filter(p => p.state === activeState);
    list = list.filter(p => p.price <= maxPrice);
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => (b.ratings || b.rating || 0) - (a.ratings || a.rating || 0));
    else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [products, search, activeCategory, activeState, sort, maxPrice]);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Handcrafted Marketplace" hindi="हस्तनिर्मित बाज़ार"
          title="Discover Authentic Indian Crafts"
          subtitle="Every item is handmade by a verified karigar. No mass production. No shortcuts." />

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7B5C3A]" />
            <input type="text" placeholder="Search products, karigars, states..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-full border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] hover:text-[#C0522B]">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 rounded-full border border-[#E8D5B0] bg-white text-[#2C1A0E] text-sm focus:outline-none focus:border-[#C0522B] cursor-pointer">
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] pointer-events-none" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {allCategories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-[#C0522B] text-white shadow-md'
                  : 'bg-white border border-[#E8D5B0] text-[#5C3317] hover:border-[#C0522B] hover:text-[#C0522B]'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* State + Price Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-white rounded-2xl border border-[#E8D5B0]/60">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-[#C0522B]" />
            <span className="text-sm font-semibold text-[#2C1A0E]">Filters:</span>
          </div>
          <div className="relative">
            <select value={activeState} onChange={e => setActiveState(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-full border border-[#E8D5B0] bg-[#FDF6EC] text-[#2C1A0E] text-sm focus:outline-none focus:border-[#C0522B] cursor-pointer">
              {states.map(s => <option key={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B5C3A] pointer-events-none" />
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[#7B5C3A]">Max Price:</span>
            <input type="range" min={500} max={10000} step={500} value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="w-28 accent-[#C0522B]" />
            <span className="text-sm font-semibold text-[#2C1A0E]">₹{maxPrice.toLocaleString('en-IN')}</span>
          </div>
          {(activeCategory !== 'All' || activeState !== 'All States' || search) && (
            <button onClick={() => { setActiveCategory('All'); setActiveState('All States'); setSearch(''); setMaxPrice(10000); }}
              className="text-xs text-[#C0522B] font-semibold hover:underline flex items-center gap-1">
              <X size={12} /> Clear All
            </button>
          )}
        </div>

        {/* Best Sellers Section */}
        {!loading && bestSellers.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏆</span>
              <h2 className="font-display text-xl font-bold text-[#2C1A0E]">Best Sellers</h2>
              <span className="text-xs font-bold bg-[#C0522B] text-white px-2.5 py-1 rounded-full">Top Picks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {bestSellers.map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ProductCard product={{ ...product, id: product._id, image: product.images?.[0] || product.image, artisan: product.artisan || product.artist?.name, isBestSeller: true }} />
                </motion.div>
              ))}
            </div>
            <div className="mt-6 border-t border-[#E8D5B0]/60" />
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8D5B0]/50 overflow-hidden animate-pulse">
                <div className="aspect-square bg-[#E8D5B0]" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-[#E8D5B0] rounded w-1/2" />
                  <div className="h-4 bg-[#E8D5B0] rounded w-3/4" />
                  <div className="h-3 bg-[#E8D5B0] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-[#7B5C3A]">{error}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#7B5C3A] mb-6">
              Showing <span className="font-bold text-[#2C1A0E]">{filtered.length}</span> handcrafted items
            </p>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((product, i) => (
                  <motion.div key={product._id || product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ProductCard product={{ ...product, id: product._id || product.id, image: product.images?.[0] || product.image, artisan: product.artisan || product.artist?.name }} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">कोई परिणाम नहीं</h3>
                <p className="text-[#7B5C3A]">No results found. Try a different search or filter.</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All'); setActiveState('All States'); setMaxPrice(10000); }}
                  className="mt-4 text-[#C0522B] font-semibold hover:underline">Clear filters</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
