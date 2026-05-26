import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiX, HiTruck, HiLocationMarker, HiPhone, HiMail,
  HiUser, HiOfficeBuilding, HiScale, HiCheckCircle, HiClock
} from 'react-icons/hi';
import { validateEmail, validatePhone, validateName } from '../utils/validators';

const equipmentTypes = [
  'Hydraulic Modular Trailer (SPMT)',
  'Transformer / Reactor',
  'Industrial Boiler',
  'Crawler / Mobile Crane',
  'Excavator / Dozer',
  'CNC / Heavy Machine',
  'Pressure Vessel / Column',
  'Generator / DG Set',
  'Offshore Module',
  'Other Heavy Equipment',
];

const timelines = [
  'Within 1 week',
  'Within 2 weeks',
  'Within 1 month',
  '1–3 months',
  'Flexible / Planning stage',
];

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${API_BASE}/api/bulk-orders`;

export default function BulkOrderModal({ onClose }) {
  const [step, setStep] = useState(1); // 1: customer info, 2: shipment info, 3: success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    fromCity: '', toCity: '', equipmentType: '', weightTons: '',
    timeline: '', notes: '',
  });

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm(f => ({ ...f, [field]: value }));
    // Real-time validation if already touched
    if (touched[field]) {
      validateField(field, value);
    }
  };

  const validateField = (field, value) => {
    let result = { valid: true, message: '' };
    switch (field) {
      case 'name':
        result = validateName(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'phone':
        result = validatePhone(value);
        break;
      case 'weightTons':
        if (!value || value === '') result = { valid: false, message: 'Weight is required' };
        else if (Number(value) < 500) result = { valid: false, message: 'Minimum weight is 500 tons for bulk shipments' };
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [field]: result.valid ? '' : result.message }));
    return result.valid;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, form[field]);
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError('');

    // Validate all Step 1 fields
    const nameValid = validateField('name', form.name);
    const emailValid = validateField('email', form.email);
    const phoneValid = validateField('phone', form.phone);
    setTouched(prev => ({ ...prev, name: true, email: true, phone: true }));

    if (!nameValid || !emailValid || !phoneValid) {
      setError('Please fix the errors above');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate weight
    const weightValid = validateField('weightTons', form.weightTons);
    setTouched(prev => ({ ...prev, weightTons: true }));

    if (!weightValid) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, weightTons: Number(form.weightTons) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10`;
  const inputStyle = {
    backgroundColor: 'var(--bg-page)',
    borderColor: 'var(--border-color)',
    color: 'var(--text-primary)',
  };

  const getInputStyle = (field) => ({
    ...inputStyle,
    borderColor: touched[field] && fieldErrors[field] ? '#ef4444' : 'var(--border-color)',
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl"
          style={{ backgroundColor: 'var(--bg-surface)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#002f56] px-8 py-6 relative">
            <button onClick={onClose} className="absolute top-5 right-5 text-white/60 hover:text-white transition-colors">
              <HiX className="text-xl" />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0fa14a] flex items-center justify-center">
                <HiTruck className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-white font-extrabold text-xl">Expert Bulk Shipment Request</h2>
                <p className="text-blue-200/70 text-sm">For shipments of 500+ tons — personal guidance guaranteed</p>
              </div>
            </div>
            {/* Step indicator */}
            {step < 3 && (
              <div className="flex items-center gap-2 mt-4">
                {[1, 2].map(s => (
                  <div key={s} className={`h-1.5 rounded-full flex-1 transition-all ${s <= step ? 'bg-[#0fa14a]' : 'bg-white/20'}`} />
                ))}
                <span className="text-blue-200/70 text-xs ml-2">Step {step} of 2</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <HiCheckCircle className="text-[#0fa14a] text-6xl mx-auto mb-4" />
                <h3 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Request Submitted!</h3>
                <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Thank you, <strong>{form.name}</strong>! We've received your request.
                </p>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                  Our expert team will contact you at <strong>{form.phone}</strong> within 24 hours.
                  A confirmation email has been sent to <strong>{form.email}</strong>.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 px-8 py-3 rounded-xl bg-[#0fa14a] text-white font-bold hover:bg-[#0d8a3f] transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}

            {/* Step 1: Customer Info */}
            {step === 1 && (
              <form onSubmit={handleNext} className="space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-medium">
                    {error}
                  </motion.div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className={`${inputClass} pl-10`} style={getInputStyle('name')} value={form.name} onChange={set('name')} onBlur={() => handleBlur('name')} placeholder="Your full name" required />
                    </div>
                    {touched.name && fieldErrors.name && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.name}</motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Company Name
                    </label>
                    <div className="relative">
                      <HiOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className={`${inputClass} pl-10`} style={inputStyle} value={form.company} onChange={set('company')} placeholder="Optional" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Phone Number *
                    </label>
                    <div className="relative">
                      <HiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input className={`${inputClass} pl-10`} style={getInputStyle('phone')} value={form.phone} onChange={set('phone')} onBlur={() => handleBlur('phone')} placeholder="+91 98765 43210" required />
                    </div>
                    {touched.phone && fieldErrors.phone && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.phone}</motion.p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Email Address *
                    </label>
                    <div className="relative">
                      <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="email" className={`${inputClass} pl-10`} style={getInputStyle('email')} value={form.email} onChange={set('email')} onBlur={() => handleBlur('email')} placeholder="you@company.com" required />
                    </div>
                    {touched.email && fieldErrors.email && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.email}</motion.p>
                    )}
                  </div>
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-[#002f56] hover:bg-[#003d70] text-white font-bold transition-colors mt-2">
                  Next: Shipment Details →
                </button>
              </form>
            )}

            {/* Step 2: Shipment Info */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-medium">
                    {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>From City *</label>
                    <div className="relative">
                      <HiLocationMarker className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0077c8]" />
                      <input className={`${inputClass} pl-10`} style={inputStyle} value={form.fromCity} onChange={set('fromCity')} placeholder="e.g. Mumbai" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>To City *</label>
                    <div className="relative">
                      <HiLocationMarker className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0fa14a]" />
                      <input className={`${inputClass} pl-10`} style={inputStyle} value={form.toCity} onChange={set('toCity')} placeholder="e.g. Chennai" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Equipment Type *</label>
                    <select className={inputClass} style={inputStyle} value={form.equipmentType} onChange={set('equipmentType')} required>
                      <option value="">Select equipment type</option>
                      {equipmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      Weight (Tons) * <span className="text-[#0fa14a] text-xs">min. 500 tons</span>
                    </label>
                    <div className="relative">
                      <HiScale className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="number" min="500" className={`${inputClass} pl-10`} style={getInputStyle('weightTons')} value={form.weightTons} onChange={set('weightTons')} onBlur={() => handleBlur('weightTons')} placeholder="e.g. 750" required />
                    </div>
                    {touched.weightTons && fieldErrors.weightTons && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.weightTons}</motion.p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Preferred Timeline *</label>
                    <div className="relative">
                      <HiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select className={`${inputClass} pl-10`} style={inputStyle} value={form.timeline} onChange={set('timeline')} required>
                        <option value="">Select timeline</option>
                        {timelines.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>Special Requirements / Notes</label>
                    <textarea
                      rows={3}
                      className={inputClass}
                      style={{ ...inputStyle, resize: 'none' }}
                      value={form.notes}
                      onChange={set('notes')}
                      placeholder="Any special handling requirements, route restrictions, dimensions, etc."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3 rounded-xl border-2 font-bold transition-colors hover:bg-slate-50"
                    style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                    ← Back
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-[2] py-3 rounded-xl bg-[#0fa14a] hover:bg-[#0d8a3f] text-white font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Submitting…
                      </>
                    ) : '🚚 Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
