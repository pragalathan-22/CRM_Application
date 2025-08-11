// models/Invoice.js
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hsn: { type: String },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  discount: { type: Number, default: 0 }
});

const InvoiceSchema = new mongoose.Schema({
  estimateDate: { type: String, required: true },
  estimateNumber: { type: String, required: true },
  referenceNumber: { type: String },
  dueDate: { type: String, required: true },
  customerName: { type: String, required: true },
  billingAddress: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  customerGSTIN: { type: String, required: true },
  placeOfSupply: { type: String, required: true },
  items: [ItemSchema],
  totalTaxable: { type: Number, required: true },
  totalCGST: { type: Number, required: true },
  totalSGST: { type: Number, required: true },
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Invoice", InvoiceSchema);
