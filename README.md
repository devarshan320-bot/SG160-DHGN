# AI-Powered Food & Resource Redistribution Platform

### SG160-DHGN | Hackathon Project

## Team & Contribution

Developed collaboratively as part of a 4-member hackathon team. Contributed to the overall design, development, integration, testing, and deployment of the full-stack application.

## 🚀 Quick Start

### Backend
```bash
cd backend
cp .env.example .env   # fill in your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

### Frontend
```bash
# from project root
npm install
npm run dev
```

---

## 🌍 Production Deployment

| Layer | Platform | Guide |
|-------|----------|-------|
| Database | MongoDB Atlas | Create free M0 cluster, whitelist `0.0.0.0/0` |
| Backend | Render | Connect repo, set root dir = `backend`, add env vars |
| Frontend | Vercel | Connect repo, set `VITE_API_URL` = your Render URL |

### Required Environment Variables

**Backend (Render)**
```
MONGO_URI       = mongodb+srv://...
JWT_SECRET      = <random 64-char string>
ALLOWED_ORIGINS = https://your-app.vercel.app
PORT            = 5000
```

**Frontend (Vercel)**
```
VITE_API_URL = https://your-backend.onrender.com
```

---

## 🔑 Demo Login Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@feedlink.ai | password123 | Admin |
| hotel@taj.com | password123 | Donor |
| ngo@hope.org | password123 | NGO |
| volunteer@rescue.in | password123 | Volunteer |

---

## 📦 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Recharts, Socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.io, JWT
- **Deployment:** Vercel (frontend) + Render (backend) + MongoDB Atlas
