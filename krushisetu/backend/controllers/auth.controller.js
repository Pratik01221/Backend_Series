const User = require('../models/User.model');
const Farmer = require('../models/Farmer.model');
const Trader = require('../models/Trader.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { fullName, email, password, role, phone, farmLocation, farmSize, cropsGrown, companyName, businessLicense, location } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ fullName, email, password, role, phone });

    if (role === 'farmer') {
      await Farmer.create({ userId: user._id, farmLocation: farmLocation || 'Not specified', farmSize, cropsGrown: cropsGrown || [] });
    } else if (role === 'trader') {
      await Trader.create({ userId: user._id, location: location || 'Not specified', companyName, businessLicense });
    }

    const token = generateToken(user._id);
    res.status(201).json({ message: 'Registration successful', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    if (!user.isActive) return res.status(403).json({ message: 'Account deactivated. Contact admin.' });

    const token = generateToken(user._id);
    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    if (user.role === 'farmer') profile = await Farmer.findOne({ userId: user._id });
    if (user.role === 'trader') profile = await Trader.findOne({ userId: user._id });
    res.json({ user, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
