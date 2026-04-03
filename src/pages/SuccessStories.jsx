import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Award, Star, ArrowRight, Quote } from 'lucide-react';
import { getArtisans } from '../services/api';

export default function SuccessStories() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    getArtisans()
      .then(data => setArtisans(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load stories. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-[#C0522B] uppercase mb-2">सफलता की कहानियाँ</p>
          <h1 className="font-display text-4xl font-bold text-[#2C1A0E] mb-3">Success Stories</h1>
          <p className="text-[#7B5C3A] max-w-xl mx-auto leading-relaxed">
            Real stories of India's master karigars — their craft, their journey, and the lives they've transformed through their art.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8D5B0]/50 p-6 animate-pulse flex gap-5">
                <div className="w-20 h-20 rounded-full bg-[#E8D5B0] shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-[#E8D5B0] rounded w-1/3" />
                  <div className="h-3 bg-[#E8D5B0] rounded w-1/4" />
                  <div className="h-3 bg-[#E8D5B0] rounded w-full" />
                  <div className="h-3 bg-[#E8D5B0] rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-[#7B5C3A]">{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && artisans.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎨</p>
            <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">No Stories Yet</h3>
            <p className="text-[#7B5C3A]">Karigar stories will appear here once artisans join the platform.</p>
          </div>
        )}

        {/* Stories list */}
        {!loading && !error && artisans.length > 0 && (
          <div className="space-y-6">
            {artisans.map((artisan, i) => {
              const id         = artisan._id || artisan.id;
              const profileImg = artisan.profileImage || artisan.avatar || null;
              const state      = artisan.address?.state || artisan.state || '';
              const city       = artisan.address?.city  || artisan.city  || '';
              const craft      = artisan.category || artisan.craft || '';
              const initials   = artisan.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'K';
              const location   = [city, state].filter(Boolean).join(', ');

              return (
                <motion.div
                  key={id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white rounded-2xl border border-[#E8D5B0]/60 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-0">

                    {/* Left accent bar */}
                    <div className="w-full sm:w-1.5 bg-gradient-to-b from-[#C0522B] to-[#7B1C2E] shrink-0 sm:rounded-l-2xl min-h-[6px] sm:min-h-0" />

                    <div className="flex flex-col sm:flex-row gap-5 p-6 flex-1">

                      {/* Profile icon */}
                      <div className="shrink-0">
                        <div className="w-20 h-20 rounded-full border-[3px] border-[#E8D5B0] overflow-hidden bg-[#C0522B] flex items-center justify-center text-white font-bold text-xl font-display shadow-md">
                          {profileImg
                            ? <img src={profileImg} alt={artisan.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                            : initials
                          }
                        </div>
                        {artisan.isVerified && (
                          <div className="flex justify-center mt-2">
                            <span className="text-[10px] bg-[#1E4D2B] text-white px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Award size={8} /> Verified
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Story content */}
                      <div className="flex-1 min-w-0">

                        {/* Name + meta */}
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                          <div>
                            <h2 className="font-display text-xl font-bold text-[#2C1A0E]">{artisan.name}</h2>
                            <p className="text-sm text-[#C0522B] font-semibold">{craft}</p>
                          </div>
                          {artisan.ratings > 0 && (
                            <div className="flex items-center gap-1 bg-[#FDF6EC] border border-[#E8D5B0] px-2.5 py-1 rounded-full">
                              <Star size={11} className="fill-[#C9920A] text-[#C9920A]" />
                              <span className="text-xs font-bold text-[#2C1A0E]">{artisan.ratings}</span>
                            </div>
                          )}
                        </div>

                        {/* Location */}
                        {location && (
                          <div className="flex items-center gap-1 text-xs text-[#7B5C3A] mb-3">
                            <MapPin size={11} className="text-[#C0522B]" />
                            <span>{location}</span>
                            {artisan.businessName && (
                              <><span className="mx-1">·</span><span className="font-semibold">{artisan.businessName}</span></>
                            )}
                          </div>
                        )}

                        {/* Bio / Story */}
                        {artisan.bio ? (
                          <div className="relative mb-4">
                            <Quote size={18} className="text-[#E8D5B0] absolute -top-1 -left-1" />
                            <p className="text-sm text-[#5C3317] leading-relaxed pl-5 italic">
                              {artisan.bio}
                            </p>
                          </div>
                        ) : (
                          <p className="text-sm text-[#B8A080] italic mb-4">
                            This karigar's story is being crafted — just like their art. 🎨
                          </p>
                        )}

                        {/* Footer row */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3 text-xs text-[#7B5C3A]">
                            {artisan.totalSales > 0 && (
                              <span className="bg-[#F5ECD8] px-2.5 py-1 rounded-full font-semibold">
                                {artisan.totalSales} sales
                              </span>
                            )}
                            {artisan.numReviews > 0 && (
                              <span className="bg-[#F5ECD8] px-2.5 py-1 rounded-full font-semibold">
                                {artisan.numReviews} reviews
                              </span>
                            )}
                          </div>
                          <Link
                            to={`/artisans/${id}`}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#C0522B] hover:text-[#9A3E1E] transition-colors"
                          >
                            Full Story पढ़ें <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && artisans.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-[#7B5C3A] text-sm mb-4">Want to be part of this journey?</p>
            <Link
              to="/register?type=artisan"
              className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-8 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all shadow-md"
            >
              Karigar बनें <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
