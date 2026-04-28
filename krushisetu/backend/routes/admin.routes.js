const express = require('express');
const r = express.Router();
const { getDashboardStats, getAllUsers, toggleUserStatus, getAllCrops, getAllOrders } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

r.use(protect, authorize('admin'));
r.get('/stats', getDashboardStats);
r.get('/users', getAllUsers);
r.put('/users/:id/toggle', toggleUserStatus);
r.get('/crops', getAllCrops);
r.get('/orders', getAllOrders);

module.exports = r;
