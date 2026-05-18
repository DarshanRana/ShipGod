import { motion } from 'framer-motion';
import {
  HiStar, HiPhone, HiShieldCheck, HiLocationMarker,
  HiTruck, HiScale, HiBadgeCheck, HiMail, HiGlobe
} from 'react-icons/hi';
import { FiArrowRight } from 'react-icons/fi';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-slate-600'}`} />
      ))}
    </div>
  );
}

export default function CompanyCard({ company, index, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.005 }}
      className="group glass rounded-2xl p-6 card-glow card-glow-hover transition-all duration-500 relative overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${company.logoColor}10 0%, transparent 70%)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-lg shrink-0"
            style={{ background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}99)` }}
          >
            {company.logo}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-base leading-tight">{company.name}</h3>
              {company.verified && <HiBadgeCheck className="text-blue-400 text-base shrink-0" title="Verified" />}
            </div>
            {/* Real address */}
            <div className="flex items-start gap-1 text-slate-400 text-xs mt-0.5 max-w-xs">
              <HiLocationMarker className="text-orange-400 text-xs mt-0.5 shrink-0" />
              <span className="line-clamp-2">{company.address}</span>
            </div>
          </div>
        </div>

        {/* Availability badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${
          company.availableNow
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${company.availableNow ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          {company.availableNow ? 'Open' : 'Busy'}
        </div>
      </div>

      {/* Rating & Fleet */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <StarRating rating={company.rating} />
          <span className="text-white font-semibold text-sm">{company.rating}</span>
          <span className="text-slate-500 text-xs">({company.reviewCount} reviews)</span>
        </div>
        <div className="text-xs text-slate-400">
          Fleet: <span className="text-white font-medium">{company.fleetSize}+</span> vehicles
        </div>
      </div>

      {/* Trailer & Capacity */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <HiTruck className="text-orange-400 text-xs" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Trailer</span>
          </div>
          <span className="text-sm text-white font-medium">{company.trailerType}</span>
        </div>
        <div className="glass rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <HiScale className="text-orange-400 text-xs" />
            <span className="text-xs text-slate-400 uppercase tracking-wider">Max Load</span>
          </div>
          <span className="text-sm text-white font-medium">{company.maxCapacity}</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
        {company.specialties.slice(0, 3).map(s => (
          <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/8">
            {s}
          </span>
        ))}
      </div>

      {/* Contact row */}
      <div className="flex items-center justify-between pt-4 border-t border-white/8 relative z-10">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${company.phone}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 glass rounded-xl border border-white/10 hover:border-orange-500/40 text-slate-300 hover:text-orange-400 transition-all text-xs font-medium"
          >
            <HiPhone className="text-sm" /> Call
          </a>
          <a
            href={`mailto:${company.email}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 glass rounded-xl border border-white/10 hover:border-blue-500/40 text-slate-300 hover:text-blue-400 transition-all text-xs font-medium"
          >
            <HiMail className="text-sm" /> Email
          </a>
        </div>

        <button
          onClick={() => onViewDetails(company)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
        >
          View Details <FiArrowRight className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
}
