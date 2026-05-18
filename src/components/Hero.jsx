import { motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { HiLocationMarker, HiSearch, HiX, HiChevronDown, HiShieldCheck, HiLightningBolt, HiClock } from 'react-icons/hi';
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

const dropdownStyle = {
  background: '#0c1e3d',
  border: '1px solid rgba(249,115,22,0.2)',
  boxShadow: '0 12px 48px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
  backdropFilter: 'blur(40px)',
};

function CityInput({ placeholder, value, onChange }) {
  const [open, setOpen] = useState(false);
  const suggestions = value.length >= 1
    ? indianCities.filter(c => c.toLowerCase().startsWith(value.toLowerCase())).slice(0, 7)
    : indianCities.slice(0, 7);

  return (
    <div className="relative flex-1 min-w-0">
      <div className="flex items-center gap-2 px-4 py-3.5">
        <HiLocationMarker className="text-orange-400 text-base shrink-0" />
        <input
          type="text"
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder}
          className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
          autoComplete="off"
        />
        {value && (
          <button type="button" onMouseDown={e => e.preventDefault()} onClick={() => onChange('')}>
            <HiX className="text-slate-500 hover:text-orange-400 text-xs" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 w-full rounded-xl overflow-hidden z-[9999] mt-1"
            style={dropdownStyle}
          >
            <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.5),transparent)' }} />
            {suggestions.map(city => (
              <button key={city} type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onChange(city); setOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-orange-500/10 hover:text-orange-300 flex items-center gap-2 border-b border-white/[0.03] last:border-0 transition-all"
              >
                <HiLocationMarker className="text-orange-400/50 text-xs shrink-0" /> {city}
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
        className="w-full flex items-center gap-2 px-4 py-3.5 text-sm text-left"
      >
        <HiSearch className="text-orange-400 text-base shrink-0" />
        <span className={`flex-1 truncate ${value ? 'text-white' : 'text-slate-500'}`}>
          {value || 'Equipment Type'}
        </span>
        <HiChevronDown className={`text-slate-400 text-sm transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full left-0 w-full rounded-xl overflow-hidden z-[9999] mt-1 max-h-56 overflow-y-auto"
            style={dropdownStyle}
          >
            <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(249,115,22,0.5),transparent)' }} />
            {machineryTypes.map(type => (
              <button key={type} type="button"
                onClick={() => { onChange(type); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-white/[0.03] last:border-0 transition-all hover:bg-orange-500/10 hover:text-orange-300 ${value === type ? 'text-orange-400 bg-orange-500/10' : 'text-slate-300'}`}
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

// Floating particles
function Particle({ style }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={style}
      animate={{ y: [0, -30, 0], x: [0, 10, -8, 0], opacity: [0.08, 0.2, 0.08] }}
      transition={{ duration: Math.random() * 6 + 7, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 4 }}
    />
  );
}

const particles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  style: {
    width: Math.random() * 5 + 3 + 'px',
    height: Math.random() * 5 + 3 + 'px',
    left: Math.random() * 60 + '%',
    top: Math.random() * 100 + '%',
    background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#3b82f6' : '#eab308',
  },
}));

const trustPills = [
  { icon: HiShieldCheck, text: 'Verified Carriers Only' },
  { icon: HiLightningBolt, text: 'Quotes in 2 Minutes' },
  { icon: HiClock, text: '24/7 Support' },
];

export default function Hero({ onSearchSubmit }) {
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
    }, 1400);
  };

  return (
    <section className="relative z-10 min-h-screen flex items-center hero-gradient noise-overlay">
      {/* Decorative bg layer — overflow-hidden here only, NOT on the section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Particles */}
        {particles.map(p => <Particle key={p.id} style={p.style} />)}

        {/* Glow blobs */}
        <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full opacity-[0.1]"
          style={{ background: 'radial-gradient(circle, #1e4fa0 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ─── LEFT COLUMN ─── */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm font-medium text-orange-300 border border-orange-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              India's #1 Heavy Machinery Transport Platform
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.12 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-5"
            >
              <span className="text-white">Ship Any Heavy</span>
              <br />
              <span className="gradient-text">Equipment, Anywhere</span>
              <br />
              <span className="text-white text-3xl md:text-4xl font-bold">in India.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-slate-400 text-base md:text-lg max-w-xl mb-8 leading-relaxed"
            >
              Connect with 2,400+ verified heavy haulage carriers instantly.
              Compare quotes, book securely, and track your shipment in real-time.
            </motion.p>

            {/* ── Inline Search Bar ── */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.38 }}
              className="relative mb-5"
            >
              <div
                className="flex flex-col sm:flex-row items-stretch rounded-2xl overflow-visible border border-white/10 shadow-2xl shadow-black/50"
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)' }}
              >
                {/* From */}
                <CityInput placeholder="From (city)" value={from} onChange={setFrom} />

                {/* Divider */}
                <div className="hidden sm:block w-px bg-white/8 my-2 shrink-0" />
                <div className="sm:hidden h-px bg-white/8 mx-4 shrink-0" />

                {/* To */}
                <CityInput placeholder="To (city)" value={to} onChange={setTo} />

                {/* Divider */}
                <div className="hidden sm:block w-px bg-white/8 my-2 shrink-0" />
                <div className="sm:hidden h-px bg-white/8 mx-4 shrink-0" />

                {/* Equipment */}
                <CategorySelect value={equipment} onChange={setEquipment} />

                {/* Search Button */}
                <div className="p-2 shrink-0">
                  <motion.button
                    type="submit"
                    disabled={loading || !from || !to}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="btn-primary h-full min-h-[44px] px-6 rounded-xl flex items-center gap-2 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {loading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <HiSearch className="text-lg" />
                    )}
                    {loading ? 'Searching…' : 'Find Carriers'}
                  </motion.button>
                </div>
              </div>
            </motion.form>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-3"
            >
              {trustPills.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Icon className="text-orange-400 text-sm" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─── RIGHT COLUMN — Hero Image ─── */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
            className="hidden lg:block relative"
          >
            {/* Image container with glow frame */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl"
              style={{
                boxShadow: '0 0 0 1px rgba(249,115,22,0.15), 0 32px 80px rgba(0,0,0,0.7), 0 0 80px rgba(249,115,22,0.08)',
              }}
            >
              <img
                src="/hero_truck.png"
                alt="Heavy transport truck carrying industrial excavator at golden hour"
                className="w-full h-auto object-cover rounded-3xl"
                style={{ maxHeight: '480px', objectPosition: 'center' }}
              />
              {/* Overlay gradient to blend with dark bg */}
              <div className="absolute inset-0 rounded-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(10,22,40,0.3) 0%, transparent 50%, rgba(10,22,40,0.5) 100%)' }} />
            </div>

            {/* Floating badge — Available Now */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 glass-strong rounded-2xl px-4 py-3 border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">340 carriers available now</span>
              </div>
            </motion.div>

            {/* Floating badge — Rating */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -top-4 -right-4 glass-strong rounded-2xl px-4 py-3 border border-white/10 shadow-xl"
            >
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-sm">⭐</span>
                <span className="text-xs font-semibold text-white">4.9 · 3,200+ Reviews</span>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
