const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    joiningDate: { type: Date, required: true },
    relievedDate: { type: Date }, // optional
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", MemberSchema);
