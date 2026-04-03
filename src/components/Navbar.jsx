import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Menu, X, Search, User, Heart, LogOut, ChevronDown, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { label: 'Shop', to: '/products' },
  { label: 'Karigars', to: '/artisans' },
  { label: 'States', to: '/states' },
  { label: 'Festivals', to: '/products' },
];

export default function Navbar({ cartCount = 0 }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

  const solid = scrolled || !isHome;
  const navBg = solid ? 'bg-[#FDF6EC]/96 backdrop-blur-md shadow-sm border-b border-[#E8D5B0]/60' : 'bg-transparent';
  const textColor = solid ? 'text-[#2C1A0E]' : 'text-white';

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold text-base font-display">क</div>
            <div>
              <span className={`font-display text-lg font-bold tracking-wide leading-none block transition-colors ${textColor}`}>Karigar Hub</span>
              <span className={`text-[10px] tracking-widest leading-none transition-colors ${solid ? 'text-[#C0522B]' : 'text-[#E8D5B0]'}`}>BHARAT KA HUNAR</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.to + link.label} to={link.to}
                className={`text-sm font-medium tracking-wide hover:text-[#C0522B] transition-colors ${textColor}`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/products" className={`hidden md:flex p-2 rounded-full hover:bg-[#C0522B]/10 transition-colors ${textColor}`}>
              <Search size={18} />
            </Link>
            <Link to="/wishlist" className={`hidden md:flex p-2 rounded-full hover:bg-[#C0522B]/10 transition-colors ${textColor}`}>
              <Heart size={18} />
            </Link>
            <Link to="/cart" className={`relative p-2 rounded-full hover:bg-[#C0522B]/10 transition-colors ${textColor}`}>
              <ShoppingBag size={18} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C0522B] text-white text-[10px] rounded-full flex items-center justify-center font-bold">{totalItems}</span>
              )}
            </Link>
            {user ? (
              <div className="hidden md:flex items-center gap-2" ref={profileRef}>
                <div className="relative">
                  <button onClick={() => setProfileOpen(p => !p)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                      solid ? 'border-[#E8D5B0] hover:border-[#C0522B]' : 'border-white/40 hover:border-white'
                    }`}>
                    <div className="w-7 h-7 rounded-full bg-[#C0522B] flex items-center justify-center text-white text-xs font-bold">
                      {initials}
                    </div>
                    <span className={`text-sm font-semibold ${textColor}`}>{user.name?.split(' ')[0]}</span>
                    <ChevronDown size={13} className={`transition-transform ${profileOpen ? 'rotate-180' : ''} ${textColor}`} />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-[#E8D5B0]/60 overflow-hidden z-50">
                        <div className="px-4 py-3 bg-[#FDF6EC] border-b border-[#E8D5B0]/60">
                          <p className="font-semibold text-[#2C1A0E] text-sm">{user.name}</p>
                          <p className="text-xs text-[#7B5C3A] truncate">{user.email}</p>
                        </div>
                        <div className="py-1">
                          {user.role === 'artist' ? (
                            <>
                              <Link to="/dashboard" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                                <LayoutDashboard size={14} /> My Dashboard
                              </Link>
                              <Link to="/dashboard/products" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                                <Package size={14} /> My Products
                              </Link>
                              <Link to="/dashboard/products/add" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                                <ShoppingBag size={14} /> Add Product
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link to="/profile" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                                <User size={14} /> My Profile
                              </Link>
                              <Link to="/orders" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                                <Package size={14} /> My Orders
                              </Link>
                              <Link to="/wishlist" onClick={() => setProfileOpen(false)}
                                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#2C1A0E] hover:bg-[#FDF6EC] hover:text-[#C0522B] transition-colors">
                                <Heart size={14} /> Wishlist
                              </Link>
                            </>
                          )}
                        </div>
                        <div className="border-t border-[#E8D5B0]/60 py-1">
                          <button onClick={() => { logout(); navigate('/'); setProfileOpen(false); }}
                            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut size={14} /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link to="/login"
                className={`hidden md:flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                  solid ? 'border-[#C0522B] text-[#C0522B] hover:bg-[#C0522B] hover:text-white' : 'border-white/70 text-white hover:bg-white hover:text-[#C0522B]'
                }`}>
                <User size={13} /> Sign In
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}
              className={`md:hidden p-2 rounded-full hover:bg-[#C0522B]/10 transition-colors ${textColor}`}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FDF6EC] border-t border-[#E8D5B0]/60 px-4 pb-4">
            {navLinks.map(link => (
              <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}
                className="block py-3 text-[#2C1A0E] font-medium border-b border-[#E8D5B0]/50 last:border-0 hover:text-[#C0522B] transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-4">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full border border-[#C0522B] text-[#C0522B] text-sm font-semibold hover:bg-[#C0522B] hover:text-white transition-all">Sign In</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 rounded-full bg-[#C0522B] text-white text-sm font-semibold hover:bg-[#9A3E1E] transition-all">Join Free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
