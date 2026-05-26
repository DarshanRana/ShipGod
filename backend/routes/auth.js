const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail, sendPasswordResetSuccessEmail } = require('../services/emailService');

const router = express.Router();

const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (trimmedName.length > 100)
      return res.status(400).json({ message: 'Name is too long' });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail))
      return res.status(400).json({ message: 'Please enter a valid email address' });
    const domainPart = trimmedEmail.split('@')[1];
    if (!domainPart || !domainPart.includes('.'))
      return res.status(400).json({ message: 'Please enter a valid email address' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findOne({ email: trimmedEmail });
    if (existing)
      return res.status(409).json({ message: 'Email already registered. Please sign in.' });

    const user = await User.create({ name: trimmedName, email: trimmedEmail, password });
    const token = generateToken(user._id, user.email);
    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail))
      return res.status(400).json({ message: 'Please enter a valid email address' });

    const user = await User.findOne({ email: trimmedEmail });
    if (!user)
      return res.status(401).json({ message: 'No account found with this email' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect password' });

    const token = generateToken(user._id, user.email);
    const isAdmin = user.email === process.env.ADMIN_EMAIL;

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, isAdmin },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/auth/me  (verify token & return user)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorized' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isAdmin = user.email === process.env.ADMIN_EMAIL;
    res.json({ user: { id: user._id, name: user.name, email: user.email, isAdmin } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// POST /api/auth/forgot-password — Send password reset OTP email
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: 'Email is required' });

    const trimmedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: trimmedEmail });

    // Always respond with success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If an account exists with that email, a 6-digit OTP code has been sent.' });
    }

    // Generate a secure random 6-digit OTP
    const otpCode = String(crypto.randomInt(100000, 999999));

    // Hash the OTP before storing (we only store the hash in DB)
    const hashedOTP = crypto.createHash('sha256').update(otpCode).digest('hex');

    user.resetPasswordToken = hashedOTP;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Send the raw (unhashed) OTP to the user's email
    try {
      await sendPasswordResetEmail(user.email, user.name, otpCode);
    } catch (emailErr) {
      console.error('Failed to dispatch password reset OTP:', emailErr.message);
    }

    res.json({ message: 'If an account exists with that email, a 6-digit OTP code has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/reset-password — Reset password with OTP
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // Hash the input OTP code to compare with stored hash
    const hashedOTP = crypto.createHash('sha256').update(otp.trim()).digest('hex');

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordToken: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });

    // Set new password and clear reset fields
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Send password reset success notification email
    try {
      await sendPasswordResetSuccessEmail(user.email, user.name);
    } catch (emailErr) {
      console.error('Failed to dispatch password reset success notification:', emailErr.message);
    }

    res.json({ message: 'Password has been reset successfully. You can now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/verify-otp — Verify OTP code is correct and not expired
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp)
      return res.status(400).json({ message: 'Email and OTP are required' });

    // Hash the input OTP code to compare with stored hash
    const hashedOTP = crypto.createHash('sha256').update(otp.trim()).digest('hex');

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordToken: hashedOTP,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired OTP. Please request a new one.' });

    res.json({ message: 'OTP verified successfully. You can now reset your password.' });
  } catch (err) {
    console.error('Verify OTP error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;

