# Nexora – Detailed Project Summary

## 1. Project Overview

**Nexora** (formerly known as ContextAI) is an intelligent, multi-device academic productivity platform tailored for students. It seamlessly connects a mobile-first information capture interface with a comprehensive laptop dashboard. By leveraging AI to understand unstructured data (like photos of schedules, handwritten notes, or Telegram chat exports), Nexora automatically builds, verifies, and synchronizes a student's academic context in real-time.

**Taglines:**
- *Next action + connected academic intelligence*
- *Connect the dots. Take the next step.*

---

## 2. Core Features & Capabilities

### 📸 AI Perception Engine (Mobile)
- Users can capture photos of syllabus changes, whiteboard notes, or exam schedules via the mobile interface.
- Powered by the **Groq API** (`llama-3.2-11b-vision-preview`), the engine extracts structural academic data directly from images.

### 💬 Telegram Academic Import
- Students often receive crucial academic updates via messy Telegram class groups.
- Nexora accepts JSON exports of Telegram chats and uses Groq (`llama-3.3-70b-versatile`) to filter the noise and extract actionable academic events (e.g., "Assignment 3 moved to Friday").

### 🧠 Intelligent Verification Engine
Extracted information is cross-referenced against the student's existing SQLite academic database. The Verification Engine categorizes incoming data into 5 distinct states:
- **NEW:** Completely new context/topic.
- **DUPLICATE:** The event already exists in the calendar.
- **UPDATE:** An existing event was modified (e.g., postponed deadlines).
- **CONFLICT:** Conflicting dates or requirements that require manual resolution.
- **UNCERTAIN:** Low confidence AI extraction requiring human review.

### 💻 Connected Desktop Workspace (Laptop)
- Real-time synchronization powered by **Socket.IO**.
- **Dashboard Overview:** Features an interactive Recharts-based Radar chart (Spider chart) to visualize cumulative academic progress across subjects.
- **Project Tasks:** Interactive task management where students can check/uncheck project milestones, automatically recalculating project progress.
- **Shared Capabilities:** Live device pairing with a simple 4-digit code. Includes a shared clipboard and real-time syncing of UI states.

---

## 3. Tech Stack

### Frontend Architecture
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (Dark theme heavily utilizing glassmorphism and modern UI components)
- **Animations:** Framer Motion (Page transitions, staggering lists, active sync visualizers)
- **Icons:** Lucide React
- **Data Visualization:** Recharts (Interactive Radar charts for progress overview)
- **Networking:** Socket.IO Client for real-time bidirectional communication.

### Backend Architecture
- **Runtime:** Node.js with Express
- **Database:** SQLite (Relational DB managing `students`, `subjects`, `topics`, `projects`, and `project_tasks`)
- **AI Integration:** Groq API (using native `fetch`) for LLM and Vision tasks.
- **File Parsing:** Multer for in-memory file uploads (images & JSON).
- **Real-Time Layer:** Socket.IO Server managing isolated pairing rooms (`CONTEXT-XXXX`) for secure device-to-device streaming.

---

## 4. Key Architectural Flows

### The Pairing Flow
1. The **Mobile Phone** initiates pairing, requesting a room code (`CONTEXT-1234`).
2. The Node server assigns the code, puts the mobile socket in that room, and broadcasts it back to the phone.
3. The user types `1234` on the **Laptop Dashboard**.
4. The laptop joins the Socket room. A `DEVICE_CONNECTED` event is emitted.
5. Both devices instantly update their UIs to reflect the active sync (`PAIRED`).

### The Information Pipeline
1. **Input:** Image captured or JSON uploaded.
2. **Perception:** Groq vision/language model returns structured JSON.
3. **Context Engine:** Searches existing database for text overlap.
4. **Verification:** Compares Perception vs Context, applying heuristics to yield the Verification State (Update, Duplicate, etc.).
5. **Database Update:** Once approved by the user, the database is mutated.
6. **Live Sync:** The backend emits a Socket payload to instantly update the laptop dashboard without a browser refresh.

---

## 5. Environment & Setup

The backend relies on environment variables defined in a `.env` file to handle API access securely.

**Required `.env` Variables (Backend):**
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
PORT=8000
```

**Bootstrapping the Environment:**
1. Install dependencies across both `backend/` and `/`.
2. Generate base dummy data by running `node backend/seed.js`.
3. Start the Node API (`node backend/index.js`).
4. Start the Vite Frontend (`npm run dev`).

*This document was auto-generated to provide a comprehensive structural understanding of the Nexora ecosystem.*
