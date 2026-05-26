import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiTruck, HiCheckCircle } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';

export default function SignIn({ onSuccess, onGoSignUp, onGoForgotPassword }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (field, value) => {
    let result = { valid: true, message: '' };
    switch (field) {
      case 'email':
        result = validateEmail(value);
        break;
      case 'password':
        if (!value) result = { valid: false, message: 'Password is required' };
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
    const emailValid = validateField('email', email);
    const passValid = validateField('password', password);
    setTouched({ email: true, password: true });

    if (!emailValid || !passValid) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      setDone(true);
      setTimeout(() => onSuccess(), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: 'var(--bg-page)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <HiCheckCircle className="text-[#0fa14a] text-6xl mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>Welcome Back!</h2>
          <p style={{ color: 'var(--text-muted)' }}>Signing you in securely...</p>
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
            Sign in to your account
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border shadow-sm"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                Email Address
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
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={onGoForgotPassword}
                  className="text-xs font-bold text-[#0077c8] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); if (touched.password) validateField('password', e.target.value); }}
                  onBlur={() => handleBlur('password', password)}
                  required
                  placeholder="••••••••"
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
                  Signing in…
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
          </div>

          <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <button
              onClick={onGoSignUp}
              className="text-[#0077c8] font-bold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
