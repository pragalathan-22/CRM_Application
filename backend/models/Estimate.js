// const mongoose = require('mongoose');

// const ItemSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   hsn: String,
//   quantity: { type: Number, required: true },
//   rate: { type: Number, required: true },
//   discount: { type: Number, default: 0 },
// });

// const EstimateSchema = new mongoose.Schema({
//   estimateDate: { type: String, required: true },
//   estimateNumber: { type: String, required: true },
//   referenceNumber: String,
//   dueDate: { type: String, required: true },
//   customerName: { type: String, required: true },
//   billingAddress: { type: String, required: true },
//   shippingAddress: { type: String, required: true },
//   customerGSTIN: { type: String, required: true },
//   placeOfSupply: { type: String, required: true },
//   items: [ItemSchema],
//   totalTaxable: Number,
//   totalCGST: Number,
//   totalSGST: Number,
//   total: Number,
// }, { timestamps: true });

// module.exports = mongoose.model('Estimate', EstimateSchema);
