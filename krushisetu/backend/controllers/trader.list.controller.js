const User = require('../models/User.model');

// @GET /api/traders/list
exports.getAllTraders = async (req, res) => {
  try {
    console.log('[TraderList] Fetching traders...');
    const traders = await User.find({ role: 'trader' }).select('_id fullName email phone');
    console.log('[TraderList] Found:', traders.length);
    res.json(traders);
  } catch (err) {
    console.error('[TraderList] Error:', err.message);
    res.status(500).json({ message: err.message });
  }
};
