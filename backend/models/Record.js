// models/Record.js
const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  Sno: String,
  "Company Name": String,
  "Contact Name": String,
  "Contact Number": String,
  Email: String,
  "Product Name": String,
  Qty: String,
  Price: String,
  Address: String,
  Status: String,       // ✅ Add this
  Payment: String       // ✅ Add this
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Record', recordSchema);
