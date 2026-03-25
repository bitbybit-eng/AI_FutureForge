# AI FutureForge - Project Working Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [API Reference](#7-api-reference)
8. [Module Details](#8-module-details)
9. [Database Schema](#9-database-schema)
10. [Setup & Installation](#10-setup--installation)
11. [Running the Application](#11-running-the-application)
12. [Configuration](#12-configuration)

---

## 1. Project Overview

**AI FutureForge** is a full-stack AI-powered life navigation system that helps users make informed career and life decisions using local LLM (Ollama).

### Core Features

| Module | Description |
|--------|-------------|
| **Simulate** | Dual-path life trajectory modeling - current vs optimized future |
| **Battle** | AI-powered decision engine comparing two options with multi-criteria analysis |
| **Skill Gap** | Precision skill gap analyzer for target roles |
| **Roadmap** | AI-generated personalized transformation roadmaps |
| **Mentor** | Streaming AI chat with customizable mentor personas |

### Key Characteristics

- **Sci-fi terminal aesthetic** UI with cyan/purple theme
- **Local AI processing** via Ollama (no cloud dependency)
- **WebSocket streaming** for real-time AI responses
- **JSON-based persistence** for data storage
- **No authentication** for simplicity

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐               │
│  │   React     │  │   Zustand   │  │   Tailwind  │               │
│  │   Router    │  │   Stores    │  │   CSS       │               │
│  └──────┬──────┘  └──────┬──────┘  └─────────────┘               │
│         │                │                                       │
│         └────────┬───────┘                                       │
│                  │                                               │
│         ┌────────▼────────┐                                      │
│         │   Axios API     │◄──── HTTP REST                       │
│         │   Client        │◄──── WebSocket                       │
│         └────────┬────────┘                                      │
└──────────────────┼───────────────────────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   Express.js API    │
        │   (Port 3001)       │
        │                     │
        │  ┌─────────────────┐│
        │  │  Routes         ││
        │  │  /api/profile   ││
        │  │  /api/simulate  ││
        │  │  /api/battle    ││
        │  │  /api/gap       ││
        │  │  /api/roadmap   ││
        │  │  /api/mentor    ││
        │  └─────────────────┘│
        │                     │
        │  ┌─────────────────┐│
        │  │  Services       ││
        │  │  ollama.js      ││
        │  │  db.js          ││
        │  │  prompts.js     ││
        │  │  scoring.js     ││
        │  └─────────────────┘│
        └──────────┬──────────┘
                   │
      ┌────────────┼────────────┐
      │            │            │
      ▼            ▼            ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  JSON    │ │ Ollama   │ │ WebSocket│
│  Files   │ │ LLM API  │ │ Clients  │
│ (Data)   │ │(Remote)  │ │(Browser) │
└──────────┘ └──────────┘ └──────────┘
```

### Data Flow

1. **User Input** → React Component → Zustand Store
2. **API Call** → Axios → Express REST API
3. **LLM Processing** → Ollama Service → JSON Response
4. **Fallback Logic** → Local algorithms when Ollama unavailable
5. **Persistence** → JSON file storage
6. **Real-time** → WebSocket for streaming responses

---

## 3. Technology Stack

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v25+ | Runtime environment |
| Express.js | ^4.18.2 | REST API framework |
| ws | ^8.16.0 | WebSocket server |
| cors | ^2.8.5 | Cross-origin resource sharing |

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^18.2.0 | UI framework |
| Vite | ^5.0.0 | Build tool |
| React Router | ^6.20.0 | Client-side routing |
| Zustand | ^4.4.0 | State management |
| Axios | ^1.6.0 | HTTP client |
| Tailwind CSS | ^3.3.6 | Styling |
| PostCSS | ^8.4.32 | CSS processing |

### External Services

| Service | Protocol | Purpose |
|---------|----------|---------|
| Ollama | HTTP | Local LLM inference (llama3.2:3b) |

---

## 4. Project Structure

```
forge/
├── README.md                    # Quick start guide
├── ARCHITECTURE.md              # Architecture diagrams
├── WORKING.md                   # This documentation
│
├── backend/                     # Express.js API Server
│   ├── package.json
│   └── src/
│       ├── index.js            # Main entry point (server + routes)
│       ├── services/
│       │   ├── db.js           # JSON file database
│       │   ├── ollama.js      # Ollama API wrapper
│       │   └── prompts.js     # LLM prompt templates
│       └── utils/
│           └── scoring.js      # Readiness algorithms
│
├── frontend/                    # React + Vite Frontend
│   ├── package.json
│   ├── vite.config.js          # Vite configuration with proxy
│   ├── tailwind.config.js      # Custom theme colors/fonts
│   ├── postcss.config.js
│   ├── index.html
│   ├── .env                    # Environment variables
│   ├── public/
│   │   └── forge.svg          # App icon
│   └── src/
│       ├── main.jsx            # Entry point
│       ├── App.jsx             # Main app component
│       ├── index.css           # Global styles + animations
│       ├── lib/
│       │   └── api.js         # Axios client + WebSocket
│       ├── stores/
│       │   └── index.js       # Zustand stores
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── Nav.jsx
│       │   ├── ParticleBackground.jsx
│       │   ├── ScoreRing.jsx
│       │   └── LoadingOverlay.jsx
│       └── pages/
│           ├── Simulate.jsx
│           ├── Battle.jsx
│           ├── SkillGap.jsx
│           ├── Roadmap.jsx
│           └── Mentor.jsx
│
└── data/                       # JSON database files (auto-created)
    ├── profiles.json
    ├── simulations.json
    ├── battles.json
    ├── roadmaps.json
    ├── chat_sessions.json
    └── settings.json
```

---

## 5. Backend Implementation

### 5.1 Server Entry Point (`backend/src/index.js`)

**Responsibilities:**
- Initialize Express app with CORS and JSON middleware
- Create HTTP server and WebSocket server
- Define all API routes
- Implement fallback responses for when Ollama is unavailable
- Start server on configured port

**Key Configuration:**
```javascript
const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://192.168.43.139:11434';
```

### 5.2 Ollama Service (`backend/src/services/ollama.js`)

**Functions:**

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `callOllama` | prompt, systemPrompt, baseUrl, model | JSON | Non-streaming LLM call |
| `streamOllama` | prompt, systemPrompt, ws, baseUrl, model | void | Streaming LLM to WebSocket |
| `checkOllamaHealth` | baseUrl | Object | Check if Ollama is reachable |
| `getOllamaModels` | baseUrl | Array | List available models |
| `pullModel` | model, baseUrl, onProgress | Object | Pull a model (with progress callback) |

**Default Model:** `llama3.2:3b`

**Request Options:**
```javascript
{
  temperature: 0.7,
  num_predict: 2048,
  top_p: 0.9,
  repeat_penalty: 1.1
}
```

### 5.3 Database Service (`backend/src/services/db.js`)

**Architecture:**
- In-memory cache loaded from JSON files at startup
- Auto-save on every write operation
- Automatic ID counters per collection

**Collections:**

| Collection | File | Operations |
|------------|------|------------|
| profiles | profiles.json | getLatest, create, update |
| simulations | simulations.json | getAll, create, getById |
| battles | battles.json | getAll, create |
| roadmaps | roadmaps.json | getAll, create |
| chatSessions | chat_sessions.json | getAll, create |
| settings | settings.json | get, set |

### 5.4 Prompt Templates (`backend/src/services/prompts.js`)

**Template Functions:**

| Function | Output Format | Purpose |
|----------|----------------|---------|
| `generateSimulationPrompt` | JSON | Life trajectory simulation |
| `generateBattlePrompt` | JSON | Decision comparison |
| `generateGapPrompt` | JSON | Skill gap analysis |
| `generateRoadmapPrompt` | JSON | Transformation roadmap |
| `getMentorSystemPrompt` | String | System prompt for chat |

**Mentor Personas:**
- Career Coach
- Life Coach
- Startup Mentor
- Academic Advisor
- Mindset Coach

### 5.5 Scoring Utilities (`backend/src/utils/scoring.js`)

**Score Calculation:**

```javascript
calculateReadinessScore({ age, gpa, skills, habits })
// Base: 50, Max: 100
// Factors: Age (optimal 18-25: +10), GPA (+5 to +15), Skills (+5 to +20), Habits (+5 to -5)
```

**Personality Types:**
- Builder (entrepreneurial traits)
- Analyst (data/research traits)
- Creator (design/creative traits)
- Leader (management traits)
- Specialist (technical/engineering traits)

---

## 6. Frontend Implementation

### 6.1 State Management (Zustand)

**Stores (`frontend/src/stores/index.js`):**

```javascript
// App Store - Global app state
{
  activeModule: 'SIMULATE',  // Current page
  setActiveModule: fn,
  ollamaStatus: { connected: true, models: [...] },
  setOllamaStatus: fn
}

// User Store - User data
{
  profile: {...},           // Current user profile
  simulations: [...],       // Simulation history
  battles: [...],           // Battle history
  roadmaps: [...],           // Roadmap history
  addSimulation: fn,
  addBattle: fn,
  addRoadmap: fn
}
```

### 6.2 Components

| Component | Purpose |
|-----------|---------|
| `Header` | App logo, tagline, Ollama status indicator |
| `Nav` | Module navigation tabs |
| `ParticleBackground` | Animated particle effect background |
| `ScoreRing` | Circular score visualization (SVG) |
| `LoadingOverlay` | Step-by-step loading animation |

### 6.3 Pages

| Page | File | Color | Steps |
|------|------|-------|-------|
| Simulate | Simulate.jsx | Cyan (#00f5ff) | 5-step simulation |
| Battle | Battle.jsx | Orange (#ff6b35) | 5-step comparison |
| SkillGap | SkillGap.jsx | Purple (#a855f7) | Gap analysis |
| Roadmap | Roadmap.jsx | Green (#22c55e) | Roadmap generation |
| Mentor | Mentor.jsx | Yellow (#f59e0b) | Streaming chat |

### 6.4 API Client (`frontend/src/lib/api.js`)

**Endpoints Mapping:**

```javascript
// Base URLs from environment
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_BASE = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// REST Endpoints
checkHealth()              // GET /api/health
getOllamaStatus()          // GET /api/ollama/status
getProfile()               // GET /api/profile
updateProfile(data)        // PUT /api/profile
runSimulation(data)        // POST /api/simulate
getSimHistory()            // GET /api/simulate/history
runBattle(data)            // POST /api/battle
getBattleHistory()         // GET /api/battle/history
runGapAnalysis(data)       // POST /api/gap
generateRoadmap(data)      // POST /api/roadmap
getRoadmapHistory()        // GET /api/roadmap/history
sendMentorMessage(data)    // POST /api/mentor/chat
saveChatSession(data)      // POST /api/mentor/session
getChatSessions()          // GET /api/mentor/sessions

// WebSocket
createMentorStream(onMessage, onError)  // Streaming chat
```

### 6.5 Styling

**Tailwind Custom Theme:**

```javascript
// Colors
forge-bg: '#0a0a0f'           // Background
forge-cyan: '#00f5ff'          // Primary cyan
forge-orange: '#ff6b35'        // Secondary orange
forge-purple: '#a855f7'        // Accent purple
forge-green: '#22c55e'         // Success green

// Fonts
font-orbitron: 'Orbitron'      // Headers
font-mono: 'JetBrains Mono'     // Body text
```

**Custom Animations:**
- `fade-in` - Content appearance
- `shimmer` - Loading effect
- `scanline` - CRT scanline effect
- `pulse` - Subtle glow animation

---

## 7. API Reference

### 7.1 Health & Status

#### GET /api/health
Check server and Ollama health.

**Response:**
```json
{
  "status": "ok",
  "ollama": {
    "status": "connected",
    "models": [...]
  },
  "timestamp": "2026-03-25T09:34:35.455Z"
}
```

#### GET /api/ollama/status
Get Ollama connection status and available models.

**Response:**
```json
{
  "connected": true,
  "models": [
    {
      "name": "llama3.2:3b",
      "size": 2019393189,
      "modified": "2026-03-25T12:16:48.584Z"
    }
  ],
  "url": "http://192.168.43.139:11434"
}
```

### 7.2 Profile

#### GET /api/profile
Get the latest user profile.

#### PUT /api/profile
Create or update user profile.

**Request Body:**
```json
{
  "name": "Alex Chen",
  "age": 21,
  "field": "Computer Science",
  "gpa": "3.4",
  "skills": "Python, JavaScript, SQL",
  "habits": "Study 2h daily, gym 3x/week",
  "goal": "Senior ML Engineer",
  "industry": "Technology"
}
```

### 7.3 Simulation

#### POST /api/simulate
Run life trajectory simulation.

**Request Body:**
```json
{
  "name": "Alex",
  "age": 21,
  "field": "CS",
  "gpa": "3.4",
  "skills": "Python, JavaScript",
  "habits": "Study, gym",
  "goal": "Senior ML Engineer"
}
```

**Response:**
```json
{
  "id": 1,
  "readiness_score": 72,
  "success_prob": 68,
  "improved_prob": 85,
  "personality_type": "Builder",
  "key_insight": "...",
  "current_path": "...",
  "improved_path": "...",
  "strengths": [...],
  "risks": [...],
  "action": "..."
}
```

### 7.4 Battle

#### POST /api/battle
Compare two options with AI analysis.

**Request Body:**
```json
{
  "choiceA": "Startup job",
  "choiceB": "FAANG job",
  "prosA": "Fast growth, equity",
  "consA": "High risk, long hours",
  "prosB": "Stable, good benefits",
  "consB": "Slower promotion",
  "context": "Career growth",
  "priority": "Balanced",
  "timelineA": "Immediate",
  "timelineB": "3-6 months"
}
```

**Response:**
```json
{
  "id": 1,
  "winner": "A",
  "confidence": 78,
  "criteria": [
    {"name": "Long-Term Growth", "a": 8, "b": 7}
  ],
  "reasoning": "...",
  "hybrid": "Consider starting with B, then transition..."
}
```

### 7.5 Gap Analysis

#### POST /api/gap
Analyze skill gaps for target role.

**Request Body:**
```json
{
  "role": "Senior Software Engineer",
  "industry": "Technology",
  "skills": "Python, React, Git",
  "experience": "3 years"
}
```

### 7.6 Roadmap

#### POST /api/roadmap
Generate personalized transformation roadmap.

**Request Body:**
```json
{
  "goal": "Become Full Stack Developer",
  "timeline": "6 months",
  "style": "Structured",
  "background": "Frontend basics"
}
```

### 7.7 Mentor Chat

#### POST /api/mentor/chat
Send message to AI mentor (non-streaming).

**Request Body:**
```json
{
  "message": "How do I switch careers?",
  "persona": "Career Coach",
  "history": [
    {"role": "user", "content": "Hi"},
    {"role": "assistant", "content": "Hello!"}
  ]
}
```

**Response:**
```json
{
  "response": "To switch careers successfully..."
}
```

#### WebSocket: MENTOR_STREAM
Stream AI responses in real-time.

**Send:**
```json
{
  "type": "MENTOR_STREAM",
  "payload": {
    "sessionId": "abc123",
    "prompt": "How do I switch careers?",
    "persona": "Career Coach",
    "history": [...]
  }
}
```

**Receive tokens:**
```json
{"type": "TOKEN", "content": "To", "done": false}
{"type": "TOKEN", "content": " switch", "done": false}
{"type": "DONE", "sessionId": "abc123"}
```

---

## 8. Module Details

### 8.1 SIMULATE Module

**Purpose:** Dual-path life trajectory modeling

**Input Fields:**
- Name (required)
- Age
- Field/Domain (required)
- Academic Performance (GPA)
- Current Skills (required, comma-separated)
- Daily Habits & Routine
- Life Goal (required, specific)

**Processing Steps:**
1. Parse user profile
2. Calculate readiness score locally
3. Generate simulation prompt for Ollama
4. Parse AI response or use fallback
5. Save to database

**Output:**
- Readiness Score (0-100)
- Current Success % (with current trajectory)
- Optimized Success % (with improvements)
- Personality Type
- Key Insight
- Current Path Description
- Optimized Path Description
- Top Strengths (3)
- Risk Factors (3)
- Critical Action (this week)

### 8.2 BATTLE Module

**Purpose:** Compare two life/career options

**Input Fields (per option):**
- Title
- Pros
- Cons
- Timeline

**Additional Inputs:**
- Context/Goals
- Optimization Priority

**Processing:**
1. Generate multi-criteria comparison prompt
2. Score 8 criteria for each option
3. Calculate confidence level
4. Generate hybrid recommendation

**Output:**
- Winner (A or B)
- Confidence Level (%)
- 8-Criteria Breakdown with bar charts
- Reasoning
- Hybrid Strategy

### 8.3 SKILL GAP Module

**Purpose:** Identify gaps between current skills and target role

**Input Fields:**
- Target Role
- Industry
- Current Skills
- Experience Level

**Output:**
- Overall Readiness Score
- Gap Severity (Critical/Moderate/Minor)
- Missing Skills with:
  - Category (Technical/Soft/Domain)
  - Importance
  - Time to Learn
  - Free Resource
  - Demand Score
- Existing Strengths
- Quick Wins
- Learning Path
- Salary Impact Estimate

### 8.4 ROADMAP Module

**Purpose:** Generate personalized transformation plan

**Input Fields:**
- Goal
- Timeline (e.g., "6 months")
- Learning Style
- Background

**Output:**
- Title
- Summary
- Phases (4 default):
  - Foundation Sprint
  - Skill Deepening
  - Advanced Focus
  - Job Push
- Daily Habits with duration and rationale
- Weekly Targets
- Success Metrics
- Motivational Quote
- Warning Sign

### 8.5 MENTOR Module

**Purpose:** Streaming AI chat with mentor personas

**Features:**
- 5 Mentor Personas
- Real-time streaming responses
- Conversation history
- Session persistence

**Persona Descriptions:**
| Persona | Style |
|---------|-------|
| Career Coach | Strategic, action-focused, direct |
| Life Coach | Empathetic, transformational |
| Startup Mentor | Bold, honest, execution-focused |
| Academic Advisor | Informative, encouraging |
| Mindset Coach | Motivating, resilient |

---

## 9. Database Schema

### profiles.json
```json
[
  {
    "id": 1,
    "name": "Alex Chen",
    "age": 21,
    "field": "Computer Science",
    "gpa": 3.4,
    "skills": ["Python", "JavaScript", "SQL"],
    "habits": "Study 2h daily, gym 3x",
    "goal": "Senior ML Engineer",
    "industry": "Technology",
    "created_at": "2026-03-25T09:00:00.000Z",
    "updated_at": "2026-03-25T09:00:00.000Z"
  }
]
```

### simulations.json
```json
[
  {
    "id": 1,
    "name": "Alex",
    "field": "CS",
    "goal": "Senior ML Engineer",
    "readiness_score": 72,
    "success_prob": 68,
    "improved_prob": 85,
    "personality_type": "Builder",
    "key_insight": "...",
    "current_path": "...",
    "improved_path": "...",
    "strengths": [...],
    "risks": [...],
    "action": "...",
    "created_at": "2026-03-25T09:00:00.000Z"
  }
]
```

### battles.json
```json
[
  {
    "id": 1,
    "choice_a": "Startup job",
    "choice_b": "FAANG job",
    "context": "Career growth",
    "priority": "Balanced",
    "winner": "A",
    "confidence": 78,
    "criteria": [...],
    "reasoning": "...",
    "hybrid": "...",
    "created_at": "2026-03-25T09:00:00.000Z"
  }
]
```

### roadmaps.json
```json
[
  {
    "id": 1,
    "goal": "Full Stack Developer",
    "timeline": "6 months",
    "style": "Structured",
    "phases": [...],
    "daily_habits": [...],
    "weekly_targets": [...],
    "metrics": [...],
    "warning": "...",
    "quote": "...",
    "title": "Full Stack Transformation",
    "created_at": "2026-03-25T09:00:00.000Z"
  }
]
```

### chat_sessions.json
```json
[
  {
    "id": 1,
    "messages": [
      {"role": "user", "content": "Hi"},
      {"role": "assistant", "content": "Hello! How can I help?"}
    ],
    "persona": "Career Coach",
    "created_at": "2026-03-25T09:00:00.000Z"
  }
]
```

---

## 10. Setup & Installation

### Prerequisites

1. **Node.js** v18+ (with npm)
2. **Ollama** installed on a remote machine with `llama3.2:3b` model

### Steps

1. **Clone or extract project:**
   ```bash
   cd forge
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure Ollama URL:**
   
   Edit `backend/src/index.js` or set environment variable:
   ```bash
   set OLLAMA_URL=http://192.168.43.139:11434
   ```
   
   For remote Ollama, ensure:
   - Ollama is running
   - `llama3.2:3b` model is pulled
   - Network is accessible

5. **Optional: Configure frontend environment**
   
   Edit `frontend/.env`:
   ```
   VITE_API_URL=http://localhost:3001/api
   VITE_WS_URL=ws://localhost:3001
   ```

---

## 11. Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

**Output:**
```
╔═══════════════════════════════════════════════════════╗
║   🤖 AI FUTUREFORGE BACKEND v1.0                     ║
║   Server running on: http://localhost:3001            ║
║   WebSocket on: ws://localhost:3001                  ║
║   Ollama URL: http://192.168.43.139:11434            ║
╚═══════════════════════════════════════════════════════╝
```

### Start Frontend

```bash
cd frontend
npm run dev
```

**Output:**
```
  VITE v5.4.21  ready in 810 ms
  ➜  Local:   http://localhost:5173/
```

### Access Application

Open browser: **http://localhost:5173**

---

## 12. Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Backend server port |
| `OLLAMA_URL` | http://192.168.43.139:11434 | Ollama server URL |

### Vite Configuration

```javascript
// frontend/vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

### Ollama Model Configuration

Default model: `llama3.2:3b`

To use a different model, update:
- `backend/src/index.js` - All `callOllama()` calls
- `backend/src/services/ollama.js` - Default model parameter

### Adding New Mentor Personas

Edit `backend/src/services/prompts.js`:

```javascript
export function getMentorSystemPrompt(persona) {
  const personas = {
    // ... existing personas ...
    'New Persona': `You are a ...`,
  };
  return personas[persona] || personas['Career Coach'];
}
```

---

## Troubleshooting

### Ollama Connection Issues

1. Check Ollama is running on remote machine
2. Verify network connectivity
3. Test: `curl http://OLLAMA_IP:11434/api/tags`
4. Check firewall settings

### Port Already in Use

```bash
# Windows - Find process using port 3001
netstat -ano | findstr :3001

# Kill process
taskkill /PID <process_id> /F
```

### Node Not in PATH

Use full path:
```bash
"C:/Program Files/nodejs/node.exe" backend/src/index.js
```

### Frontend Build Errors

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## Future Enhancements

1. **Authentication** - User accounts and profiles
2. **Database** - PostgreSQL/SQLite for production
3. **More Models** - Support additional Ollama models
4. **Export** - PDF/JSON export for roadmaps
5. **Progress Tracking** - Track completion of roadmap tasks
6. **Mobile** - Responsive design improvements
7. **Themes** - Dark/light mode toggle
8. **History** - Full history view across all modules
