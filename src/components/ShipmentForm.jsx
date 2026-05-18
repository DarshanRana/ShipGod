import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiLocationMarker, HiSearch, HiCamera, HiChevronDown,
  HiScale, HiTruck, HiX
} from 'react-icons/hi';

const machineryTypes = [
  'Excavator', 'Crawler Crane', 'Mobile Crane', 'Tower Crane',
  'CNC Machine', 'Lathe Machine', 'Press Machine', 'Generator / DG Set',
  'Transformer', '20ft Container', '40ft Container', 'Bulldozer',
  'Road Roller', 'Paver', 'Concrete Pump', 'Industrial Boiler',
  'Factory Equipment', 'Other',
];

const transportTypes = [
  'Lowboy Trailer', 'Flatbed Trailer', 'Multi-Axle Trailer',
  'Modular Trailer', 'Step-deck Trailer', 'RoRo Trailer',
  'Open Platform Trailer', 'Any Available',
];

const indianCities = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna',
  'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
  'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Aurangabad',
  'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
  'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
  'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad',
  'Mysuru', 'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Tiruppur', 'Moradabad',
  'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar',
  'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner', 'Amravati',
  'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad', 'Kochi',
  'Dehradun', 'Durgapur', 'Asansol', 'Nanded', 'Kolhapur', 'Ajmer',
  'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
  'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj', 'Mangaluru',
  'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya',
  'Udaipur', 'Maheshtala', 'Davanagere', 'Kozhikode', 'Kurnool',
  'Bokaro', 'South Dumdum', 'Thrissur', 'Rajpur Sonarpur', 'Kollam',
  'Thiruvananthapuram', 'Korba', 'Bilaspur', 'Nellore', 'Shimla',
];

const dropdownStyle = {
  background: '#0c1e3d',
  border: '1px solid rgba(249, 115, 22, 0.18)',
  boxShadow: `
    0 4px 6px -2px rgba(0,0,0,0.6),
    0 12px 32px -4px rgba(0,0,0,0.8),
    8px 16px 40px -8px rgba(0,0,0,0.7),
    0 0 0 1px rgba(255,255,255,0.04),
    inset 0 1px 0 rgba(255,255,255,0.06)
  `,
  backdropFilter: 'blur(40px)',
  WebkitBackdropFilter: 'blur(40px)',
};

/* ─── City Autocomplete ─── */
function CityAutocomplete({ label, value, onChange, id }) {
  const [query, setQuery] = useState(value || '');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  const suggestions = query.length >= 1
    ? indianCities
        .filter((c) => c.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 8)
    : indianCities.slice(0, 8);

  const handleSelect = (city) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  const handleInput = (e) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  return (
    <div className={`relative ${open ? 'z-50' : 'z-0'}`}>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="glass rounded-xl flex items-center gap-3 px-4 py-3 border border-transparent hover:border-orange-500/20 focus-within:border-orange-500/40 transition-all">
        <HiLocationMarker className="text-orange-400 text-lg shrink-0" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="City, area, or pin code"
          autoComplete="off"
          className="bg-transparent flex-1 text-sm text-white placeholder-slate-500 outline-none"
        />
        {query && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setQuery(''); onChange(''); inputRef.current?.focus(); }}
          >
            <HiX className="text-slate-500 hover:text-orange-400 text-sm transition-colors" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, skewX: -2, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, skewX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, skewX: -1, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-[9999] mt-2 w-full rounded-xl overflow-hidden max-h-56 overflow-y-auto"
            style={dropdownStyle}
          >
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }}
            />
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(city)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 border-b border-white/[0.03] last:border-b-0 hover:bg-orange-500/10 hover:text-orange-300 hover:pl-5 flex items-center gap-2 ${
                  value === city
                    ? 'text-orange-400 bg-orange-500/10 border-l-2 border-l-orange-500 pl-3'
                    : 'text-slate-300'
                }`}
              >
                <HiLocationMarker className="text-orange-400/50 text-xs shrink-0" />
                {city}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SelectField({ icon: Icon, label, value, onChange, options, id }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${open ? 'z-50' : 'z-0'}`}>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full glass rounded-xl px-4 py-3 flex items-center gap-3 text-left hover:border-orange-500/30 transition-all border border-transparent focus:outline-none focus:border-orange-500/50"
      >
        <Icon className="text-orange-400 text-lg shrink-0" />
        <span className={`flex-1 text-sm truncate ${value ? 'text-white' : 'text-slate-500'}`}>
          {value || `Select ${label}`}
        </span>
        <HiChevronDown className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, skewX: -2, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, skewX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, skewX: -1, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-[9999] mt-2 w-full rounded-xl overflow-hidden max-h-56 overflow-y-auto"
            style={{
              background: '#0c1e3d',
              border: '1px solid rgba(249, 115, 22, 0.18)',
              boxShadow: `
                0 4px 6px -2px rgba(0,0,0,0.6),
                0 12px 32px -4px rgba(0,0,0,0.8),
                8px 16px 40px -8px rgba(0,0,0,0.7),
                0 0 0 1px rgba(255,255,255,0.04),
                inset 0 1px 0 rgba(255,255,255,0.06)
              `,
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            {/* Top accent line */}
            <div
              className="h-px w-full"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.5), transparent)' }}
            />
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all duration-150 border-b border-white/[0.03] last:border-b-0 hover:bg-orange-500/10 hover:text-orange-300 hover:pl-5 ${
                  value === opt
                    ? 'text-orange-400 bg-orange-500/10 border-l-2 border-l-orange-500 pl-3'
                    : 'text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputField({ icon: Icon, label, placeholder, value, onChange, id }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>
      <div className="glass rounded-xl flex items-center gap-3 px-4 py-3 border border-transparent hover:border-orange-500/20 focus-within:border-orange-500/40 transition-all">
        <Icon className="text-orange-400 text-lg shrink-0" />
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent flex-1 text-sm text-white placeholder-slate-500 outline-none"
        />
      </div>
    </div>
  );
}

export default function ShipmentForm({ onSubmit, compact = false }) {
  const [form, setForm] = useState({
    pickup: '', drop: '', machinery: '', weight: '',
    transport: '', imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState('');
  const fileRef = useRef();

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageFile: file }));
      setImageName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.pickup || !form.drop) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSubmit && onSubmit(form);
    }, 1800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`glass-strong rounded-2xl border border-white/10 shadow-2xl shadow-black/50 ${
        compact ? 'p-6' : 'p-8'
      }`}
    >
      {!compact && (
        <h2 className="text-2xl font-bold text-white mb-2">Get Transport Quotes</h2>
      )}
      {!compact && (
        <p className="text-slate-400 text-sm mb-6">
          Fill in your shipment details to instantly match with verified carriers.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <CityAutocomplete
          id="pickup-location"
          label="Pickup Location"
          value={form.pickup}
          onChange={set('pickup')}
        />
        <CityAutocomplete
          id="drop-location"
          label="Drop Location"
          value={form.drop}
          onChange={set('drop')}
        />
        <SelectField
          id="machinery-type"
          icon={HiTruck}
          label="Machinery Type"
          value={form.machinery}
          onChange={set('machinery')}
          options={machineryTypes}
        />
        <InputField
          id="machinery-weight"
          icon={HiScale}
          label="Weight (Tons)"
          placeholder="e.g. 25"
          value={form.weight}
          onChange={set('weight')}
        />
        <SelectField
          id="transport-type"
          icon={HiTruck}
          label="Transport Type"
          value={form.transport}
          onChange={set('transport')}
          options={transportTypes}
        />

        {/* Image Upload */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Equipment Photo (Optional)
          </label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full glass rounded-xl px-4 py-3 flex items-center gap-3 border border-dashed border-white/15 hover:border-orange-500/30 transition-all"
          >
            <HiCamera className="text-orange-400 text-lg shrink-0" />
            <span className="flex-1 text-sm text-slate-500 text-left truncate">
              {imageName || 'Upload equipment photo'}
            </span>
            {imageName && (
              <button type="button" onClick={(e) => { e.stopPropagation(); setImageName(''); set('imageFile')(null); }}>
                <HiX className="text-slate-500 hover:text-red-400" />
              </button>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !form.pickup || !form.drop}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full btn-primary py-4 text-base rounded-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
      >
        {loading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
            />
            Searching Carriers…
          </>
        ) : (
          <>
            <HiSearch className="text-xl" />
            Find Heavy Transport Companies
          </>
        )}
      </motion.button>
    </form>
  );
}
