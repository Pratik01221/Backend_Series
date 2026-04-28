const mongoose = require('mongoose');

const traderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String },
    businessLicense: { type: String },
    location: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    profileImage: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Trader', traderSchema);
