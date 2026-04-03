import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { getAllWorkshops } from '../services/api';

const STATUS_STYLES = {
  upcoming: { label: 'Upcoming', cls: 'bg-green-100 text-green-700 border-green-200' },
  past:     { label: 'Past',     cls: 'bg-gray-100  text-gray-600  border-gray-200'  },
  live:     { label: '🔴 Live Now', cls: 'bg-red-100 text-red-600 border-red-200'   },
};

function getStatus(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  if (isNaN(d)) return 'upcoming';
  d.setHours(0, 0, 0, 0);
  if (d.getTime() === today.getTime()) return 'live';
  return d > today ? 'upcoming' : 'past';
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getAllWorkshops()
      .then(data => setWorkshops(Array.isArray(data) ? data : []))
      .catch(() => setWorkshops([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-widest text-[#C0522B] uppercase mb-2">कला सीखो, कला जियो</p>
          <h1 className="font-display text-4xl font-bold text-[#2C1A0E] mb-3">Karigar Workshops</h1>
          <p className="text-[#7B5C3A] max-w-xl mx-auto leading-relaxed">
            Learn directly from India's master karigars. Live sessions, craft kits, and a community of 50,000+ craft lovers.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-[#E8D5B0]/60 p-8 animate-pulse space-y-4">
                <div className="h-5 bg-[#E8D5B0] rounded w-1/3" />
                <div className="h-4 bg-[#E8D5B0] rounded w-2/3" />
                <div className="h-4 bg-[#E8D5B0] rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Workshop Cards */}
        {!loading && (
          <div className="space-y-8">
            {workshops.map((w, i) => {
              const artist  = w.artistId || {};
              const status  = STATUS_STYLES[getStatus(w.date)] || STATUS_STYLES.upcoming;
              const timeStr = w.fromTime && w.toTime ? `${w.fromTime} – ${w.toTime} IST` : '';
              const location = [artist.address?.city, artist.address?.state].filter(Boolean).join(', ');

              return (
                <motion.div
                  key={w._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-3xl border border-[#E8D5B0]/60 shadow-sm overflow-hidden"
                >
                  {/* Top accent */}
                  <div className="h-1.5 bg-gradient-to-r from-[#C0522B] to-[#7B1C2E]" />

                  <div className="p-6 sm:p-8">

                    {/* Status + badges */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${status.cls}`}>
                        {status.label}
                      </span>
                      <span className="text-xs font-bold px-3 py-1 rounded-full border bg-[#1E4D2B]/10 text-[#1E4D2B] border-[#1E4D2B]/20">
                        FREE
                      </span>
                      <span className="text-xs font-semibold text-[#7B5C3A] bg-[#F5ECD8] px-3 py-1 rounded-full">
                        Beginner
                      </span>
                    </div>

                    <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">{w.title}</h2>
                    <p className="text-[#5C3317] leading-relaxed mb-6">{w.description}</p>

                    {/* Artist card */}
                    <div className="flex items-center gap-4 bg-[#FDF6EC] border border-[#E8D5B0]/60 rounded-2xl p-4 mb-6">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#E8D5B0] shrink-0 bg-[#C0522B] flex items-center justify-center text-white font-bold text-lg">
                        {artist.profileImage
                          ? <img src={artist.profileImage} alt={artist.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                          : (artist.name?.[0] || '?')
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-[#2C1A0E]">{artist.name || 'Karigar'}</p>
                        <p className="text-xs text-[#C0522B] font-semibold">{artist.category || ''}</p>
                        {location && (
                          <div className="flex items-center gap-1 text-xs text-[#7B5C3A] mt-0.5">
                            <MapPin size={10} className="text-[#C0522B]" />
                            <span>{location}</span>
                          </div>
                        )}
                      </div>
                      {artist._id && (
                        <Link to={`/artisans/${artist._id}`}
                          className="text-xs font-semibold text-[#C0522B] hover:text-[#9A3E1E] transition-colors whitespace-nowrap flex items-center gap-1">
                          Profile <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>

                    {/* Session details grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {[
                        { icon: Calendar, label: 'Date',     value: formatDate(w.date) },
                        { icon: Clock,    label: 'Time',     value: timeStr || '—' },
                        { icon: Users,    label: 'Duration', value: w.duration || '—' },
                        { icon: MapPin,   label: 'Mode',     value: 'Live Online (Zoom)' },
                      ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="bg-[#F5ECD8] rounded-xl p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon size={12} className="text-[#C0522B]" />
                            <p className="text-[10px] font-bold text-[#7B5C3A] uppercase tracking-wide">{label}</p>
                          </div>
                          <p className="text-xs font-semibold text-[#2C1A0E] leading-tight">{value}</p>
                        </div>
                      ))}
                    </div>

                    {/* What you'll learn — from description sentences */}
                    {artist.bio && (
                      <div className="mb-6">
                        <p className="text-sm font-bold text-[#2C1A0E] mb-3">About the Karigar</p>
                        <p className="text-sm text-[#5C3317] leading-relaxed">{artist.bio}</p>
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {w.zoomLink ? (
                        <a href={w.zoomLink} target="_blank" rel="noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#C0522B] text-white rounded-full font-bold hover:bg-[#9A3E1E] transition-all shadow-md">
                          Join Now <ArrowRight size={16} />
                        </a>
                      ) : (
                        <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#C0522B] text-white rounded-full font-bold hover:bg-[#9A3E1E] transition-all shadow-md">
                          Join Now <ArrowRight size={16} />
                        </button>
                      )}
                      {artist._id && (
                        <Link to={`/artisans/${artist._id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-[#C0522B] text-[#C0522B] rounded-full font-bold hover:bg-[#C0522B] hover:text-white transition-all">
                          Meet the Karigar
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && workshops.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎨</p>
            <p className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">No workshops yet</p>
            <p className="text-sm text-[#7B5C3A]">Karigars are preparing upcoming sessions. Stay tuned!</p>
          </div>
        )}

        {/* Coming soon note */}
        {!loading && workshops.length > 0 && (
          <div className="mt-10 text-center bg-white border border-[#E8D5B0]/60 rounded-2xl p-6">
            <p className="text-2xl mb-2">🎨</p>
            <p className="font-display text-lg font-bold text-[#2C1A0E] mb-1">More workshops coming soon</p>
            <p className="text-sm text-[#7B5C3A]">We are onboarding more karigars for upcoming sessions. Stay tuned!</p>
          </div>
        )}
      </div>
    </div>
  );
}
