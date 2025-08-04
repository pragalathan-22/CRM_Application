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
}, {
  timestamps: true,
  versionKey: false  // ✅ This removes __v field
});

module.exports = mongoose.model('Record', recordSchema);
