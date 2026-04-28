const express = require('express');
const router = express.Router();
const { placeBid, getBidsForCrop, getMyBids, respondToBid } = require('../controllers/bid.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.post('/', protect, authorize('trader'), placeBid);
router.get('/my', protect, getMyBids);
router.get('/crop/:cropId', protect, getBidsForCrop);
router.put('/:id/respond', protect, authorize('farmer'), respondToBid);

module.exports = router;
