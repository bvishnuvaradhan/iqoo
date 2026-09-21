# Nexora

Nexora is a full-stack application designed to capture images, analyze them using Groq AI, and contextually match them against a user's academic database. It also features a connected workspace that seamlessly syncs data across devices (e.g., mobile app and laptop dashboard).

## Key Features

- **Smart Capture & Analysis:** Take a picture and have Groq AI process the image to understand its context (e.g., recognizing handwritten notes or textbook pages).
- **Academic Context Matching:** Automatically links recognized content to your academic subjects, modules, and topics.
- **AI Planning & Recommendations:** Generates study plans and recommendations based on the analyzed context.
- **Multi-Device Synchronization:** Real-time data synchronization between the mobile view and laptop dashboard using Socket.io.
- **Project & Workspace Management:** Keeps track of academic projects and provides a connected workspace.

## Tech Stack

### Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Real-time:** Socket.io-client

### Backend
- **Framework:** Node.js with Express
- **AI Integration:** Groq API (via fetch)
- **Database:** MongoDB (via Mongoose)
- **File Uploads:** Multer (memory storage for images/JSON)
- **Real-time:** Socket.io

## Prerequisites

- Node.js (v18 or higher recommended)
- A Groq API Key
- MongoDB instance (Local or Atlas)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/koushik-24k/iqoo.git
cd iqoo
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (copy from `.env.example`):
```bash
cp .env.example .env
```
Inside `.env`, configure your settings:
```env
PORT=8000
MONGODB_URI=mongodb://127.0.0.1:27017/nexora
MONGODB_DB_NAME=nexora
FRONTEND_URL=http://localhost:5173
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_VISION_MODEL=llama-3.2-11b-vision-preview
```

Seed the MongoDB database:
```bash
node seed.js
```

Start the backend server:
```bash
npm start
# or 'node index.js'
```

### 3. Frontend Setup

In a new terminal window, navigate to the root directory:

```bash
npm install
```

Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8000
```

Start the development server:
```bash
npm run dev
```

## Deployment Considerations

### MongoDB Atlas Setup
If you are deploying to production, replace `MONGODB_URI` with your MongoDB Atlas connection string:
`mongodb+srv://<username>:<password>@cluster.mongodb.net/nexora?retryWrites=true&w=majority`

### Socket.IO and CORS
The backend expects `FRONTEND_URL` in the environment to strictly enforce CORS for both Express and Socket.IO.
When deploying the frontend, ensure `VITE_API_URL` is set to the backend's production URL so it does not default to localhost.

### Health Check
You can verify backend and database connection status via the `/api/health` endpoint.

## Troubleshooting

- **MongoDB connection refused:** Ensure your local MongoDB daemon (`mongod`) is running, or verify your Atlas IP whitelist.
- **Socket.IO not connecting:** Verify `VITE_API_URL` exactly matches the backend domain, including `http/https`.
- **AI Analysis fails:** Check that your `GROQ_API_KEY` is valid and the selected models (`GROQ_MODEL`, `GROQ_VISION_MODEL`) are currently available on Groq's platform.
