import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, ShoppingBag, Share2, Calendar, Award, UserPlus, UserCheck } from 'lucide-react';
import { getArtisan, getProducts, toggleFollow } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import { StarRating } from '../components/UI';

export default function ArtisanProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [artisan, setArtisan] = useState(null);
  const [artisanProducts, setArtisanProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState('');

  useEffect(() => {
    Promise.all([
      getArtisan(id),
      getProducts({ artist: id }),
    ])
      .then(([a, p]) => {
        setArtisan(a);
        setArtisanProducts(Array.isArray(p) ? p : []);
        const count = a.followers?.length || 0;
        setFollowersCount(count);
        if (user) {
          const uid = (user._id || user.id || '').toString();
          setFollowing(a.followers?.some(f => (f._id || f).toString() === uid) || false);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleFollow = async () => {
    if (!user) return;
    setFollowLoading(true);
    setFollowError('');
    try {
      const res = await toggleFollow(id);
      setFollowing(res.following);
      setFollowersCount(res.followersCount);
    } catch (err) {
      setFollowError(err.message || 'Failed to follow');
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#FDF6EC] pt-20 flex items-center justify-center">
      <div className="animate-pulse text-[#C0522B] text-lg font-display">Loading...</div>
    </div>
  );

  if (!artisan) return (
    <div className="min-h-screen bg-[#FDF6EC] pt-20 flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🎨</p>
        <h3 className="font-display text-2xl font-bold text-[#2C1A0E] mb-2">Karigar not found</h3>
        <Link to="/artisans" className="text-[#C0522B] font-semibold hover:underline">Browse all karigars</Link>
      </div>
    </div>
  );

  const state = artisan.address?.state || artisan.state || '';
  const city = artisan.address?.city || artisan.city || '';

  return (
    <div className="min-h-screen bg-[#FDF6EC] pt-20 pb-16">
      {/* Cover */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-br from-[#C0522B] to-[#7B1C2E]">
        {artisan.coverImage && <img src={artisan.coverImage} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1E0E06]/75 to-transparent" />
        <div className="absolute bottom-6 left-6">
          <span className="bg-[#C0522B] text-white text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
            🇮🇳 {state}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative -mt-16 mb-8">
          <div className="bg-white rounded-3xl border border-[#E8D5B0]/60 p-6 md:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg shrink-0 bg-[#C0522B] flex items-center justify-center text-white text-3xl font-bold font-display overflow-hidden">
                {artisan.profileImage
                  ? <img src={artisan.profileImage} alt={artisan.name} className="w-full h-full object-cover" />
                  : artisan.name?.[0]?.toUpperCase()
                }
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-[#2C1A0E] mb-1">{artisan.name}</h1>
                    <p className="text-[#C0522B] font-bold mb-2">{artisan.category}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-[#7B5C3A] mb-3">
                      {city && <span className="flex items-center gap-1"><MapPin size={13} /> {city}, {state}</span>}
                      {artisan.createdAt && <span className="flex items-center gap-1"><Calendar size={13} /> Since {new Date(artisan.createdAt).getFullYear()}</span>}
                      {artisan.isVerified && <span className="flex items-center gap-1 text-green-600"><Award size={13} /> Verified</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-3">
                      <button className="w-10 h-10 rounded-full bg-[#F5ECD8] flex items-center justify-center text-[#5C3317] hover:bg-[#C0522B] hover:text-white transition-colors">
                        <Share2 size={15} />
                      </button>
                      {user ? (
                        <button
                          onClick={handleFollow}
                          disabled={followLoading}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all disabled:opacity-60 ${
                            following
                              ? 'bg-[#1E4D2B]/10 text-[#1E4D2B] border-2 border-[#1E4D2B] hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                              : 'bg-[#1E4D2B] text-white hover:bg-[#163a20]'
                          }`}>
                          {followLoading
                            ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            : following
                              ? <><UserCheck size={14} /> <span>Following</span></>
                              : <><UserPlus size={14} /> <span>Follow</span></>
                          }
                        </button>
                      ) : (
                        <Link to="/login"
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-[#1E4D2B] text-white hover:bg-[#163a20] transition-all">
                          <UserPlus size={14} /> Follow
                        </Link>
                      )}
                      <Link to="/products"
                        className="flex items-center gap-2 bg-[#C0522B] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#9A3E1E] transition-all">
                        <ShoppingBag size={14} /> Shop Now
                      </Link>
                    </div>
                    {followError && (
                      <p className="text-xs text-red-500 font-semibold">{followError}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#E8D5B0]/60">
              {[
                { label: 'Rating',    value: artisan.rating || 0,       icon: '⭐' },
                { label: 'Products',  value: artisanProducts.length,     icon: '🎨' },
                { label: 'Followers', value: followersCount,             icon: '👥' },
                { label: 'Status',    value: artisan.isVerified ? 'Verified' : 'Pending', icon: '✅' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl mb-0.5">{stat.icon}</p>
                  <p className="font-display text-xl font-bold text-[#2C1A0E]">{stat.value}</p>
                  <p className="text-xs text-[#7B5C3A]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bio + Social Proof */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8D5B0]/60 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-4">मेरी कहानी — My Story</h2>
            <p className="text-[#5C3317] leading-relaxed">{artisan.bio || 'This karigar has not added a bio yet.'}</p>
            {artisan.businessName && (
              <div className="mt-6 p-4 bg-[#F5ECD8]/60 rounded-2xl border border-[#E8D5B0]/60">
                <h4 className="font-semibold text-[#2C1A0E] text-sm mb-1">🏪 Business</h4>
                <p className="text-sm text-[#5C3317]">{artisan.businessName}</p>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-[#C0522B] to-[#7B1C2E] rounded-3xl p-6 text-white">
            <h3 className="font-display text-xl font-bold mb-4">Karigar Profile</h3>
            <div className="space-y-4">
              <div className="bg-white/15 rounded-2xl p-4">
                <StarRating rating={artisan.rating || 0} />
                <p className="text-2xl font-bold mt-1">{artisan.rating || 0}/5.0</p>
                <p className="text-white/75 text-sm">Seller rating</p>
              </div>
              <div className="bg-white/15 rounded-2xl p-4">
                <p className="text-3xl font-bold">{artisanProducts.length}</p>
                <p className="text-white/75 text-sm">Products listed</p>
              </div>
              <div className="bg-white/15 rounded-2xl p-4">
                <p className="text-lg font-bold">{artisan.isVerified ? '✅ Verified Karigar' : '⏳ Verification Pending'}</p>
                <p className="text-white/75 text-sm">{artisan.category}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h2 className="font-display text-2xl font-bold text-[#2C1A0E] mb-6">
            {artisan.name?.split(' ')[0]} जी का संग्रह — Collection
          </h2>
          {artisanProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {artisanProducts.map((product, i) => (
                <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <ProductCard product={{ ...product, id: product._id, image: product.images?.[0] }} />
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-[#7B5C3A] text-center py-12">No products listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
