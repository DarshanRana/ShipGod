import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiTruck, HiArrowLeft, HiCheckCircle, HiFingerPrint } from 'react-icons/hi';
import { validateEmail } from '../utils/validators';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API = `${API_BASE}/api/auth`;

export default function ForgotPassword({ onGoSignIn }) {
  const [stage, setStage] = useState('email'); // 'email' | 'otp' | 'reset' | 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const [touched, setTouched] = useState({});
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const validateField = (field, value) => {
    let valid = true;
    switch (field) {
      case 'email': {
        const r = validateEmail(value);
        setEmailError(r.valid ? '' : r.message);
        valid = r.valid;
        break;
      }
      case 'otp': {
        const isSixDigits = /^\d{6}$/.test(value.trim());
        setOtpError(isSixDigits ? '' : 'OTP must be a 6-digit number');
        valid = isSixDigits;
        break;
      }
      case 'password': {
        const isLongEnough = value.length >= 6;
        setPasswordError(isLongEnough ? '' : 'Password must be at least 6 characters');
        valid = isLongEnough;
        break;
      }
      case 'confirmPassword': {
        const matches = value === password;
        setConfirmPasswordError(matches ? '' : 'Passwords do not match');
        valid = matches;
        break;
      }
      default:
        break;
    }
    return valid;
  };

  const handleBlur = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, value);
  };

  // Stage 1: Request OTP email
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    const isEmailValid = validateField('email', email);
    setTouched({ email: true });

    if (!isEmailValid) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to dispatch OTP request');
      
      // Advance to OTP input screen
      setStage('otp');
      setTouched({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newValues = [...otpValues];
      newValues[index] = '';
      setOtpValues(newValues);
      const combined = newValues.join('');
      setOtp(combined);
      if (touched.otp) validateField('otp', combined);
      return;
    }

    const newValues = [...otpValues];
    newValues[index] = cleanVal.slice(-1);
    setOtpValues(newValues);
    const combined = newValues.join('');
    setOtp(combined);
    if (touched.otp) validateField('otp', combined);

    // Auto-focus next input
    if (index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        const newValues = [...otpValues];
        newValues[index - 1] = '';
        setOtpValues(newValues);
        const combined = newValues.join('');
        setOtp(combined);
        if (touched.otp) validateField('otp', combined);
        otpRefs[index - 1].current.focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newValues = pastedData.split('');
      setOtpValues(newValues);
      setOtp(pastedData);
      if (touched.otp) validateField('otp', pastedData);
      otpRefs[5].current.focus();
    }
  };

  // Stage 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    const isOtpValid = validateField('otp', otp);
    setTouched({ otp: true });

    if (!isOtpValid) return;

    setLoading(true);
    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'OTP verification failed');

      // Go to reset password stage
      setStage('reset');
      setTouched({});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Stage 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    const isPassValid = validateField('password', password);
    const isConfirmValid = validateField('confirmPassword', confirmPassword);
    setTouched({ password: true, confirmPassword: true });

    if (!isPassValid || !isConfirmValid) {
      setError('Please fix all errors below');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          password
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Password reset failed');

      // Password successfully updated!
      setStage('success');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
            {stage === 'email' && 'Forgot Password?'}
            {stage === 'otp' && 'Enter OTP'}
            {stage === 'reset' && 'Create New Password'}
            {stage === 'success' && 'Reset Completed!'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {stage === 'email' && "No worries! Enter your email and we'll send you a 6-digit OTP."}
            {stage === 'otp' && "Please enter the 6-digit verification code sent to your email."}
            {stage === 'reset' && 'Choose a secure, strong password for your account.'}
            {stage === 'success' && 'Your password has been successfully updated.'}
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border shadow-sm relative overflow-hidden"
          style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 font-medium mb-5"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {stage === 'email' && (
              <motion.form
                key="email-stage"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                onSubmit={handleRequestOTP}
                className="space-y-5"
              >
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (touched.email) validateField('email', e.target.value);
                      }}
                      onBlur={() => handleBlur('email', email)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                      style={{
                        backgroundColor: 'var(--bg-page)',
                        borderColor: touched.email && emailError ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  {touched.email && emailError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{emailError}</motion.p>
                  )}
                </div>

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
                      Sending Code…
                    </>
                  ) : (
                    <>
                      <HiMail /> Send 6-Digit OTP
                    </>
                  )}
                </button>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={onGoSignIn}
                    className="text-sm font-medium hover:underline flex items-center justify-center gap-1 mx-auto"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <HiArrowLeft className="text-xs" /> Back to Sign In
                  </button>
                </div>
              </motion.form>
            )}

            {stage === 'otp' && (
              <motion.form
                key="otp-stage"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                onSubmit={handleVerifyOTP}
                className="space-y-6"
              >
                <div className="flex justify-center gap-2 sm:gap-3 my-4">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      onPaste={handleOtpPaste}
                      onFocus={() => setFocusedIndex(idx)}
                      onBlur={() => setFocusedIndex(-1)}
                      className="w-11 h-14 border text-center text-xl font-extrabold rounded-xl transition-all outline-none"
                      style={{
                        backgroundColor: 'var(--bg-page)',
                        borderColor: touched.otp && otpError ? '#ef4444' : (focusedIndex === idx ? '#3b82f6' : 'var(--border-color)'),
                        color: 'var(--text-primary)',
                        boxShadow: focusedIndex === idx ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none',
                      }}
                    />
                  ))}
                </div>

                {touched.otp && otpError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs text-center font-medium">{otpError}</motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-[#0f284c]"
                  style={{
                    backgroundColor: '#1d3557', // Sleek premium dark blue exactly matching screenshot!
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying…
                    </>
                  ) : 'Verify'}
                </button>

                <div className="text-center space-y-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setStage('email');
                      setTouched({});
                      setError('');
                    }}
                    className="text-xs font-bold text-[#0077c8] hover:underline block mx-auto"
                  >
                    ← Re-enter Email Address
                  </button>
                </div>
              </motion.form>
            )}

            {stage === 'reset' && (
              <motion.form
                key="reset-stage"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                onSubmit={handleResetPassword}
                className="space-y-5"
              >
                {/* New Password */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    New Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value);
                        if (touched.password) validateField('password', e.target.value);
                        if (touched.confirmPassword) validateField('confirmPassword', confirmPassword);
                      }}
                      onBlur={() => handleBlur('password', password)}
                      required
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-11 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                      style={{
                        backgroundColor: 'var(--bg-page)',
                        borderColor: touched.password && passwordError ? '#ef4444' : 'var(--border-color)',
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
                  {touched.password && passwordError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{passwordError}</motion.p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--text-primary)' }}>
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (touched.confirmPassword) validateField('confirmPassword', e.target.value);
                      }}
                      onBlur={() => handleBlur('confirmPassword', confirmPassword)}
                      required
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border text-sm outline-none transition-all focus:border-[#0077c8] focus:ring-2 focus:ring-[#0077c8]/10"
                      style={{
                        backgroundColor: 'var(--bg-page)',
                        borderColor: touched.confirmPassword && confirmPasswordError ? '#ef4444' : 'var(--border-color)',
                        color: 'var(--text-primary)',
                      }}
                    />
                  </div>
                  {touched.confirmPassword && confirmPasswordError && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-xs mt-1 font-medium">{confirmPasswordError}</motion.p>
                  )}
                </div>

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
                      Resetting Password…
                    </>
                  ) : 'Reset Password'}
                </button>
              </motion.form>
            )}

            {stage === 'success' && (
              <motion.div
                key="success-stage"
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                >
                  <HiCheckCircle className="text-[#0fa14a] text-6xl mx-auto mb-4 animate-bounce" />
                </motion.div>
                <h2 className="text-2xl font-extrabold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Password Reset!
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Your password has been changed successfully. You can now use your new password to sign in.
                </p>
                <button
                  onClick={onGoSignIn}
                  className="w-full py-3 rounded-lg bg-[#0fa14a] hover:bg-[#0d8a3f] text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <HiArrowLeft /> Go to Sign In
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
