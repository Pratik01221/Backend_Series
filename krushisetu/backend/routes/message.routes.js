const express = require('express');
const r = express.Router();
const { sendMessage, getConversation, getConversationList, getUnreadCount } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');
r.post('/', protect, sendMessage);
r.get('/conversations/list', protect, getConversationList);
r.get('/unread/count', protect, getUnreadCount);
r.get('/:userId', protect, getConversation);
module.exports = r;
