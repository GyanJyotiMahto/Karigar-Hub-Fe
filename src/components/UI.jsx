import { motion } from 'framer-motion';

export function SectionHeader({ eyebrow, title, subtitle, center = true, hindi }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${center ? 'text-center' : ''}`}
    >
      {eyebrow && (
        <p className="text-[#C0522B] text-xs font-bold tracking-widest uppercase mb-3 flex items-center gap-2 justify-center">
          <span className="w-6 h-px bg-[#C0522B]" />{eyebrow}<span className="w-6 h-px bg-[#C0522B]" />
        </p>
      )}
      {hindi && (
        <p className="font-devanagari text-[#C0522B] text-lg mb-1">{hindi}</p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#2C1A0E] leading-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#7B5C3A] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#C9920A' : '#E8D5B0'}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-[#E8D5B0] text-[#5C3317]',
    green: 'bg-[#1E4D2B]/10 text-[#1E4D2B]',
    terracotta: 'bg-[#C0522B]/10 text-[#C0522B]',
    gold: 'bg-[#C9920A]/10 text-[#B8860B]',
    maroon: 'bg-[#7B1C2E]/10 text-[#7B1C2E]',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${variants[variant]}`}>
      {children}
    </span>
  );
}

export function Skeleton({ className = '' }) {
  return <div className={`bg-[#E8D5B0]/60 animate-pulse rounded-xl ${className}`} />;
}
