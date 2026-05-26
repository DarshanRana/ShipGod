const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  // Customer info
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true, match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, 'Please enter a valid email address'] },
  phone: { type: String, required: true, trim: true, match: [/^(?:\+91|91|0)?[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'] },
  company: { type: String, trim: true, default: '' },

  // Shipment info
  fromCity: { type: String, required: true, trim: true },
  toCity: { type: String, required: true, trim: true },
  equipmentType: { type: String, required: true, trim: true },
  weightTons: { type: Number, required: true, min: 500 },
  timeline: { type: String, required: true },
  notes: { type: String, trim: true, default: '' },

  // Admin tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'closed'],
    default: 'new',
  },
  adminNotes: { type: String, default: '' },

}, { timestamps: true });

// Schema Indexes
bulkOrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
