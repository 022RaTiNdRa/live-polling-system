# Live Polling System

A full-stack real-time classroom polling platform that enables teachers to create live polls and students to vote instantly with real-time updates.

Built with React (Vite), TypeScript, Node.js, Socket.IO, and MongoDB Atlas.

---

## 🚀 Features

- Real-time poll creation and voting
- Live vote percentage updates
- Teacher and student roles
- WebSocket-based communication (Socket.IO)
- MongoDB Atlas integration
- Production-ready TypeScript setup
- Deployed frontend and backend

---

## 🏗 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Socket.IO Client

### Backend
- Node.js
- Express
- TypeScript
- Socket.IO
- MongoDB (Mongoose)

### Deployment
- Frontend: Render (Static Site)
- Backend: Render (Web Service)
- Database: MongoDB Atlas

---

## 🌐 Live Demo

Frontend:  
https://live-polling-system-pgkw.onrender.com

Backend:  
https://live-polling-backend-57nb.onrender.com

---

## 📂 Project Structure

```
live-polling-system/
│
├── client/      # Frontend (React + Vite)
├── server/      # Backend (Express + Socket.IO)
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=*
```

### Frontend (.env.production)

```
VITE_SERVER_URL=https://your-backend-url
```

---

## 🛠 Local Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/022RaTiNdRa/live-polling-system.git
cd live-polling-system
```

### 2️⃣ Install Dependencies

Frontend:

```
cd client
npm install
```

Backend:

```
cd server
npm install
```

### 3️⃣ Run Backend

```
npm run dev
```

### 4️⃣ Run Frontend

```
npm run dev
```

---

## 📌 Future Improvements

- Authentication system
- Poll history persistence UI
- Role-based access control
- Better error handling
- UI improvements

---

## 📄 License

MIT
