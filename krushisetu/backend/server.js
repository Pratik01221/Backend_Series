const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const errorHandler = require('./middleware/error.middleware');
const { authLimiter, generalLimiter } = require('./middleware/rateLimiter.middleware');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth.routes'));
app.use('/api/farmers', generalLimiter, require('./routes/farmer.routes'));
app.use('/api/traders', generalLimiter, require('./routes/trader.routes'));
app.use('/api/crops', generalLimiter, require('./routes/crop.routes'));
app.use('/api/orders', generalLimiter, require('./routes/order.routes'));
app.use('/api/bids', generalLimiter, require('./routes/bid.routes'));
app.use('/api/payments', generalLimiter, require('./routes/payment.routes'));
app.use('/api/reviews', generalLimiter, require('./routes/review.routes'));
app.use('/api/messages', generalLimiter, require('./routes/message.routes'));
app.use('/api/admin', generalLimiter, require('./routes/admin.routes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'KrushiSetu API is running', timestamp: new Date() }));

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

// Global error handler (must be last)
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    server.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 KrushiSetu Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
