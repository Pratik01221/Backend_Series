const Order = require('../models/Order.model');
const Crop = require('../models/Crop.model');

// @POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { cropId, quantity, deliveryAddress, notes } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.status !== 'available') return res.status(400).json({ message: 'Crop not available' });
    
    const availableQuantity = crop.quantity - (crop.soldQuantity || 0);
    if (quantity > availableQuantity) return res.status(400).json({ message: `Only ${availableQuantity} kg available` });

    const totalPrice = quantity * crop.pricePerKg;
    const order = await Order.create({
      traderId: req.user._id,
      farmerId: crop.farmerId,
      cropId,
      quantity,
      totalPrice,
      deliveryAddress,
      notes,
    });

    // Update sold quantity
    const newSoldQuantity = (crop.soldQuantity || 0) + quantity;
    const newStatus = newSoldQuantity >= crop.quantity ? 'sold' : 'available';
    await Crop.findByIdAndUpdate(cropId, { 
      soldQuantity: newSoldQuantity,
      status: newStatus
    });

    const populated = await Order.findById(order._id)
      .populate('cropId', 'cropName pricePerKg imageUrl')
      .populate('farmerId', 'fullName email phone')
      .populate('traderId', 'fullName email');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/my
exports.getMyOrders = async (req, res) => {
  try {
    const query = req.user.role === 'trader' ? { traderId: req.user._id } : { farmerId: req.user._id };
    const orders = await Order.find(query)
      .populate('cropId', 'cropName pricePerKg imageUrl category')
      .populate('farmerId', 'fullName email phone')
      .populate('traderId', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('cropId')
      .populate('farmerId', 'fullName email phone')
      .populate('traderId', 'fullName email phone');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isFarmer = order.farmerId.toString() === req.user._id.toString();
    const isTrader = order.traderId.toString() === req.user._id.toString();

    if (!isFarmer && !isTrader) return res.status(403).json({ message: 'Not authorized' });

    order.status = status;
    if (status === 'delivered') order.deliverAt = new Date();
    if (status === 'cancelled') await Crop.findByIdAndUpdate(order.cropId, { status: 'available' });
    if (status === 'delivered') await Crop.findByIdAndUpdate(order.cropId, { status: 'sold' });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
