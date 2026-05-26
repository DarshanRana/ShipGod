import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiTruck, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validateName } from '../utils/validators';

export default function SignUp({ onSuccess, onGoSignIn }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    let result = { valid: true, message: '' };
    switch (field) {
      case 'name':
        result = validateName(value);
        break;
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        if (value && value.length < 6) result = { valid: false, message: 'Password must be at least 6 characters' };
        break;
      case 'confirmPassword':
        if (value && value !== password) result = { valid: false, message: 'Passwords do not match' };
        break;
      default:
        break;
    }
    setFieldErrors(prev => ({ ...prev, [field]: result.valid ? '' : result.message }));
    return result.valid;
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const nameValid = validateField('name', name);
    const emailValid = validateField('email', email);
    const passValid = validateField('password', password);
    const confirmValid = validateField('confirmPassword', confirmPassword);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    if (!nameValid || !emailValid || !passValid || !confirmValid) {
      setError('Please fix the errors above');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password);
      setDone(true);
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: 'var(--bg-page)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <HiCheckCircle className="text-[#0fa14a] text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Account Created!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Welcome to ShipGod, {name}!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10"
      style={{ backgroundColor: 'var(--bg-page)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[#0fa14a] flex items-center justify-center">
              <HiTruck className="text-white text-xl" />
            </div>
            <span className="text-2xl font-extrabold">
              <span style={{ color: 'var(--text-primary)' }}>Ship</span>
              <span className="text-[#0fa14a]">God</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold mb-1" style={{ color: 'var(--text-primary)' }}>
            Create your account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Join thousands of businesses on ShipGod
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border shadow-sm"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Full Name
              </label>
              <div className="relative">
                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); if (touched.name) validateField('name', e.target.value); }}
                  onBlur={() => handleBlur('name', name)}
                  required
                  placeholder="Darshan Rana"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderColor: touched.name && fieldErrors.name ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              {touched.name && fieldErrors.name && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.name}</motion.p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Email
              </label>
              <div className="relative">
                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (touched.email) validateField('email', e.target.value); }}
                  onBlur={() => handleBlur('email', email)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderColor: touched.email && fieldErrors.email ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              {touched.email && fieldErrors.email && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.email}</motion.p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (touched.password) validateField('password', e.target.value); }}
                  onBlur={() => handleBlur('password', password)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-11 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderColor: touched.password && fieldErrors.password ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
              {touched.password && fieldErrors.password && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.password}</motion.p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Confirm Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); if (touched.confirmPassword) validateField('confirmPassword', e.target.value); }}
                  onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                  required
                  placeholder="Repeat password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderColor: touched.confirmPassword && fieldErrors.confirmPassword ? '#ef4444' : 'var(--border-color)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.confirmPassword}</motion.p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#0fa14a] hover:bg-[#0d8a3f] text-white font-bold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating account…
                </>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <button
              onClick={onGoSignIn}
              className="text-[#0077c8] font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
