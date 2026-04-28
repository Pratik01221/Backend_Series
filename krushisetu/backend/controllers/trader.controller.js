const Trader = require('../models/Trader.model');
const User = require('../models/User.model');

exports.getTraderProfile = async (req, res) => {
  try {
    const trader = await Trader.findOne({ userId: req.params.id }).populate('userId', 'fullName email phone');
    if (!trader) return res.status(404).json({ message: 'Trader not found' });
    res.json(trader);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTraderProfile = async (req, res) => {
  try {
    const trader = await Trader.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true });
    await User.findByIdAndUpdate(req.user._id, { fullName: req.body.fullName, phone: req.body.phone });
    res.json(trader);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
