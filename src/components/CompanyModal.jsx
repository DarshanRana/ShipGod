import { motion } from 'framer-motion';
import { HiX, HiPhone, HiMail, HiGlobe, HiStar, HiShieldCheck, HiTruck, HiLocationMarker, HiBadgeCheck } from 'react-icons/hi';

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HiStar key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
      ))}
    </div>
  );
}

function FleetCard({ item, color }) {
  return (
    <div className="bg-[#f5f6f7] rounded-xl p-4 flex flex-col items-center gap-2 text-center border border-gray-100">
      <div className="text-3xl">🚛</div>
      <div className="text-sm font-bold text-[#002f56]">{item.type}</div>
      <div className="text-xs text-slate-500">Up to {item.capacity}</div>
      <div
        className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide"
        style={{ background: color + '18', color }}
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
      <div className="absolute inset-0 bg-[#002f56]/50 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
      >
        {/* Header */}
        <div
          className="relative p-8 pb-6 rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${company.logoColor}12 0%, transparent 60%), #f5f6f7`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 bg-white rounded-lg flex items-center justify-center text-slate-400 hover:text-[#002f56] border border-gray-200 hover:border-gray-300 transition-all shadow-sm"
          >
            <HiX />
          </button>

          <div className="flex items-start gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shrink-0"
              style={{ background: `linear-gradient(135deg, ${company.logoColor}, ${company.logoColor}aa)` }}
            >
              {company.logo}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-[#002f56]">{company.name}</h2>
                {company.verified && <HiBadgeCheck className="text-[#0077c8] text-xl" />}
              </div>
              <div className="flex items-start gap-1 text-slate-500 text-sm mb-3 max-w-sm">
                <HiLocationMarker className="text-[#0077c8] shrink-0 mt-0.5" />
                <span>{company.address}</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={company.rating} />
                <span className="text-[#002f56] font-bold">{company.rating}</span>
                <span className="text-slate-400 text-sm">({company.reviewCount} reviews)</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  company.availableNow
                    ? 'bg-[#0fa14a]/10 text-[#0fa14a] border border-[#0fa14a]/20'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {company.availableNow ? '● Available' : '● Busy'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 pb-8 space-y-6">
          {/* Description */}
          <div className="bg-[#f5f6f7] rounded-xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-[#002f56] uppercase tracking-widest mb-3">Company Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{company.description}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-xl font-extrabold text-[#0077c8]">{company.founded}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Founded</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-[#0077c8]">{company.fleetSize}+</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Fleet Size</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-[#0077c8]">{company.maxCapacity}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">Max Capacity</div>
              </div>
            </div>
          </div>

          {/* Fleet */}
          <div>
            <h3 className="text-xs font-bold text-[#002f56] uppercase tracking-widest mb-3">Fleet Overview</h3>
            <div className="grid grid-cols-3 gap-3">
              {company.fleetImages.map(item => (
                <FleetCard key={item.type} item={item} color={company.logoColor} />
              ))}
            </div>
          </div>

          {/* Specialties & Highlights */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-[#f5f6f7] rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold text-[#002f56] uppercase tracking-widest mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {company.specialties.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0077c8] border border-blue-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-[#f5f6f7] rounded-xl p-5 border border-gray-100">
              <h3 className="text-xs font-bold text-[#002f56] uppercase tracking-widest mb-3">Key Highlights</h3>
              <ul className="space-y-1.5">
                {company.highlights.map(h => (
                  <li key={h} className="flex items-start gap-2 text-slate-600 text-sm">
                    <span className="text-[#0fa14a] mt-0.5 shrink-0 font-bold">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Service Locations */}
          <div className="bg-[#f5f6f7] rounded-xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-[#002f56] uppercase tracking-widest mb-3">Service Locations</h3>
            <div className="flex flex-wrap gap-2">
              {company.serviceLocations.map(loc => (
                <span key={loc} className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs text-slate-600 font-medium shadow-sm">
                  <HiLocationMarker className="text-[#0077c8] text-xs" />
                  {loc}
                </span>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-[#f5f6f7] rounded-xl p-5 border border-gray-100">
            <h3 className="text-xs font-bold text-[#002f56] uppercase tracking-widest mb-3">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {company.certifications.map(cert => (
                <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-[#0077c8] border border-blue-100">
                  <HiShieldCheck className="text-[#0077c8]" />
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={`tel:${company.phone}`}
              className="flex items-center justify-center gap-2 bg-[#0fa14a] hover:bg-[#0d8a3f] text-white font-bold py-3 rounded-xl text-sm transition-colors"
            >
              <HiPhone /> {company.phone}
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={`mailto:${company.email}`}
              className="flex items-center justify-center gap-2 bg-[#f5f6f7] hover:bg-gray-200 text-[#002f56] font-bold border border-gray-200 py-3 rounded-xl text-sm transition-colors"
            >
              <HiMail /> Email
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              href={`https://${company.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#f5f6f7] hover:bg-gray-200 text-[#002f56] font-bold border border-gray-200 py-3 rounded-xl text-sm transition-colors"
            >
              <HiGlobe /> Website
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
