const express = require('express');
const jwt = require('jsonwebtoken');
const BulkOrder = require('../models/BulkOrder');
const { sendAdminAlert, sendCustomerConfirmation } = require('../services/emailService');

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

// POST /api/bulk-orders — Submit a bulk order request (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, fromCity, toCity, equipmentType, weightTons, timeline, notes } = req.body;

    if (!name || !email || !phone || !fromCity || !toCity || !equipmentType || !weightTons || !timeline)
      return res.status(400).json({ message: 'Please fill all required fields' });

    // Validate name
    const trimmedName = name.trim();
    if (trimmedName.length < 2)
      return res.status(400).json({ message: 'Name must be at least 2 characters' });

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const trimmedEmail = email.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) 
      return res.status(400).json({ message: 'Please enter a valid email address' });
    const domainPart = trimmedEmail.split('@')[1];
    if (!domainPart || !domainPart.includes('.'))
      return res.status(400).json({ message: 'Please enter a valid email address' });

    // Validate phone (Indian mobile: optional +91/0 prefix, then 10-digit starting with 6-9)
    const cleanedPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^(?:\+91|91|0)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanedPhone))
      return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number' });

    if (weightTons < 500)
      return res.status(400).json({ message: 'This form is for shipments of 500+ tons only' });

    const order = await BulkOrder.create({
      name: trimmedName, email: trimmedEmail, phone: cleanedPhone, company: company || '',
      fromCity, toCity, equipmentType,
      weightTons: Number(weightTons),
      timeline, notes: notes || '',
    });

    // Send emails (non-blocking — don't fail the request if email fails)
    Promise.all([
      sendAdminAlert(order),
      sendCustomerConfirmation(order),
    ]).catch(err => console.error('Email error:', err.message));

    res.status(201).json({ message: 'Request submitted successfully', id: order._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/bulk-orders — Admin: get all orders
router.get('/', verifyToken, adminOnly, async (req, res) => {
  try {
    const orders = await BulkOrder.find().sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/bulk-orders/:id/status — Admin: update order status
router.patch('/:id/status', verifyToken, adminOnly, async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const order = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/bulk-orders/export/csv — Admin: export orders as CSV
router.get('/export/csv', verifyToken, adminOnly, async (req, res) => {
  try {
    const orders = await BulkOrder.find().sort({ createdAt: -1 }).lean();

    const headers = ['Name', 'Email', 'Phone', 'Company', 'From', 'To', 'Equipment', 'Weight (Tons)', 'Timeline', 'Status', 'Notes', 'Admin Notes', 'Created At'];

    const escapeCSV = (val) => {
      const str = String(val || '');
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = orders.map(o => [
      o.name, o.email, o.phone, o.company,
      o.fromCity, o.toCity, o.equipmentType, o.weightTons,
      o.timeline, o.status, o.notes, o.adminNotes,
      new Date(o.createdAt).toLocaleString('en-IN'),
    ].map(escapeCSV).join(','));

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=shipgod_orders_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Export failed' });
  }
});

module.exports = router;
