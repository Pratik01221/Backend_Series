const User = require('../models/User.model');
const Crop = require('../models/Crop.model');
const Order = require('../models/Order.model');
const Payment = require('../models/Payment.model');

// @GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalFarmers, totalTraders, totalCrops, totalOrders, totalPayments] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'farmer' }),
      User.countDocuments({ role: 'trader' }),
      Crop.countDocuments(),
      Order.countDocuments(),
      Payment.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    ]);

    res.json({
      totalUsers, totalFarmers, totalTraders, totalCrops, totalOrders,
      totalRevenue: totalPayments[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/admin/users/:id/toggle
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/crops
exports.getAllCrops = async (req, res) => {
  try {
    const crops = await Crop.find().populate('farmerId', 'fullName email').sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/admin/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('traderId', 'fullName')
      .populate('farmerId', 'fullName')
      .populate('cropId', 'cropName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
