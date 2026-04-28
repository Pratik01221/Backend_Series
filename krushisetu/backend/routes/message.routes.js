const express = require('express');
const r = express.Router();
const { sendMessage, getConversation, getConversationList } = require('../controllers/message.controller');
const { protect } = require('../middleware/auth.middleware');
r.post('/', protect, sendMessage);
r.get('/conversations/list', protect, getConversationList);
r.get('/:userId', protect, getConversation);
module.exports = r;
