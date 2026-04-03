import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Package, Award } from 'lucide-react';

export default function ArtisanCard({ artisan }) {
  const id = artisan._id || artisan.id;
  const state = artisan.address?.state || artisan.state || '';
  const city = artisan.address?.city || artisan.city || '';
  const craft = artisan.category || artisan.craft || '';
  const profileImg = artisan.profileImage || artisan.avatar || null;
  const coverImg = artisan.coverImage || null;
  const initials = artisan.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'K';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-[#E8D5B0]/50"
    >
      {/* Cover — position:relative so avatar can be anchored inside */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-[#C0522B] to-[#7B1C2E]">
        {coverImg && (
          <img src={coverImg} alt={artisan.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0E06]/60 to-transparent" />
        {state && (
          <div className="absolute bottom-3 left-4">
            <span className="text-[10px] bg-[#C0522B] text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
              🇮🇳 {state}
            </span>
          </div>
        )}
        {artisan.isVerified && (
          <div className="absolute top-3 left-3">
            <span className="text-[10px] bg-[#1E4D2B] text-white px-2 py-0.5 rounded-full font-semibold">✓ Verified</span>
          </div>
        )}
        {/* FIXED: top-right positioning using absolute inside relative container */}
        <div className="absolute top-3 right-3 w-16 h-16 rounded-full border-[3px] border-white shadow-md overflow-hidden bg-[#C0522B] flex items-center justify-center text-white font-bold text-lg font-display">
          {profileImg
            ? <img src={profileImg} alt={artisan.name} className="w-full h-full object-cover" />
            : initials
          }
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pb-5 pt-3">
        <h3 className="font-display text-[#2C1A0E] font-bold text-base mb-0.5">{artisan.name}</h3>
        <p className="text-xs text-[#C0522B] font-semibold mb-1">{craft}</p>
        <div className="flex items-center gap-1 text-xs text-[#7B5C3A] mb-3">
          {city && <><MapPin size={10} /><span>{city}{state ? `, ${state}` : ''}</span></>}
          {artisan.businessName && <><span className="mx-1">·</span><Award size={10} /><span className="truncate max-w-[80px]">{artisan.businessName}</span></>}
        </div>
        {artisan.bio && (
          <p className="text-xs text-[#5C3317] leading-relaxed line-clamp-2 mb-4">{artisan.bio}</p>
        )}
        <div className="flex items-center justify-between text-xs text-[#7B5C3A] mb-4">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-[#C9920A] text-[#C9920A]" />
            <span className="font-bold text-[#2C1A0E]">{artisan.rating || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package size={10} />
            <span>{artisan.totalSales || 0} sales</span>
          </div>
        </div>
        <Link
          to={`/artisans/${id}`}
          className="block w-full text-center py-2.5 rounded-full border border-[#C0522B] text-[#C0522B] text-sm font-semibold hover:bg-[#C0522B] hover:text-white transition-all"
        >
          Profile देखें
        </Link>
      </div>
    </motion.div>
  );
}
