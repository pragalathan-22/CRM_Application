const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: "Admin" },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  department: { type: String },
  joiningDate: { type: Date },
  relievingDate: { type: Date },
  location: { type: String },
  profileImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Admin", AdminSchema);
