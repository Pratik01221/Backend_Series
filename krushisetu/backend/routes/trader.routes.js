const express = require('express');
const r = express.Router();
const { getTraderProfile, updateTraderProfile } = require('../controllers/trader.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
r.get('/:id', getTraderProfile);
r.put('/profile/update', protect, authorize('trader'), updateTraderProfile);
module.exports = r;
