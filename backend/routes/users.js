const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Middleware — verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authorized' });
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware — admin only
const adminOnly = (req, res, next) => {
  if (req.userEmail !== process.env.ADMIN_EMAIL)
    return res.status(403).json({ message: 'Admin access required' });
  next();
};

// GET /api/users — Admin: list all users
router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    const usersWithAdmin = users.map(u => ({
      _id: u._id,
      name: u.name,
      email: u.email,
      isActive: u.isActive !== false, // default true for existing users
      isAdmin: u.email === process.env.ADMIN_EMAIL,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    }));

    res.json(usersWithAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/users/:id/toggle-active — Admin: activate/deactivate a user
router.patch('/:id/toggle-active', verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deactivating admin
    if (user.email === process.env.ADMIN_EMAIL)
      return res.status(400).json({ message: 'Cannot deactivate admin account' });

    user.isActive = user.isActive === false ? true : false;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      isAdmin: user.email === process.env.ADMIN_EMAIL,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/:id — Admin: permanently delete a user
router.delete('/:id', verifyToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent deleting admin
    if (user.email === process.env.ADMIN_EMAIL)
      return res.status(400).json({ message: 'Cannot delete admin account' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
