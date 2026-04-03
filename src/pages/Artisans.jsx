import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getArtisans } from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import { SectionHeader } from '../components/UI';

export default function Artisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getArtisans()
      .then(data => setArtisans(Array.isArray(data) ? data : []))
      .catch(() => setError('Failed to load artisans. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="The Makers" hindi="हमारे कारीगर"
          title="Meet India's Master Karigars"
          subtitle="Verified craftspeople from across India, each with a unique story and extraordinary skill passed down through generations." />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[#E8D5B0]/50 overflow-hidden animate-pulse">
                <div className="h-40 bg-[#E8D5B0]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#E8D5B0] rounded w-1/2" />
                  <div className="h-3 bg-[#E8D5B0] rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">⚠️</p>
            <p className="text-[#7B5C3A]">{error}</p>
          </div>
        ) : artisans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎨</p>
            <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">No Karigars Yet</h3>
            <p className="text-[#7B5C3A]">Be the first to join as a karigar and share your craft with India.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#7B5C3A] mb-6">
              Showing <span className="font-bold text-[#2C1A0E]">{artisans.length}</span> verified karigar{artisans.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artisans.map((artisan, i) => (
                <motion.div key={artisan._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <ArtisanCard artisan={{
                    ...artisan,
                    id: artisan._id,
                    state: artisan.address?.state || artisan.state,
                    city: artisan.address?.city || artisan.city,
                    craft: artisan.category,
                  }} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
