import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, ShoppingBag, Palette } from 'lucide-react';
import KarigarSignup from '../components/KarigarSignup';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { saveUser } = useAuth();
  const [type, setType] = useState(searchParams.get('type') === 'artisan' ? 'artisan' : 'buyer');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '' });
  const isBuyer = type === 'buyer';

  // API integrated here — buyer registration
  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register({
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: 'user',
      });
      saveUser(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Visual */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden">
        <img
          src={isBuyer
            ? 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80'
            : 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=900&q=80'}
          alt="" className="w-full h-full object-cover transition-all duration-700" />
        <div className={`absolute inset-0 transition-all duration-700 ${isBuyer ? 'bg-gradient-to-br from-[#1E0E06]/85 to-[#C0522B]/50' : 'bg-gradient-to-br from-[#1E0E06]/85 to-[#1E4D2B]/60'}`} />
        <div className="absolute inset-0 pattern-dots opacity-15" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isBuyer ? 'bg-[#C0522B]' : 'bg-[#1E4D2B]'}`}>
            {isBuyer ? <ShoppingBag size={28} className="text-white" /> : <Palette size={28} className="text-white" />}
          </div>
          <p className="font-devanagari text-[#E8D5B0] text-xl mb-3">
            {isBuyer ? 'खरीदार के रूप में जुड़ें' : 'कारीगर के रूप में जुड़ें'}
          </p>
          <h2 className="font-display text-4xl font-bold text-white mb-4">
            {isBuyer ? 'Discover Authentic Indian Crafts' : 'Share Your Craft with Bharat'}
          </h2>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            {isBuyer
              ? 'Join lakhs of conscious buyers who choose handmade over mass-produced.'
              : 'Join 3,200+ karigars earning fair wages by selling their handcrafted creations across India.'}
          </p>
          {!isBuyer && (
            <div className="mt-8 space-y-3 w-full max-w-xs">
              {['80% of every sale goes to you', 'Free to list your first 10 products', 'Reach buyers across all of India', 'Dedicated karigar support team'].map(item => (
                <div key={item} className="flex items-center gap-2 text-white/85 text-sm">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">✓</span>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-start justify-center p-6 bg-[#FDF6EC] overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg py-8">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold font-display">क</div>
            <span className="font-display text-xl font-bold text-[#2C1A0E]">Karigar Hub</span>
          </div>

          <p className="font-devanagari text-[#C0522B] text-lg mb-1">नमस्ते 🙏</p>
          <h1 className="font-display text-3xl font-bold text-[#2C1A0E] mb-2">Create Account</h1>
          <p className="text-[#7B5C3A] mb-6">
            Already have an account? <Link to="/login" className="text-[#C0522B] font-bold hover:underline">Sign in</Link>
          </p>

          {/* Type Toggle */}
          <div className="flex bg-[#E8D5B0]/40 rounded-xl p-1 mb-6">
            {[
              { value: 'buyer',   label: "🛍️ I'm a Buyer" },
              { value: 'artisan', label: "🎨 I'm a Karigar" },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setType(opt.value); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  type === opt.value ? 'bg-white text-[#2C1A0E] shadow-sm' : 'text-[#7B5C3A] hover:text-[#2C1A0E]'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isBuyer ? (
              <motion.form key="buyer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="space-y-4" onSubmit={handleBuyerSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">First Name</label>
                    <input type="text" placeholder="First" value={form.firstName}
                      onChange={e => setForm({ ...form, firstName: e.target.value })} required
                      className="w-full px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">Last Name</label>
                    <input type="text" placeholder="Last" value={form.lastName}
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">Email Address</label>
                  <input type="email" placeholder="aap@example.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required
                    className="w-full px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] text-sm font-semibold">🇮🇳 +91</span>
                    <input type="tel" placeholder="98765 43210" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} required
                      className="flex-1 px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">Password</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password}
                      onChange={e => setForm({ ...form, password: e.target.value })} required
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] hover:text-[#C0522B]">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="terms" className="mt-0.5 accent-[#C0522B]" required />
                  <label htmlFor="terms" className="text-xs text-[#7B5C3A] leading-relaxed">
                    I agree to the <Link to="/terms" className="text-[#C0522B] hover:underline">Terms &amp; Conditions</Link> and <Link to="/refund-policy" className="text-[#C0522B] hover:underline">Refund Policy</Link>
                  </label>
                </div>
                <button type="submit" disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold transition-all shadow-md mt-2 text-white bg-[#C0522B] hover:bg-[#9A3E1E] disabled:opacity-60">
                  {loading ? 'Creating account...' : <> Account बनाएं <ArrowRight size={16} /> </>}
                </button>
              </motion.form>
            ) : (
              <motion.div key="karigar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* API integrated here — karigar registration handled inside KarigarSignup */}
                <KarigarSignup
                  showPass={showPass}
                  setShowPass={setShowPass}
                  onSubmit={() => navigate('/dashboard')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
