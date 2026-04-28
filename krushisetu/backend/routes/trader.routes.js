const express = require('express');
const r = express.Router();
const { getTraderProfile, updateTraderProfile } = require('../controllers/trader.controller');
const { getAllTraders } = require('../controllers/trader.list.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Debug test route
r.get('/test', (req, res) => {
  res.json({ message: 'Trader route working!' });
});

// IMPORTANT: More specific routes MUST come before parameterized routes
r.get('/list', getAllTraders);  // This must be BEFORE /:id
r.get('/:id', getTraderProfile);
r.put('/profile/update', protect, authorize('trader'), updateTraderProfile);
module.exports = r;
