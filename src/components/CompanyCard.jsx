import { motion } from 'framer-motion';
import {
  HiStar, HiPhone, HiShieldCheck, HiLocationMarker,
  HiTruck, HiScale, HiBadgeCheck, HiMail
} from 'react-icons/hi';
import { FiArrowRight } from 'react-icons/fi';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

export default function CompanyCard({ company, index, onViewDetails }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-[#0077c8] hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0"
            style={{ background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}aa)` }}
          >
            {company.logo}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-[#002f56] text-base leading-tight">{company.name}</h3>
              {company.verified && <HiBadgeCheck className="text-[#0077c8] text-base shrink-0" title="Verified" />}
            </div>
            <div className="flex items-start gap-1 text-slate-500 text-xs mt-0.5 max-w-xs">
              <HiLocationMarker className="text-[#0077c8] text-xs mt-0.5 shrink-0" />
              <span className="line-clamp-2">{company.address}</span>
            </div>
          </div>
        </div>

        {/* Availability badge */}
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide shrink-0 ${
          company.availableNow
            ? 'bg-[#0fa14a]/10 text-[#0fa14a] border border-[#0fa14a]/20'
            : 'bg-slate-100 text-slate-500 border border-slate-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${company.availableNow ? 'bg-[#0fa14a] animate-pulse' : 'bg-slate-400'}`} />
          {company.availableNow ? 'Open' : 'Busy'}
        </div>
      </div>

      {/* Rating & Fleet */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StarRating rating={company.rating} />
          <span className="text-[#002f56] font-bold text-sm">{company.rating}</span>
          <span className="text-slate-400 text-xs">({company.reviewCount} reviews)</span>
        </div>
        <div className="text-xs text-slate-500">
          Fleet: <span className="text-[#002f56] font-semibold">{company.fleetSize}+</span> vehicles
        </div>
      </div>

      {/* Trailer & Capacity */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#f5f6f7] rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <HiTruck className="text-[#0077c8] text-xs" />
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Trailer</span>
          </div>
          <span className="text-sm text-[#002f56] font-semibold">{company.trailerType}</span>
        </div>
        <div className="bg-[#f5f6f7] rounded-lg p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <HiScale className="text-[#0077c8] text-xs" />
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Max Load</span>
          </div>
          <span className="text-sm text-[#002f56] font-semibold">{company.maxCapacity}</span>
        </div>
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {company.specialties.slice(0, 3).map(s => (
          <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-[#0077c8] border border-blue-100">
            {s}
          </span>
        ))}
      </div>

      {/* Contact row */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <a
            href={`tel:${company.phone}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#f5f6f7] rounded-lg border border-gray-200 hover:border-[#0077c8] hover:text-[#0077c8] text-slate-600 transition-all text-xs font-semibold"
          >
            <HiPhone className="text-sm" /> Call
          </a>
          <a
            href={`mailto:${company.email}`}
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#f5f6f7] rounded-lg border border-gray-200 hover:border-blue-400 hover:text-[#0077c8] text-slate-600 transition-all text-xs font-semibold"
          >
            <HiMail className="text-sm" /> Email
          </a>
        </div>

        <button
          onClick={() => onViewDetails(company)}
          className="flex items-center gap-2 bg-[#0fa14a] hover:bg-[#0d8a3f] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
        >
          View Details <FiArrowRight className="text-sm" />
        </button>
      </div>
    </motion.div>
  );
}
