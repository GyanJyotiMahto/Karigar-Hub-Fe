import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getArtisans } from '../services/api';
import ArtisanCard from '../components/ArtisanCard';
import { SectionHeader } from '../components/UI';

export default function StateKarigars() {
  const { state } = useParams();
  const decodedState = decodeURIComponent(state);
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArtisans()
      .then(data => {
        const filtered = (Array.isArray(data) ? data : []).filter(a =>
          (a.address?.state || a.state || '').toLowerCase() === decodedState.toLowerCase()
        );
        setArtisans(filtered);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [decodedState]);

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/states" className="p-2 rounded-full hover:bg-[#F5ECD8] text-[#5C3317] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="text-xs text-[#C0522B] font-bold uppercase tracking-widest">Karigars from</p>
            <h1 className="font-display text-3xl font-bold text-[#2C1A0E]">{decodedState}</h1>
          </div>
        </div>

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
        ) : artisans.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🗺️</p>
            <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">No Karigars from {decodedState} yet</h3>
            <p className="text-[#7B5C3A] mb-6">Be the first karigar from {decodedState} to join!</p>
            <Link to="/register?type=artisan"
              className="inline-flex items-center gap-2 bg-[#C0522B] text-white px-6 py-3 rounded-full font-bold hover:bg-[#9A3E1E] transition-all">
              Join as Karigar
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#7B5C3A] mb-6">
              <span className="font-bold text-[#2C1A0E]">{artisans.length}</span> karigar{artisans.length !== 1 ? 's' : ''} from {decodedState}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artisans.map((artisan, i) => (
                <motion.div key={artisan._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <ArtisanCard artisan={artisan} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
