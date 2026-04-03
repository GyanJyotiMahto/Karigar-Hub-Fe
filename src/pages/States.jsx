import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { getArtisans } from '../services/api';
import { SectionHeader } from '../components/UI';
import { states as stateImages } from '../data/sampleData';

export default function States() {
  const [stateGroups, setStateGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtisans()
      .then(data => {
        const artisans = Array.isArray(data) ? data : [];
        // Group artisans by state
        const groups = {};
        artisans.forEach(a => {
          const state = a.address?.state || a.state;
          if (!state) return;
          if (!groups[state]) groups[state] = [];
          groups[state].push(a);
        });
        // Convert to array sorted by karigar count
        const sorted = Object.entries(groups)
          .map(([name, karigars]) => ({ name, karigars, count: karigars.length }))
          .sort((a, b) => b.count - a.count);
        setStateGroups(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getStateImage = (stateName) => {
    const found = stateImages.find(s => s.name.toLowerCase() === stateName.toLowerCase());
    return found?.image || null;
  };

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Shop by State"
          hindi="राज्य के अनुसार खरीदें"
          title="Karigars Across Bharat"
          subtitle="Explore handcrafted traditions from every corner of India. Click a state to meet its karigars."
        />

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-[#E8D5B0] animate-pulse" />
            ))}
          </div>
        ) : stateGroups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🗺️</p>
            <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">No karigars registered yet</h3>
            <p className="text-[#7B5C3A] mb-6">Be the first karigar to join from your state!</p>
            <Link to="/register?type=artisan"
              className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
              Join as Karigar
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#7B5C3A] mb-8">
              Karigars registered from <span className="font-bold text-[#2C1A0E]">{stateGroups.length}</span> state{stateGroups.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {stateGroups.map((s, i) => {
                const img = getStateImage(s.name);
                return (
                  <motion.div key={s.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}>
                    <Link to={`/states/${encodeURIComponent(s.name)}`}
                      className="group relative block rounded-2xl overflow-hidden aspect-square hover:shadow-xl transition-all">
                      {img
                        ? <img src={img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        : <div className="w-full h-full bg-gradient-to-br from-[#C0522B] to-[#7B1C2E]" />
                      }
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E0E06]/85 via-[#1E0E06]/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                        <p className="text-white font-bold text-sm leading-tight">{s.name}</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <MapPin size={9} className="text-[#E8D5B0]" />
                          <p className="text-[#E8D5B0] text-[10px]">{s.count} karigar{s.count !== 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      {/* Karigar profile pics preview */}
                      <div className="absolute top-2 right-2 flex -space-x-2">
                        {s.karigars.slice(0, 3).map((a, j) => (
                          <div key={j} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-[#C0522B] flex items-center justify-center text-white text-[10px] font-bold">
                            {a.profileImage
                              ? <img src={a.profileImage} alt={a.name} className="w-full h-full object-cover" />
                              : a.name?.[0]?.toUpperCase()
                            }
                          </div>
                        ))}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
