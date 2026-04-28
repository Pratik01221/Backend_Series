const express = require('express');
const r = express.Router();
const { createPayment, getMyPayments } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');
r.post('/', protect, createPayment);
r.get('/my', protect, getMyPayments);
module.exports = r;
