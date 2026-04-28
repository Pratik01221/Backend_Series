const mongoose = require('mongoose');

const farmerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    farmLocation: { type: String, required: true },
    farmSize: { type: String },
    cropsGrown: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    profileImage: { type: String },
    bio: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farmer', farmerSchema);
