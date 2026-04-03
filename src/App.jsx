import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Artisans from './pages/Artisans';
import ArtisanProfile from './pages/ArtisanProfile';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ManageProducts from './pages/ManageProducts';
import AddProduct from './pages/AddProduct';
import Wishlist from './pages/Wishlist';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Terms from './pages/Terms';
import RefundPolicy from './pages/RefundPolicy';
import UserProfile from './pages/UserProfile';
import States from './pages/States';
import StateKarigars from './pages/StateKarigars';
import SuccessStories from './pages/SuccessStories';
import Workshops from './pages/Workshops';


function ScrollToTop() {
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname, location.search]);
  return null;
}

function AnimatedPage({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}>
      {children}
    </motion.div>
  );
}

const noLayoutRoutes = ['/login', '/register', '/dashboard'];  // dashboard/* also matched via startsWith

function AppLayout() {
  const location = useLocation();
  const hideLayout = noLayoutRoutes.some(r => location.pathname.startsWith(r));

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      {!hideLayout && <Navbar />}
      <main className="flex-1">
        <Routes location={location}>
          <Route path="/" element={<AnimatedPage><Landing /></AnimatedPage>} />
          <Route path="/products" element={<AnimatedPage><Products /></AnimatedPage>} />
          <Route path="/products/:id" element={<AnimatedPage><ProductDetail /></AnimatedPage>} />
          <Route path="/artisans" element={<AnimatedPage><Artisans /></AnimatedPage>} />
          <Route path="/artisans/:id" element={<AnimatedPage><ArtisanProfile /></AnimatedPage>} />
          <Route path="/dashboard" element={<AnimatedPage><Dashboard /></AnimatedPage>} />
          <Route path="/dashboard/products" element={<AnimatedPage><ManageProducts /></AnimatedPage>} />
          <Route path="/dashboard/products/add" element={<AnimatedPage><AddProduct /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><Login /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><Register /></AnimatedPage>} />
          <Route path="/cart" element={<AnimatedPage><Cart /></AnimatedPage>} />
          <Route path="/checkout" element={<AnimatedPage><Checkout /></AnimatedPage>} />
          <Route path="/wishlist" element={<AnimatedPage><Wishlist /></AnimatedPage>} />
          <Route path="/order-confirmation" element={<AnimatedPage><OrderConfirmation /></AnimatedPage>} />
          <Route path="/orders" element={<AnimatedPage><Orders /></AnimatedPage>} />
          <Route path="/terms" element={<AnimatedPage><Terms /></AnimatedPage>} />
          <Route path="/refund-policy" element={<AnimatedPage><RefundPolicy /></AnimatedPage>} />
          <Route path="/profile" element={<AnimatedPage><UserProfile /></AnimatedPage>} />
          <Route path="/states" element={<AnimatedPage><States /></AnimatedPage>} />
          <Route path="/states/:state" element={<AnimatedPage><StateKarigars /></AnimatedPage>} />
          <Route path="/stories" element={<AnimatedPage><SuccessStories /></AnimatedPage>} />
          <Route path="/workshops" element={<AnimatedPage><Workshops /></AnimatedPage>} />
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Routes>
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDF6EC] flex items-center justify-center text-center px-4 pt-20">
      <div>
        <p className="text-6xl mb-4">🏺</p>
        <p className="font-devanagari text-[#C0522B] text-xl mb-2">यह पृष्ठ नहीं मिला</p>
        <h1 className="font-display text-4xl font-bold text-[#2C1A0E] mb-3">Page Not Found</h1>
        <p className="text-[#7B5C3A] mb-6">This page seems to have wandered off like a nomadic karigar.</p>
        <a href="/" className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
          Home पर जाएं
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
