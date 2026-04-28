const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
    traderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bidAmount: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'converted'],
      default: 'pending',
    },
    message: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bid', bidSchema);
