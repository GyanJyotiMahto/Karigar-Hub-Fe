import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown, Quote } from 'lucide-react';
import { categories, testimonials, stats, howItWorks, states, festivals } from '../data/sampleData';
import { getProducts, getArtisans } from '../services/api';
import ProductCard from '../components/ProductCard';
import ArtisanCard from '../components/ArtisanCard';
import { SectionHeader } from '../components/UI';
import bgImage from "../assets/handicraft-bg.png";
import potteryImg from "../assets/Pottery.jpeg";
import paintingsImg from "../assets/Paintings.jpeg";
import handloomImg from "../assets/handloom.jpeg";
import jewelleryImg from "../assets/jwellary.jpeg";
/* ── Animated Counter ── */
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const steps = 60, duration = 2000;
    const inc = target / steps;
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { setCount(target); clearInterval(t); }
      else setCount(Math.floor(cur));
    }, duration / steps);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref} className="font-display text-4xl md:text-5xl font-bold text-white">{count.toLocaleString('en-IN')}{suffix}</span>;
}

const floatingBadges = [
  { icon: '🇮🇳', label: 'Handmade in India', pos: 'top-[20%] left-[6%]', delay: 0 },
  { icon: '✨', label: 'Custom Orders', pos: 'top-[38%] right-[5%]', delay: 0.3 },
  { icon: '🤝', label: 'Support Local Artisans', pos: 'bottom-[32%] left-[4%]', delay: 0.6 },
  { icon: '🪔', label: 'Festive Gifting', pos: 'bottom-[20%] right-[7%]', delay: 0.9 },
];

export default function Landing() {
  const [tIdx, setTIdx] = useState(0);
  const [showAllStates, setShowAllStates] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredArtisans, setFeaturedArtisans] = useState([]);
  const [statesWithCounts, setStatesWithCounts] = useState(states);

  useEffect(() => {
    getProducts().then(data => setFeaturedProducts(Array.isArray(data) ? data.slice(0, 4) : [])).catch(() => {});
    getArtisans().then(data => {
      const allArtisans = Array.isArray(data) ? data : [];
      setFeaturedArtisans(allArtisans.slice(0, 3));
      // Count artisans per state and merge into states data
      const countMap = {};
      allArtisans.forEach(a => {
        const st = a.address?.state || a.state || '';
        if (st) countMap[st] = (countMap[st] || 0) + 1;
      });
      setStatesWithCounts(states.map(s => ({ ...s, artisanCount: countMap[s.name] || 0 })));
    }).catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgImage} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1E0E06]/88 via-[#2C1A0E]/75 to-[#C0522B]/35" />
          <div className="absolute inset-0 pattern-dots opacity-25" />
        </div>

        {/* Floating badges */}
        {floatingBadges.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + b.delay, duration: 0.5 }}
            className={`absolute hidden lg:flex items-center gap-2 bg-white/12 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-full ${b.pos}`}>
            <span>{b.icon}</span> {b.label}
          </motion.div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="font-devanagari text-[#E8D5B0] text-xl mb-3">
            भारत के हुनर को घर घर तक
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] mb-2">
              Karigar Hub
            </h1>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-[#E8845A] font-semibold italic mb-6">
              Har Kala Ki Apni Kahani
            </p>
          </motion.div>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="text-[#E8D5B0] text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover authentic handmade treasures from 3,200+ skilled karigars across India. Every purchase preserves a tradition and empowers an artisan family.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products"
              className="flex items-center gap-2 bg-[#C0522B] text-white px-8 py-4 rounded-full font-bold text-base hover:bg-[#9A3E1E] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link to="/register?type=artisan"
              className="flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/22 transition-all">
              🎨 Join as Karigar
            </Link>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 text-xs">
          <div className="w-px h-8 bg-white/25" /><span>Scroll</span>
        </motion.div>
      </section>

      {/* ══ CATEGORIES ════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Shop by Craft" hindi="शिल्प के अनुसार खरीदें"
            title="Explore Indian Crafts"
            subtitle="From ancient Pattachitra to delicate Chikankari — discover the diversity of India's handmade heritage." />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Link to={`/products?category=${cat.name}`}
                  className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-[#E8D5B0]/60 hover:border-[#C0522B]/50 hover:shadow-lg transition-all duration-300">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-xl">{cat.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-[#2C1A0E] text-xs group-hover:text-[#C0522B] transition-colors leading-tight">{cat.name}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SHOP BY STATE ═════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5ECD8]/50 pattern-jaali">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Shop by State" hindi="राज्य के अनुसार खरीदें"
            title="Crafts from Every Corner of Bharat"
            subtitle="Each Indian state has a unique craft tradition. Explore them all." />
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {(showAllStates ? statesWithCounts : statesWithCounts.slice(0, 8)).map((s, i) => (
              <motion.div key={s.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Link to={`/states/${encodeURIComponent(s.name)}`}
                  className="group relative block rounded-2xl overflow-hidden aspect-square hover:shadow-xl transition-shadow">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E0E06]/80 via-[#1E0E06]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2.5 text-center">
                    <p className="text-white font-bold text-xs leading-tight">{s.name}</p>
                    <p className="text-[#E8D5B0] text-[9px] leading-tight mt-0.5">{s.artisanCount !== undefined ? `${s.artisanCount} artisans` : ''}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => setShowAllStates(p => !p)}
              className="inline-flex items-center gap-2 border-2 border-[#C0522B] text-[#C0522B] px-8 py-3 rounded-full font-bold hover:bg-[#C0522B] hover:text-white transition-all">
              {showAllStates ? 'See Less' : 'See All States'}
              <motion.span animate={{ rotate: showAllStates ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown size={16} />
              </motion.span>
            </button>
          </div>
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ═════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <SectionHeader eyebrow="Handpicked for You" hindi="आपके लिए चुने गए"
              title="Featured Creations" center={false} />
            <Link to="/products" className="hidden md:flex items-center gap-1 text-[#C0522B] font-semibold text-sm hover:gap-2 transition-all">
              See More <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.length === 0 ? (
              <div className="col-span-4 text-center py-12 text-[#7B5C3A]">No products yet. Be the first to add one!</div>
            ) : featuredProducts.map((product, i) => (
              <motion.div key={product._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ProductCard product={{ ...product, id: product._id, image: product.images?.[0], artisan: product.artist?.name }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FESTIVAL GIFTING ══════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-[#7B1C2E] to-[#C0522B] relative overflow-hidden">
        <div className="absolute inset-0 pattern-mandala opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <p className="text-[#E8D5B0] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#E8D5B0]" />त्योहार की खरीदारी<span className="w-6 h-px bg-[#E8D5B0]" />
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Festival Collections</h2>
            <p className="text-white/75 text-lg max-w-xl mx-auto">Celebrate every occasion with authentic handmade gifts that carry the warmth of Indian craftsmanship.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {festivals.map((f, i) => (
              <motion.div key={f.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to="/products"
                  className="group block bg-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center hover:bg-white/22 hover:scale-105 transition-all duration-300">
                  <span className="text-4xl block mb-3">{f.icon}</span>
                  <p className="text-white font-bold text-sm mb-1">{f.name}</p>
                  <p className="text-white/65 text-xs leading-relaxed">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ARTISAN STORIES ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="The Karigars" hindi="हमारे कारीगर"
            title="Meet the Makers"
            subtitle="Behind every product is a karigar with a story. Discover the hands and hearts that craft your treasures." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArtisans.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-[#7B5C3A]">No karigars yet. Invite artisans to join!</div>
            ) : featuredArtisans.map((artisan, i) => (
              <motion.div key={artisan._id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <ArtisanCard artisan={{ ...artisan, id: artisan._id, state: artisan.address?.state, city: artisan.address?.city, craft: artisan.category }} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/artisans"
              className="inline-flex items-center gap-2 border-2 border-[#C0522B] text-[#C0522B] px-8 py-3 rounded-full font-bold hover:bg-[#C0522B] hover:text-white transition-all">
              सभी कारीगर देखें <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ IMPACT TRACKER ════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-[#1E0E06] to-[#5C3317] relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-14">
            <p className="text-[#E8845A] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#E8845A]" />हमारा प्रभाव<span className="w-6 h-px bg-[#E8845A]" />
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Our Collective Impact</h2>
            <p className="text-[#E8D5B0] text-lg max-w-xl mx-auto">Together, we are building a more equitable India for its karigars and their families.</p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <Counter target={stat.value} suffix={stat.suffix} />
                <p className="text-[#E8D5B0] text-sm mt-2 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Simple & Transparent" hindi="कैसे काम करता है"
            title="How Karigar Hub Works"
            subtitle="From discovery to doorstep — a seamless experience that puts karigars first." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#C0522B]/30 to-transparent" />
            {howItWorks.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="relative text-center p-6 bg-white rounded-2xl border border-[#E8D5B0]/60 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-full bg-[#C0522B]/10 flex items-center justify-center text-2xl mx-auto mb-4">{step.icon}</div>
                <span className="text-[#C0522B] text-xs font-bold tracking-widest">{step.step}</span>
                <h3 className="font-display text-xl font-bold text-[#2C1A0E] mt-1 mb-0.5">{step.title}</h3>
                <p className="text-xs text-[#C0522B] font-semibold mb-2 italic">{step.subtitle}</p>
                <p className="text-sm text-[#7B5C3A] leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#F5ECD8]/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Customer Stories" hindi="ग्राहकों की बातें" title="What Our Buyers Say" />
          <div className="relative">
            <motion.div key={tIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-[#E8D5B0]/60 text-center">
              <Quote size={32} className="text-[#C0522B]/25 mx-auto mb-6" />
              <p className="font-display text-xl md:text-2xl text-[#2C1A0E] leading-relaxed mb-8 italic">
                "{testimonials[tIdx].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <img src={testimonials[tIdx].avatar} alt={testimonials[tIdx].name} className="w-12 h-12 rounded-full object-cover" />
                <div className="text-left">
                  <p className="font-bold text-[#2C1A0E]">{testimonials[tIdx].name}</p>
                  <p className="text-sm text-[#7B5C3A]">{testimonials[tIdx].city}</p>
                </div>
              </div>
            </motion.div>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setTIdx(i => (i - 1 + testimonials.length) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-[#E8D5B0] flex items-center justify-center hover:border-[#C0522B] hover:text-[#C0522B] transition-colors">
                <ChevronLeft size={18} />
              </button>
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTIdx(i)}
                  className={`h-2 rounded-full transition-all ${i === tIdx ? 'bg-[#C0522B] w-6' : 'bg-[#E8D5B0] w-2'}`} />
              ))}
              <button onClick={() => setTIdx(i => (i + 1) % testimonials.length)}
                className="w-10 h-10 rounded-full border border-[#E8D5B0] flex items-center justify-center hover:border-[#C0522B] hover:text-[#C0522B] transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WORKSHOP / STORY SECTION ══════════════════════════════════════════ */}
      <section className="py-20 bg-[#FDF6EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-[#C0522B] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2">
                <span className="w-6 h-px bg-[#C0522B]" />Karigar Workshops
              </p>
              <p className="font-devanagari text-[#C0522B] text-xl mb-2">कला सीखो, कला जियो</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#2C1A0E] leading-tight mb-6">
                Learn the Art.<br />Live the Craft.
              </h2>
              <p className="text-[#7B5C3A] text-lg leading-relaxed mb-6">
                Join live virtual workshops hosted by our master karigars. Learn Madhubani from Sunita Devi, Blue Pottery from Ramesh ji, or Dokra casting from Meera — from your home.
              </p>
              <ul className="space-y-3 mb-8">
                {['Live & recorded sessions with master karigars', 'Craft kits delivered to your doorstep', 'Certificate of completion', 'Join a community of 50,000+ craft lovers'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#5C3317]">
                    <span className="w-5 h-5 rounded-full bg-[#C0522B]/12 flex items-center justify-center text-[#C0522B] text-xs font-bold">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/workshops"
                className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-4 rounded-full font-bold hover:bg-[#9A3E1E] transition-all shadow-md">
                Workshops देखें <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                <img src={potteryImg} alt="" className="rounded-2xl w-full aspect-square object-cover" />
                <img src={paintingsImg} alt="" className="rounded-2xl w-full aspect-square object-cover mt-8" />
                <img src={handloomImg} alt="" className="rounded-2xl w-full aspect-square object-cover -mt-4" />
                <img src={jewelleryImg} alt="" className="rounded-2xl w-full aspect-square object-cover mt-4" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-[#C0522B] text-white rounded-2xl p-4 shadow-xl">
                <p className="font-display text-2xl font-bold">4.9★</p>
                <p className="text-xs text-white/80">Average workshop rating</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ═════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gradient-to-br from-[#C0522B] to-[#7B1C2E] relative overflow-hidden">
        <div className="absolute inset-0 pattern-mandala opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="font-devanagari text-[#E8D5B0] text-2xl mb-3">वोकल फॉर लोकल</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Start Your Handcrafted Journey Today
            </h2>
            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
              Whether you are a buyer seeking meaning or a karigar ready to share your craft — Karigar Hub is your home.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products"
                className="flex items-center gap-2 bg-white text-[#C0522B] px-8 py-4 rounded-full font-bold text-base hover:bg-[#FDF6EC] transition-all shadow-lg">
                Shop Handmade <ArrowRight size={18} />
              </Link>
              <Link to="/register?type=artisan"
                className="flex items-center gap-2 bg-white/15 border border-white/30 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/25 transition-all">
                Karigar बनें
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
