const Farmer = require('../models/Farmer.model');
const User = require('../models/User.model');

exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOne({ userId: req.params.id }).populate('userId', 'fullName email phone');
    if (!farmer) return res.status(404).json({ message: 'Farmer not found' });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().populate('userId', 'fullName email phone');
    const mapped = farmers.map(f => ({
      _id: f.userId._id,
      fullName: f.userId.fullName,
      email: f.userId.email,
      phone: f.userId.phone,
    }));
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findOneAndUpdate({ userId: req.user._id }, req.body, { new: true });
    await User.findByIdAndUpdate(req.user._id, { fullName: req.body.fullName, phone: req.body.phone });
    res.json(farmer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
