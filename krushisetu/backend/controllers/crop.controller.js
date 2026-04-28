const Crop = require('../models/Crop.model');

// @GET /api/crops - Get all crops (marketplace)
exports.getAllCrops = async (req, res) => {
  try {
    const { category, location, search, sellingType, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = { status: 'available' };

    if (category) query.category = category;
    if (location) query.location = new RegExp(location, 'i');
    if (sellingType) query.sellingType = sellingType;
    if (minPrice || maxPrice) query.pricePerKg = {};
    if (minPrice) query.pricePerKg.$gte = Number(minPrice);
    if (maxPrice) query.pricePerKg.$lte = Number(maxPrice);
    if (search) query.$text = { $search: search };

    const total = await Crop.countDocuments(query);
    const crops = await Crop.find(query)
      .populate('farmerId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ crops, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/crops/:id
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmerId', 'fullName email phone');
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/crops - Farmer adds crop
exports.createCrop = async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, farmerId: req.user._id, imageUrl: req.file?.path });
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/crops/:id
exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.farmerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/crops/:id
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.farmerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    await crop.deleteOne();
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/crops/my/listings
exports.getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
