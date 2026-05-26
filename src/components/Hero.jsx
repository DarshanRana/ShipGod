import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiLocationMarker, HiSearch, HiX, HiChevronDown, HiShieldCheck, HiStar, HiTruck } from 'react-icons/hi';
import { AnimatePresence } from 'framer-motion';

const machineryTypes = [
  'Any Equipment', 'Excavator', 'Crawler Crane', 'Mobile Crane', 'Tower Crane',
  'CNC Machine', 'Generator / DG Set', 'Transformer', '20ft Container',
  '40ft Container', 'Bulldozer', 'Road Roller', 'Industrial Boiler', 'Other',
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Bhopal', 'Visakhapatnam', 'Vadodara', 'Noida', 'Gurgaon',
  'Kochi', 'Coimbatore', 'Chandigarh', 'Bhubaneswar', 'Guwahati',
];

function CityInput({ placeholder, value, onChange, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const suggestions = value.length >= 1
    ? indianCities.filter(c => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 7)
    : indianCities.slice(0, 7);

  return (
    <div className="relative flex-1 min-w-0">
      <div className="flex items-center gap-2 px-4 py-4">
        <Icon className="text-[#0077c8] text-base shrink-0" />
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="bg-transparent text-sm placeholder-slate-400 outline-none w-full font-medium"
          style={{ color: 'var(--text-primary)' }}
          autoComplete="off"
        />
        {value && (
          <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => onChange('')}>
            <HiX className="text-slate-400 hover:text-slate-600 text-xs" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full rounded-lg shadow-lg z-[9999] mt-1 overflow-hidden border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            {suggestions.map(city => (
              <button key={city} type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onChange(city); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 border-b last:border-0 transition-colors hover:bg-blue-50 hover:text-[#0077c8]"
                style={{ color: 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
              >
                <HiLocationMarker className="text-[#0077c8]/50 text-xs shrink-0" /> {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategorySelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex-1 min-w-0">
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-4 text-sm text-left"
      >
        <HiTruck className="text-[#0077c8] text-base shrink-0" />
        <span className={`flex-1 truncate font-medium ${value ? 'text-slate-800' : 'text-slate-400'}`}>
          {value || 'Equipment Type'}
        </span>
        <HiChevronDown className={`text-slate-400 text-sm transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full rounded-lg shadow-lg z-[9999] mt-1 max-h-56 overflow-y-auto border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            {machineryTypes.map(type => (
              <button key={type} type="button"
                onClick={() => { onChange(type); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm border-b last:border-0 transition-colors hover:bg-blue-50 hover:text-[#0077c8] ${value === type ? 'text-[#0077c8] bg-blue-50 font-semibold' : ''}`}
                style={{ color: value === type ? undefined : 'var(--text-secondary)', borderColor: 'var(--border-color)' }}
              >
                {type}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const stats = [
  { value: '2,400+', label: 'Verified Carriers' },
  { value: '98%', label: 'On-Time Delivery' },
  { value: '15,000+', label: 'Loads Shipped' },
  { value: '4.9★', label: 'Avg. Rating' },
];

export default function Hero({ onSearchSubmit, onBulkOrder }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [equipment, setEquipment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!from || !to) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSearchSubmit && onSearchSubmit({ pickup: from, drop: to, machinery: equipment });
    }, 1200);
  };

  return (
    <section className="relative bg-[#002f56] pt-24">
      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0fa14a]/20 border border-[#0fa14a]/40 text-[#4ade80] text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0fa14a] animate-pulse" />
            India's #1 Heavy Machinery Transport Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5"
          >
            The Smarter Way to Ship{' '}
            <span className="text-[#0fa14a]">Heavy Equipment</span>{' '}
            Across India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-100/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Connect with 2,400+ verified carriers. Get competitive quotes, book securely, and track your shipment in real-time.
          </motion.p>

          {/* ─── Search Card ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="rounded-2xl shadow-2xl p-2 max-w-4xl mx-auto border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row items-stretch gap-0">
                {/* From */}
                <div className="flex-1 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#002f56] px-4 pt-3 pb-0.5">From</p>
                  <CityInput placeholder="Pickup city" value={from} onChange={setFrom} icon={HiLocationMarker} />
                </div>

                {/* To */}
                <div className="flex-1 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#002f56] px-4 pt-3 pb-0.5">To</p>
                  <CityInput placeholder="Destination city" value={to} onChange={setTo} icon={HiLocationMarker} />
                </div>

                {/* Equipment */}
                <div className="flex-1 border-b md:border-b-0 md:border-r" style={{ borderColor: 'var(--border-color)' }}>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#002f56] px-4 pt-3 pb-0.5">What</p>
                  <CategorySelect value={equipment} onChange={setEquipment} />
                </div>

                {/* Submit */}
                <div className="flex items-center justify-center p-2 shrink-0">
                  <button
                    type="submit"
                    disabled={loading || !from || !to}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0fa14a] hover:bg-[#0d8a3f] text-white font-bold px-8 py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <HiSearch className="text-base" />
                    )}
                    {loading ? 'Searching…' : 'Get Free Quotes'}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Bulk Order CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5 flex items-center justify-center gap-3 flex-wrap"
          >
            <div className="flex items-center gap-2 text-blue-200/60 text-sm">
              <span>Need 500+ tons shipped?</span>
            </div>
            <button
              onClick={onBulkOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-white font-bold text-sm transition-all"
            >
              🚛 Request Expert Guidance
            </button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-1.5 text-blue-100/70 text-sm">
              <HiShieldCheck className="text-[#0fa14a] text-base" />
              <span>All carriers verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-blue-100/70 text-sm">
              <HiStar className="text-yellow-400 text-base" />
              <span>4.9/5 customer rating</span>
            </div>
            <div className="text-blue-100/70 text-sm">
              📦 <span>15,000+ successful shipments</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-[#001f3d] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-blue-200/60 text-xs font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
