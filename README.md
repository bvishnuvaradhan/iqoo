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
- **Routing:** React Router DOM
- **Real-time:** Socket.io-client

### Backend
- **Framework:** Node.js with Express
- **AI Integration:** Groq API (via fetch)
- **Database:** SQLite
- **File Uploads:** Multer (memory storage for images/JSON)
- **Real-time:** Socket.io

## Prerequisites

- Node.js (v18 or higher recommended)
- A Groq API Key

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

Create a `.env` file in the `backend` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
```

Seed the database and start the server:
```bash
node seed.js
node index.js
```
The backend server will run on `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal window/tab:
```bash
# From the root of the project (iqoo directory)
npm install
npm run dev
```
The frontend development server will usually start on `http://localhost:5173`. 

## Project Structure

- `/backend`: Contains the Express server, SQLite database logic, Groq AI integration services (`perceptionService`, `contextService`), and real-time syncing (`deviceSyncService`).
- `/src`: Contains the React frontend code.
  - `/components`: Reusable UI components.
  - `/screens`: Main page views (HomeScreen, CaptureScreen, LaptopDashboard, etc.).
  - `/context`: React context providers for global state.
