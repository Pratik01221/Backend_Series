const express = require('express');
const r = express.Router();
const { getFarmerProfile, getAllFarmers, updateFarmerProfile } = require('../controllers/farmer.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
r.get('/list', getAllFarmers);
r.get('/:id', getFarmerProfile);
r.put('/profile/update', protect, authorize('farmer'), updateFarmerProfile);
module.exports = r;
