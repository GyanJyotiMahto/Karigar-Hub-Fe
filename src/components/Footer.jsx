import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Share2, AtSign, Globe2 } from 'lucide-react';

const shareOptions = [
  { label: 'WhatsApp',  getUrl: (u) => `https://wa.me/?text=${encodeURIComponent('Bharat Ka Hunar – ' + u)}` },
  { label: 'Facebook',  getUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { label: 'LinkedIn',  getUrl: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
  { label: 'Telegram',  getUrl: (u) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent('Bharat Ka Hunar – Discover handcrafted products')}` },
  { label: 'Threads',   getUrl: null, copy: true, toast: 'Link copied. Share on Threads' },
  { label: 'Instagram', getUrl: null, copy: true, toast: 'Link copied. Share on Instagram' },
  { label: 'Copy Link', getUrl: null, copy: true, toast: 'Link copied successfully' },
];

function ShareButton() {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleShare = async () => {
    const url = 'https://karigarhub.co.in';
    if (navigator.share) {
      try { await navigator.share({ title: 'Karigar Hub', text: 'Bharat Ka Hunar – Discover handcrafted products', url }); } catch (_) {}
    } else {
      setOpen(prev => !prev);
    }
  };

  const handleOption = (option) => {
    const url = 'https://karigarhub.co.in';
    setOpen(false);
    if (option.copy) {
      navigator.clipboard.writeText(url).then(() => showToast(option.toast));
    } else {
      window.open(option.getUrl(url), '_blank', 'noopener');
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button onClick={handleShare}
        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C0522B] transition-colors">
        <Share2 size={15} />
      </button>
      {open && (
        <div className="absolute top-11 left-0 bg-[#2A1208] border border-white/10 rounded-xl shadow-xl py-1.5 w-44 z-50">
          {shareOptions.map(opt => (
            <button key={opt.label} onClick={() => handleOption(opt)}
              className="w-full text-left px-4 py-2 text-sm text-[#E8D5B0] hover:bg-white/10 hover:text-white transition-colors">
              {opt.label}
            </button>
          ))}
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1E4D2B] text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function MentionButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(prev => !prev)}
        className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C0522B] transition-colors">
        <AtSign size={15} />
      </button>
      {open && (
        <div className="absolute top-11 left-0 bg-[#2A1208] border border-white/10 rounded-xl shadow-xl py-1.5 w-40 z-50">
          <a href="https://www.instagram.com/karigarhub.co?igsh=ZWtwcm90emc3czR5" target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#E8D5B0] hover:bg-white/10 hover:text-white transition-colors">
            <i className="fa-brands fa-instagram" style={{ color: 'rgb(173, 57, 87)' }}></i> Instagram
          </a>
          <a href="https://www.threads.net/@karigarhub.co" target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-[#E8D5B0] hover:bg-white/10 hover:text-white transition-colors">
            <i className="fa-brands fa-threads" style={{ color: 'rgb(173, 57, 87)' }}></i> Threads
          </a>
        </div>
      )}
    </div>
  );
}

const footerLinks = {
  'Shop': [
    { label: 'All Products',      to: '/products' },
    { label: 'Handloom & Sarees', to: '/products?category=Handloom' },
    { label: 'Jewellery',         to: '/products?category=Jewellery' },
    { label: 'Pottery & Decor',   to: '/products?category=Pottery' },
    { label: 'Paintings',         to: '/products?category=Paintings' },
    { label: 'Festive Items',     to: '/products?category=Festive Items' },
  ],
  'Karigars': [
    { label: 'Meet Artisans',     to: '/artisans' },
    { label: 'Become a Karigar',  to: '/register?type=artisan' },
    { label: 'Karigar Dashboard', to: '/dashboard' },
    { label: 'Success Stories',   to: '/stories' },
  ],
  'Shop by State': [
    { label: 'Odisha',            to: '/products?state=Odisha' },
    { label: 'Rajasthan',         to: '/products?state=Rajasthan' },
    { label: 'West Bengal',       to: '/products?state=West Bengal' },
    { label: 'Gujarat',           to: '/products?state=Gujarat' },
    { label: 'Uttar Pradesh',     to: '/products?state=Uttar Pradesh' },
    { label: 'Bihar',             to: '/products?state=Bihar' },
    { label: 'Assam',             to: '/products?state=Assam' },
    { label: 'Kashmir',           to: '/products?state=Kashmir' },
    { label: 'Maharashtra',       to: '/products?state=Maharashtra' },
    { label: 'Tamil Nadu',        to: '/products?state=Tamil Nadu' },
    { label: 'Kerala',            to: '/products?state=Kerala' },
    { label: 'Karnataka',         to: '/products?state=Karnataka' },
    { label: 'Andhra Pradesh',    to: '/products?state=Andhra Pradesh' },
    { label: 'Telangana',         to: '/products?state=Telangana' },
    { label: 'Madhya Pradesh',    to: '/products?state=Madhya Pradesh' },
    { label: 'Punjab',            to: '/products?state=Punjab' },
    { label: 'Himachal Pradesh',  to: '/products?state=Himachal Pradesh' },
    { label: 'Uttarakhand',       to: '/products?state=Uttarakhand' },
    { label: 'Jharkhand',         to: '/products?state=Jharkhand' },
    { label: 'Chhattisgarh',      to: '/products?state=Chhattisgarh' },
    { label: 'Manipur',           to: '/products?state=Manipur' },
    { label: 'Nagaland',          to: '/products?state=Nagaland' },
    { label: 'Meghalaya',         to: '/products?state=Meghalaya' },
    { label: 'Tripura',           to: '/products?state=Tripura' },
    { label: 'Mizoram',           to: '/products?state=Mizoram' },
    { label: 'Arunachal Pradesh', to: '/products?state=Arunachal Pradesh' },
    { label: 'Sikkim',            to: '/products?state=Sikkim' },
    { label: 'Goa',               to: '/products?state=Goa' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#1E0E06] text-[#E8D5B0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#C0522B] flex items-center justify-center text-white font-bold font-display">क</div>
              <div>
                <span className="font-display text-lg font-bold text-white block">Karigar Hub</span>
                <span className="text-[10px] tracking-widest text-[#C0522B]">BHARAT KA HUNAR</span>
              </div>
            </div>
            <p className="text-sm text-[#B8A080] leading-relaxed mb-5 max-w-xs">
              भारत के हुनर को घर घर तक। A premium marketplace celebrating India's living craft heritage — connecting skilled karigars with conscious buyers.
            </p>
            <div className="flex items-center gap-1.5 text-sm text-[#B8A080] mb-2">
              <MapPin size={13} className="text-[#C0522B]" />
              <span>Artisans from 28 Indian states</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-[#B8A080]">
              <Mail size={13} className="text-[#C0522B]" />
              <a href="mailto:karigarhub.co@gmail.com" className="text-sm text-[#B8A080] hover:text-[#C0522B] transition-colors">karigarhub.co@gmail.com</a>
            </div>
            <div className="flex gap-3 mt-5">
              <ShareButton />
              <MentionButton />
              <a href="https://karigarhub.co.in" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C0522B] transition-colors">
                <Globe2 size={15} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-[#B8A080] hover:text-[#C0522B] transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white font-semibold mb-1">हमारे साथ जुड़ें — Join Our Community</p>
              <p className="text-sm text-[#B8A080]">Artisan stories, new arrivals, and festival collections in your inbox.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input type="email" placeholder="aapka@email.com"
                className="flex-1 sm:w-60 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-[#B8A080] text-sm focus:outline-none focus:border-[#C0522B]" />
              <button className="px-5 py-2.5 bg-[#C0522B] text-white rounded-full text-sm font-semibold hover:bg-[#9A3E1E] transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#B8A080]">
          <p>©Copyright Karigarhub.co.in</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#C0522B] transition-colors">Privacy Policy</a>
            <Link to="/terms" className="hover:text-[#C0522B] transition-colors">Terms &amp; Conditions</Link>
            <Link to="/refund-policy" className="hover:text-[#C0522B] transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
