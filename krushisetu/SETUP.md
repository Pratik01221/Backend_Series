# 🌾 KrushiSetu — Setup & Development Guide

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | v18 or higher | https://nodejs.org |
| MongoDB | v6+ local OR Atlas | https://mongodb.com |
| Git | any | https://git-scm.com |

Optionally for image uploads:
- **Cloudinary** free account → https://cloudinary.com

---

## ⚡ Quick Start (5 minutes)

### Step 1 — Clone / Extract

```bash
unzip KrushiSetu_FullStack.zip
cd krushisetu
```

### Step 2 — Configure Backend

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/krushisetu
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d

# Cloudinary (optional – skip if you don't need image upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

> 💡 **MongoDB Atlas** URI looks like:
> `mongodb+srv://username:password@cluster.mongodb.net/krushisetu`

### Step 3 — Install & Seed Backend

```bash
npm install
npm run seed        # Creates 5 demo accounts + 8 sample crops
npm run dev         # Starts API on http://localhost:5000
```

You should see:
```
✅ MongoDB Connected
🚀 KrushiSetu Server running on port 5000
```

### Step 4 — Install & Start Frontend

Open a new terminal:

```bash
cd ../frontend
npm install
npm run dev         # Starts UI on http://localhost:5173
```

Open **http://localhost:5173** in your browser 🎉

---

## 🔑 Demo Accounts

| Role    | Email              | Password  |
|---------|--------------------|-----------|
| Admin   | admin@demo.com     | demo1234  |
| Farmer  | farmer@demo.com    | demo1234  |
| Farmer2 | farmer2@demo.com   | demo1234  |
| Trader  | trader@demo.com    | demo1234  |
| Trader2 | trader2@demo.com   | demo1234  |

---

## 🗂️ Project Structure

```
krushisetu/
├── backend/
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   └── cloudinary.js           # Cloudinary + Multer setup
│   ├── controllers/
│   │   ├── auth.controller.js      # Register, Login, GetMe, ChangePassword
│   │   ├── crop.controller.js      # CRUD + listing filter
│   │   ├── order.controller.js     # Place, track, update status
│   │   ├── bid.controller.js       # Place bid, respond, list
│   │   ├── payment.controller.js   # Record payment
│   │   ├── review.controller.js    # Post review, update rating
│   │   ├── message.controller.js   # Send, list conversations
│   │   ├── farmer.controller.js    # Farmer profile CRUD
│   │   ├── trader.controller.js    # Trader profile CRUD
│   │   └── admin.controller.js     # Stats, user management
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT protect + role authorize
│   │   ├── error.middleware.js     # Global error handler
│   │   └── rateLimiter.middleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Farmer.model.js
│   │   ├── Trader.model.js
│   │   ├── Crop.model.js
│   │   ├── Bid.model.js
│   │   ├── Order.model.js
│   │   ├── Payment.model.js
│   │   ├── Review.model.js
│   │   └── Message.model.js
│   ├── routes/                     # One file per resource
│   ├── seed.js                     # Demo data seeder
│   ├── server.js                   # Entry point
│   └── .env.example
│
└── frontend/
    └── src/
        ├── api/
        │   ├── axios.js            # Axios instance with interceptors
        │   └── services.js         # All API service functions
        ├── components/common/
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── DashboardLayout.jsx  # Mobile-responsive with hamburger
        │   ├── CropCard.jsx
        │   ├── StatCard.jsx
        │   ├── StatusBadge.jsx
        │   ├── Skeleton.jsx         # Loading skeletons
        │   ├── EmptyState.jsx
        │   ├── ConfirmDialog.jsx
        │   ├── Pagination.jsx
        │   ├── PaymentModal.jsx
        │   └── ReviewModal.jsx
        ├── hooks/
        │   ├── useApi.js
        │   ├── useDebounce.js
        │   └── useSocket.js         # Singleton Socket.IO hook
        ├── pages/
        │   ├── auth/       Login, Register
        │   ├── farmer/     Dashboard, Crops, Orders, Bids
        │   ├── trader/     Dashboard, Orders, Bids
        │   ├── admin/      Dashboard, Users, Crops, Orders, Profile
        │   └── shared/     Landing, Marketplace, CropDetail, Messages,
        │                   Profile, Payments, NotFound
        ├── store/
        │   └── authStore.js        # Zustand auth store
        └── utils/
            └── helpers.js          # formatINR, timeAgo, formatDate, etc.
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | — | Register farmer/trader |
| POST | `/api/auth/login` | — | Login |
| GET  | `/api/auth/me` | ✅ | Current user + profile |
| PUT  | `/api/auth/change-password` | ✅ | Change password |

### Crops
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/crops` | — | Marketplace listing (filters: category, location, search, sellingType, minPrice, maxPrice, page) |
| GET | `/api/crops/:id` | — | Single crop |
| GET | `/api/crops/my/listings` | Farmer | Own listings |
| POST | `/api/crops` | Farmer | Add crop (multipart/form-data) |
| PUT | `/api/crops/:id` | Farmer | Update crop |
| DELETE | `/api/crops/:id` | Farmer | Delete crop |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | Trader | Place order |
| GET | `/api/orders/my` | ✅ | My orders |
| GET | `/api/orders/:id` | ✅ | Order detail |
| PUT | `/api/orders/:id/status` | ✅ | Update status |

### Bids
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/bids` | Trader | Place bid |
| GET | `/api/bids/my` | ✅ | My bids |
| GET | `/api/bids/crop/:cropId` | ✅ | Bids for a crop |
| PUT | `/api/bids/:id/respond` | Farmer | Accept / Reject |

### Messages (REST + Socket.IO)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/messages` | ✅ | Send message |
| GET | `/api/messages/conversations/list` | ✅ | All conversations |
| GET | `/api/messages/:userId` | ✅ | Conversation thread |

**Socket events:**
- `join_room(roomId)` — join a chat room
- `send_message(data)` — send (legacy; REST preferred)
- `receive_message(msg)` — receive incoming message

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)

1. Set all `.env` variables as environment variables on your platform
2. Set `NODE_ENV=production`
3. Deploy `backend/` directory
4. Start command: `node server.js`

### Frontend (Vercel / Netlify)

1. Update `vite.config.js` proxy target OR set `VITE_API_URL` env var
2. In `axios.js` change `baseURL` to your backend URL for production
3. Deploy `frontend/` directory
4. Build command: `npm run build`
5. Output directory: `dist`

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, Zustand, React Router v6 |
| UI Fonts | Playfair Display (headings), DM Sans (body) |
| Backend | Node.js 18, Express.js 4, Socket.IO 4 |
| Database | MongoDB 6, Mongoose 7 |
| Auth | JWT + bcryptjs |
| Images | Cloudinary + Multer |
| Real-time | Socket.IO (chat) |

---

## 👨‍💻 Team

- **2501029** — Dipak Chavan
- **2501055** — Pratik Garad

**Institute:** Maharashtra Education Society's IMCC, Pune (Autonomous)  
**Program:** MCA – SEM I | A.Y. 2025-26
