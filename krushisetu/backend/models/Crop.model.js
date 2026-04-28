const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropName: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'pulses', 'spices', 'oilseeds', 'others'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 0 },
    soldQuantity: { type: Number, default: 0, min: 0 },
    pricePerKg: { type: Number, required: true, min: 0 },
    sellingType: { type: String, enum: ['fixed', 'bidding'], default: 'fixed' },
    location: { type: String, required: true },
    harvestDate: { type: Date },
    imageUrl: { type: String },
    description: { type: String },
    status: { type: String, enum: ['available', 'sold', 'reserved'], default: 'available' },
    minimumBidAmount: { type: Number },
    biddingEndDate: { type: Date },
  },
  { timestamps: true }
);

cropSchema.index({ cropName: 'text', category: 'text', location: 'text' });

module.exports = mongoose.model('Crop', cropSchema);
