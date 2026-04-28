const express = require('express');
const r = express.Router();
const { createReview, getFarmerReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
r.post('/', protect, createReview);
r.get('/farmer/:farmerId', getFarmerReviews);
module.exports = r;
