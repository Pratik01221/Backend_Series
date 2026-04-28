const express = require('express');
const router = express.Router();
const { getAllCrops, getCropById, createCrop, updateCrop, deleteCrop, getMyCrops } = require('../controllers/crop.controller');
const { protect, authorize } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');

router.get('/', getAllCrops);
router.get('/my/listings', protect, authorize('farmer'), getMyCrops);
router.get('/:id', getCropById);
router.post('/', protect, authorize('farmer'), upload.single('image'), createCrop);
router.put('/:id', protect, authorize('farmer'), updateCrop);
router.delete('/:id', protect, authorize('farmer'), deleteCrop);

module.exports = router;
