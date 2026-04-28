const Bid = require('../models/Bid.model');
const Crop = require('../models/Crop.model');
const Order = require('../models/Order.model');

// @POST /api/bids
exports.placeBid = async (req, res) => {
  try {
    const { cropId, bidAmount, quantity, message } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.sellingType !== 'bidding') return res.status(400).json({ message: 'Crop not open for bidding' });

    const bid = await Bid.create({
      cropId,
      traderId: req.user._id,
      farmerId: crop.farmerId,
      bidAmount,
      quantity,
      message,
    });
    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/bids/crop/:cropId
exports.getBidsForCrop = async (req, res) => {
  try {
    const bids = await Bid.find({ cropId: req.params.cropId })
      .populate('traderId', 'fullName email')
      .sort({ bidAmount: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/bids/my
exports.getMyBids = async (req, res) => {
  try {
    const query = req.user.role === 'trader' ? { traderId: req.user._id } : { farmerId: req.user._id };
    const bids = await Bid.find(query)
      .populate('cropId', 'cropName imageUrl pricePerKg')
      .populate('traderId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/bids/:id/respond
exports.respondToBid = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const bid = await Bid.findById(req.params.id);
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.farmerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    bid.status = status;
    await bid.save();

    if (status === 'accepted') {
      const crop = await Crop.findById(bid.cropId);
      const order = await Order.create({
        traderId: bid.traderId,
        farmerId: bid.farmerId,
        cropId: bid.cropId,
        bidId: bid._id,
        quantity: bid.quantity,
        totalPrice: bid.bidAmount * bid.quantity,
        status: 'confirmed',
      });
      bid.status = 'converted';
      await bid.save();
      await Crop.findByIdAndUpdate(bid.cropId, { status: 'reserved' });
      return res.json({ bid, order });
    }

    res.json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
