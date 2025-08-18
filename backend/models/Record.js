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
  Status: String,
  Payment: String,

  // ✅ store name instead of ObjectId
  employee: {
    type: String,   // directly save employee name
    required: true,
  }
}, {
  timestamps: true,
  versionKey: false
});

module.exports = mongoose.model('Record', recordSchema);
