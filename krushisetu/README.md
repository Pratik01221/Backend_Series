# 🌾 KrushiSetu — A Bridge Between Farmer and Trader

> Agricultural Marketplace Platform | MCA SEM-I | IMCC Pune | A.Y. 2025-26

KrushiSetu is a full-stack MERN web application that connects farmers directly with traders — removing middlemen, ensuring transparent pricing, and enabling digital agricultural trade.

---

## 🗂️ Project Structure

```
krushisetu/
├── backend/                  # Node.js + Express API
│   ├── config/               # DB & Cloudinary config
│   ├── controllers/          # Business logic
│   ├── middleware/           # JWT auth middleware
│   ├── models/               # Mongoose schemas
│   ├── routes/               # Express route definitions
│   ├── .env.example          # Environment variables template
│   └── server.js             # Entry point
│
└── frontend/                 # React + Vite + Tailwind
    ├── src/
    │   ├── api/              # Axios instance + service functions
    │   ├── components/       # Reusable UI components
    │   ├── pages/            # Page components by role
    │   │   ├── auth/         # Login, Register
    │   │   ├── farmer/       # Farmer Dashboard, Crops, Orders, Bids
    │   │   ├── trader/       # Trader Dashboard, Orders, Bids
    │   │   ├── admin/        # Admin Dashboard, Users, Crops, Orders
    │   │   └── shared/       # Landing, Marketplace, Crop Detail, Messages
    │   ├── store/            # Zustand state (auth)
    │   └── App.jsx           # Routes
    └── index.html
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

Your API will run at `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Your UI will run at `http://localhost:5173`

---

## 🔐 Environment Variables (backend/.env)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/krushisetu
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| 👤 Auth | JWT-based registration & login for Farmer / Trader / Admin |
| 🌾 Crop Listings | Farmers add crops with image, price, quantity, category |
| 🔍 Marketplace | Search, filter, paginate crop listings |
| 🔨 Bidding | Traders bid on bidding-type crops; farmers accept/reject |
| 📦 Orders | Direct buy-now orders with status tracking |
| 💬 Messaging | Real-time chat via Socket.IO |
| ⭐ Reviews | Post-delivery rating system |
| 💳 Payments | Payment recording with transaction tracking |
| 🛡️ Admin | Full platform management dashboard |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, React Router v6 |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Token), bcryptjs |
| Images | Cloudinary |
| Fonts | Playfair Display, DM Sans |

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Current user

### Crops
- `GET /api/crops` — Marketplace listing (with filters)
- `POST /api/crops` — Add crop (farmer)
- `PUT /api/crops/:id` — Edit crop
- `DELETE /api/crops/:id` — Delete crop
- `GET /api/crops/my/listings` — Farmer's own crops

### Orders
- `POST /api/orders` — Place order
- `GET /api/orders/my` — My orders
- `PUT /api/orders/:id/status` — Update status

### Bids
- `POST /api/bids` — Place bid
- `GET /api/bids/my` — My bids
- `PUT /api/bids/:id/respond` — Accept/Reject bid

### Messages
- `POST /api/messages` — Send message
- `GET /api/messages/:userId` — Conversation
- `GET /api/messages/conversations/list` — All conversations

---

## 👨‍💻 Team

- **Member 1** — 2501029 — Dipak Chavan  
- **Member 2** — 2501055 — Pratik Garad

**Institute**: Maharashtra Education Society's IMCC, Pune (Autonomous)  
**Program**: MCA – SEM I | A.Y. 2025-26
