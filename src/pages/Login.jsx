import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login.jpeg';

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { saveUser } = useAuth();
  const navigate = useNavigate();

  // API integrated here
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form);
      saveUser(data);
      navigate(data.role === 'artist' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img src={loginBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E0E06]/85 to-[#C0522B]/50" />
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-xl font-display">क</div>
            <div>
              <span className="font-display text-2xl font-bold text-white block">Karigar Hub</span>
              <span className="text-xs tracking-widest text-[#E8D5B0]">BHARAT KA HUNAR</span>
            </div>
          </div>
          <p className="font-devanagari text-[#E8D5B0] text-2xl mb-3">स्वागत है आपका</p>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Welcome Back to the World of Indian Crafts
          </h2>
          <p className="text-white/75 text-lg leading-relaxed max-w-sm">
            Sign in to discover authentic handmade treasures and connect with India's finest karigars.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 w-full max-w-xs">
            {['3,200+ Karigars', '28 States', '62K+ Products', '4.9★ Rating'].map(stat => (
              <div key={stat} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                <p className="text-white font-bold text-sm">{stat}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#FDF6EC]">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-md">
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold font-display">क</div>
            <span className="font-display text-xl font-bold text-[#2C1A0E]">Karigar Hub</span>
          </div>

          <p className="font-devanagari text-[#C0522B] text-lg mb-1">नमस्ते 🙏</p>
          <h1 className="font-display text-3xl font-bold text-[#2C1A0E] mb-2">Sign In</h1>
          <p className="text-[#7B5C3A] mb-8">
            Don't have an account? <Link to="/register" className="text-[#C0522B] font-bold hover:underline">Join free</Link>
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">Email / Mobile Number</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="aap@example.com" required
                className="w-full px-4 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-[#2C1A0E]">Password</label>
                <a href="#" className="text-xs text-[#C0522B] hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••" required
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] placeholder-[#7B5C3A] text-sm focus:outline-none focus:border-[#C0522B] transition-colors" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7B5C3A] hover:text-[#C0522B]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#C0522B] text-white rounded-xl font-bold hover:bg-[#9A3E1E] transition-all shadow-md mt-2 disabled:opacity-60">
              {loading ? 'Signing in...' : <> Sign In <ArrowRight size={16} /> </>}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8D5B0]" /></div>
            <div className="relative flex justify-center"><span className="bg-[#FDF6EC] px-3 text-xs text-[#7B5C3A]">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Google', 'Phone OTP'].map(provider => (
              <button key={provider}
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#E8D5B0] bg-white text-[#2C1A0E] text-sm font-semibold hover:border-[#C0522B] transition-colors">
                {provider === 'Google' ? '🔍' : '📱'} {provider}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-[#7B5C3A] mt-6">
            Are you a karigar? <Link to="/register?type=artisan" className="text-[#C0522B] font-bold hover:underline">Join as Karigar</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
