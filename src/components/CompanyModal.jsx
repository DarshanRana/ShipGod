import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiPhone, HiMail, HiGlobe, HiStar, HiShieldCheck, HiTruck, HiLocationMarker, HiBadgeCheck } from 'react-icons/hi';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-slate-600'}`} />
      ))}
    </div>
  );
}

function FleetCard({ item, color }) {
  return (
    <div className="glass rounded-xl p-4 flex flex-col items-center gap-2 text-center">
      <div className="text-3xl">🚛</div>
      <div className="text-sm font-semibold text-white">{item.type}</div>
      <div className="text-xs text-slate-400">Up to {item.capacity}</div>
      <div
        className="px-2 py-0.5 rounded-full text-xs font-medium"
        style={{ background: color + '20', color }}
      >
        ×{item.count} units
      </div>
    </div>
  );
}

export default function CompanyModal({ company, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-[#0f2044] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div
          className="relative p-8 pb-6"
          style={{
            background: `linear-gradient(135deg, ${company.logoColor}25 0%, transparent 60%),
                         linear-gradient(180deg, #0f2044 0%, transparent 100%)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-500/30 transition-all border border-white/10"
          >
            <HiX />
          </button>

          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}99)` }}
            >
              {company.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-white">{company.name}</h2>
                {company.verified && <HiBadgeCheck className="text-blue-400 text-xl" />}
              </div>
              <div className="flex items-start gap-1 text-slate-400 text-sm mb-2 max-w-sm">
                <HiLocationMarker className="text-orange-400 shrink-0 mt-0.5" />
                <span>{company.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={company.rating} />
                <span className="text-white font-bold">{company.rating}</span>
                <span className="text-slate-400 text-sm">({company.reviewCount} reviews)</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  company.availableNow
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                }`}>
                  {company.availableNow ? '● Available' : '● Busy'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Description */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Company Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{company.description}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/8">
              <div className="text-center">
                <div className="text-xl font-bold gradient-text">{company.founded}</div>
                <div className="text-xs text-slate-400">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold gradient-text">{company.fleetSize}+</div>
                <div className="text-xs text-slate-400">Fleet Size</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold gradient-text">{company.maxCapacity}</div>
                <div className="text-xs text-slate-400">Max Capacity</div>
              </div>
            </div>
          </div>

          {/* Fleet */}
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Fleet Overview</h3>
            <div className="grid grid-cols-3 gap-3">
              {company.fleetImages.map((item) => (
                <FleetCard key={item.type} item={item} color={company.logoColor} />
              ))}
            </div>
          </div>

          {/* Specialties & Highlights */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {company.specialties.map((s) => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-300 border border-white/8">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Highlights</h3>
              <ul className="space-y-1.5">
                {company.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-orange-400 mt-0.5 shrink-0">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service Locations */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Service Locations</h3>
            <div className="flex flex-wrap gap-2">
              {company.serviceLocations.map((loc) => (
                <span key={loc} className="flex items-center gap-1 px-3 py-1 glass rounded-full text-xs text-slate-300">
                  <HiLocationMarker className="text-orange-400 text-xs" />
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="glass rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {company.certifications.map((cert) => (
                <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  <HiShieldCheck className="text-blue-400" />
                  {cert}
                </span>
              ))}
            </div>
          </div>



          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`tel:${company.phone}`}
              className="flex items-center justify-center gap-2 btn-primary py-3 rounded-xl text-sm"
            >
              <HiPhone /> {company.phone}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${company.email}`}
              className="flex items-center justify-center gap-2 btn-secondary py-3 rounded-xl text-sm"
            >
              <HiMail /> Email
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href={`https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 btn-secondary py-3 rounded-xl text-sm"
            >
              <HiGlobe /> Website
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
