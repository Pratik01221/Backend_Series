const Review = require('../models/Review.model');
const Farmer = require('../models/Farmer.model');
const Trader = require('../models/Trader.model');
const Order = require('../models/Order.model');

// @POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { orderId, rating, comment } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'delivered') return res.status(400).json({ message: 'Order not yet delivered' });

    const reviewedBy = req.user.role;
    const existing = await Review.findOne({ orderId, reviewedBy });
    if (existing) return res.status(400).json({ message: 'Already reviewed this order' });

    const review = await Review.create({
      orderId,
      traderId: order.traderId,
      farmerId: order.farmerId,
      rating,
      comment,
      reviewedBy,
    });

    // Update rating
    if (reviewedBy === 'trader') {
      const reviews = await Review.find({ farmerId: order.farmerId });
      const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
      await Farmer.findOneAndUpdate({ userId: order.farmerId }, { rating: avg.toFixed(1), totalRatings: reviews.length });
    } else {
      const reviews = await Review.find({ traderId: order.traderId });
      const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
      await Trader.findOneAndUpdate({ userId: order.traderId }, { rating: avg.toFixed(1), totalRatings: reviews.length });
    }

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/reviews/farmer/:farmerId
exports.getFarmerReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ farmerId: req.params.farmerId, reviewedBy: 'trader' })
      .populate('traderId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
