const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  company: { type: String, required: true },
  contact: { type: String, required: true },
  email: { type: String, required: true },
  quantity: { type: Number, required: true },
  value: { type: String, required: true },
  status: { type: String, default: 'New' },
  paymentStatus: { type: String, default: 'Not Yet' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lead', leadSchema);
