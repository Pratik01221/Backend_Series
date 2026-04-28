const Payment = require('../models/Payment.model');
const Order = require('../models/Order.model');

// @POST /api/payments
exports.createPayment = async (req, res) => {
  try {
    const { orderId, method, transactionId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const payment = await Payment.create({
      orderId,
      traderId: order.traderId,
      farmerId: order.farmerId,
      totalPrice: order.totalPrice,
      method,
      transactionId,
      status: 'completed',
      paidAt: new Date(),
    });

    await Order.findByIdAndUpdate(orderId, { status: 'confirmed' });
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/payments/my
exports.getMyPayments = async (req, res) => {
  try {
    const query = req.user.role === 'trader' ? { traderId: req.user._id } : { farmerId: req.user._id };
    const payments = await Payment.find(query)
      .populate('orderId')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
