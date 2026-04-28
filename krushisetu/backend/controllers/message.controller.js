const Message = require('../models/Message.model');

const getRoomId = (id1, id2) => [id1, id2].sort().join('_');

// @POST /api/messages
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const roomId = getRoomId(req.user._id.toString(), receiverId);
    const msg = await Message.create({ senderId: req.user._id, receiverId, message, roomId });
    const populated = await Message.findById(msg._id).populate('senderId', 'fullName role');

    const io = req.app.get('io');
    io.to(roomId).emit('receive_message', populated);

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/messages/:userId
exports.getConversation = async (req, res) => {
  try {
    const roomId = getRoomId(req.user._id.toString(), req.params.userId);
    const messages = await Message.find({ roomId })
      .populate('senderId', 'fullName role')
      .sort({ createdAt: 1 });
    await Message.updateMany({ roomId, receiverId: req.user._id }, { isRead: true });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/messages/conversations/list
exports.getConversationList = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const messages = await Message.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    })
      .populate('senderId', 'fullName role')
      .populate('receiverId', 'fullName role')
      .sort({ createdAt: -1 });

    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const otherId = msg.senderId._id.toString() === userId ? msg.receiverId._id.toString() : msg.senderId._id.toString();
      if (!seen.has(otherId)) {
        seen.add(otherId);
        conversations.push({
          user: msg.senderId._id.toString() === userId ? msg.receiverId : msg.senderId,
          lastMessage: msg.message,
          timestamp: msg.createdAt,
          unread: !msg.isRead && msg.receiverId._id.toString() === userId,
        });
      }
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
