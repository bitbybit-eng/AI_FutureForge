# AI FutureForge - System Architecture

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃                           AI FUTUREFORGE - FULL STACK                              ┃
┃                        Life Navigation System v3.0                                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

                              ┌─────────────────────────────────────┐
                              │          USER INTERFACE              │
                              │         (React + Tailwind)            │
                              │                                      │
                              │  ┌───────┬───────┬────────┬───────┐  │
                              │  │Simulate│Battle │SkillGap│Roadmap│  │
                              │  └───┬───┴───┬───┴────────┴───────┘  │
                              │      │       │                       │
                              │      │   ┌────────┐                  │
                              │      │   │Mentor │                  │
                              │      │   └───┬────┘                  │
                              └──────┼───────┼───────────────────────┘
                                     │       │
                              ┌──────▼──────▼──────┐
                              │    AXIOS API CLIENT │
                              │  (src/lib/api.js)   │
                              │                     │
                              │  - REST calls       │
                              │  - WebSocket conn   │
                              └──────────┬──────────┘
                                         │
                              ┌──────────▼──────────┐
                              │   EXPRESS SERVER    │
                              │   localhost:3001   │
                              │                    │
                              │  ┌──────────────┐  │
                              │  │   CORS       │  │
                              │  │  Middleware  │  │
                              │  └──────────────┘  │
                              │                    │
                              │  ┌────────────────▼────────────────┐
                              │  │           API ROUTES            │
                              │  ├────────────────────────────────┤
                              │  │ POST /api/simulate             │
                              │  │ POST /api/battle               │
                              │  │ POST /api/gap                 │
                              │  │ POST /api/roadmap              │
                              │  │ POST /api/mentor/chat          │
                              │  │ WS  / (WebSocket)             │
                              │  └────────────────────────────────┘
                              └─────────────────┬──────────────────┘
                                                │
                        ┌───────────────────────┼───────────────────────┐
                        │                       │                       │
               ┌────────▼────────┐    ┌────────▼────────┐    ┌────────▼────────┐
               │   OLLAMA LLM   │    │  JSON DATABASE│    │  WEBSOCKET     │
               │                │    │                │    │  (Streaming)    │
               │ Model: llama3.2│    │  /data/       │    │                │
               │                │    │  - profiles    │    │ For real-time   │
               │ Remote Machine │    │  - simulations │    │ Mentor chat     │
               │ Port: 11434   │    │  - battles    │    │ responses       │
               │                │    │  - roadmaps   │    │                │
               └────────────────┘    │  - chat_sessions    └────────────────┘
                                     └─────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                           DATA FLOW DIAGRAM

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  USER INPUT                    PROCESSING                      OUTPUT
  ─────────                    ──────────                      ──────

  ┌─────────────┐
  │ Profile     │
  │ Form Data   │────────────────┐
  └─────────────┘                 │
                                 ▼
                    ┌────────────────────────┐
                    │   SIMULATION ENGINE   │
                    │                      │
                    │  1. Calculate Score  │
                    │  2. Build Prompt    │
                    │  3. Call Ollama    │
                    │  4. Parse Response │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   READINESS SCORE   │
                    │   CALCULATION      │
                    │                    │
                    │ score = 50          │
                    │ + age bonus         │
                    │ + gpa bonus        │
                    │ + skills count     │
                    │ + habits bonus     │
                    │ - negative habits  │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │     OLLAMA API      │
                    │                     │
                    │ POST /api/generate   │
                    │                     │
                    │ System: "You are    │
                    │ an expert AI life   │
                    │ simulation..."     │
                    │                     │
                    │ Prompt: Profile    │
                    │ data + goal        │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   PARSE JSON RESPONSE│
                    │                     │
                    │ Extract:            │
                    │ - personalityType  │
                    │ - keyInsight       │
                    │ - currentPath      │
                    │ - improvedPath     │
                    │ - strengths[]     │
                    │ - risks[]         │
                    │ - action          │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   SAVE TO DATABASE   │
                    │                     │
                    │ data/simulations.json│
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │   RENDER RESULTS    │
                    │                     │
                    │ - Score Rings      │
                    │ - Path Cards       │
                    │ - Strengths List   │
                    │ - Action Item     │
                    └─────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                         MODULE FLOW CHARTS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────────────────────────────────┐
  │                        1. SIMULATE MODULE                                │
  └─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ User enters  │ ───▶ │ Click "Run  │ ───▶ │ Show        │
    │ profile data │      │ Simulation" │      │ Loading...   │
    └──────────────┘      └──────────────┘      └──────┬───────┘
                                                        │
                    ┌─────────────────────────────────────▼───────┐
                    │          Backend Processing              │
                    │  ┌────────────┐  ┌────────────┐           │
                    │  │ Calculate │  │ Build LLM  │           │
                    │  │ Score     │  │ Prompt     │           │
                    │  └─────┬──────┘  └─────┬──────┘           │
                    │        │               │                   │
                    │        └───────┬───────┘                   │
                    │                ▼                           │
                    │         ┌──────────────┐                   │
                    │         │ Call Ollama │                   │
                    │         │ /api/generate│                   │
                    │         └─────┬────────┘                   │
                    │               │                          │
                    │               ▼                          │
                    │         ┌──────────────┐                   │
                    │         │ Parse JSON   │                   │
                    │         │ Response    │                   │
                    │         └─────┬────────┘                   │
                    │               │                          │
                    └───────────────┼───────────────────────────┘
                                    │
                    ┌───────────────▼────────────────┐
                    │     Display Results            │
                    │                                │
                    │  ┌────────────────────────┐   │
                    │  │  🎯 Score Rings       │   │
                    │  │  📍 Current Path     │   │
                    │  │  🚀 Optimized Path   │   │
                    │  │  ✅ Strengths       │   │
                    │  │  ⚠️ Risks           │   │
                    │  │  💡 Action Item    │   │
                    │  └────────────────────────┘   │
                    └────────────────────────────────┘


  ┌─────────────────────────────────────────────────────────────────────────┐
  │                         2. BATTLE MODULE                                │
  └─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐
    │ Choice A    │      │ Choice B    │
    │ Card       │  VS  │ Card       │
    └──────┬─────┘      └──────┬─────┘
           │                    │
           └────────┬───────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Click "Battle!"   │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │   Compare 8        │
         │   Criteria:        │
         │   - Growth         │
         │   - Financial      │
         │   - Risk          │
         │   - Alignment     │
         │   - Satisfaction  │
         │   - Timeline      │
         │   - Skills        │
         │   - Reversibility│
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Ollama Decision    │
         │  Analysis          │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  🏆 WINNER PANEL   │
         │                    │
         │  [A] or [B]       │
         │  78% confidence   │
         │                    │
         │  Criteria bars     │
         │  Hybrid strategy   │
         └─────────────────────┘


  ┌─────────────────────────────────────────────────────────────────────────┐
  │                       3. SKILL GAP MODULE                               │
  └─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ Target Role  │ ───▶ │ Current     │ ───▶ │ Analyze     │
    │ Selected    │      │ Skills      │      │ Gaps       │
    └──────────────┘      └──────────────┘      └──────┬───────┘
                                                        │
                    ┌─────────────────────────────────────▼───────┐
                    │          AI Analysis                  │
                    │  ┌────────────┐  ┌────────────┐       │
                    │  │ Identify   │  │ Calculate  │       │
                    │  │ missing    │  │ gap score  │       │
                    │  │ skills    │  │            │       │
                    │  └────────────┘  └────────────┘       │
                    └───────────────────────────────────────┬┘
                                                            │
                    ┌───────────────────────────────────────▼──────┐
                    │         Display Gap Analysis              │
                    │  ┌─────────────────────────────────────┐   │
                    │  │ 📊 Readiness Ring (52%)           │   │
                    │  │                                     │   │
                    │  │ 🔴 Critical Gaps                    │   │
                    │  │ 🟠 High Priority Gaps               │   │
                    │  │ 🟡 Medium Gaps                       │   │
                    │  │                                     │   │
                    │  │ 📚 Learning Path                    │   │
                    │  │ ⏱️ Time Estimate (6-9 months)      │   │
                    │  │ 💰 Salary Impact (+35-50%)         │   │
                    │  └─────────────────────────────────────┘   │
                    └─────────────────────────────────────────┘


  ┌─────────────────────────────────────────────────────────────────────────┐
  │                        4. ROADMAP MODULE                              │
  └─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐
    │ Goal Input   │ ───▶ │ Timeline &  │
    │             │      │ Style       │
    └──────────────┘      └──────┬───────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    AI Roadmap Generation   │
                    │                           │
                    │   Phase 1: Foundation     │
                    │   Phase 2: Deepening     │
                    │   Phase 3: Advanced      │
                    │   Phase 4: Job Push      │
                    └─────────────┬───────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Interactive Phase View   │
                    │                           │
                    │   ┌─ Phase 1 (Open) ─┐   │
                    │   │ Tasks           │   │
                    │   │ Resources      │   │
                    │   │ Checkpoint     │   │
                    │   └─────────────────┘   │
                    │                           │
                    │   ▼ Phase 2             │
                    │   ▼ Phase 3             │
                    │   ▼ Phase 4             │
                    └───────────────────────────┘


  ┌─────────────────────────────────────────────────────────────────────────┐
  │                        5. MENTOR MODULE                                │
  └─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ Select       │ ───▶ │ Choose      │ ───▶ │ Enter      │
    │ Persona      │      │ Quick      │      │ Message    │
    └──────────────┘      │ Prompt     │      └──────┬─────┘
                           └──────────────┘             │
                                                       ▼
                              ┌─────────────────────────────────────┐
                              │         WEBSOCKET STREAMING          │
                              │                                      │
                              │  User Message ──▶ Server ──▶ Ollama │
                              │                    │                │
                              │                    │ (stream)         │
                              │                    ▼                │
                              │              ┌───────────┐            │
                              │              │ Token by  │            │
                              │              │ Token    │            │
                              │              └────┬─────┘            │
                              │                   │                  │
                              │                   ▼                  │
                              │              WebSocket ──▶ Client    │
                              │              (real-time)          │
                              └─────────────────────────────────────┘
                                                       │
                              ┌─────────────────────────────────────┐
                              │         Chat Display               │
                              │                                      │
                              │  ┌──────────────────────────────┐    │
                              │  │ 💬 Typing indicator...     │    │
                              │  │    Response streaming in     │    │
                              │  │    real-time                │    │
                              │  └──────────────────────────────┘    │
                              └─────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                            DATABASE SCHEMA

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  📁 data/
  │
  ├── profiles.json          # User profile data
  │   [
  │     {
  │       "id": 1,
  │       "name": "Alex",
  │       "age": 24,
  │       "field": "Computer Science",
  │       "skills": ["Python", "JavaScript"],
  │       "created_at": "2024-01-15T..."
  │     }
  │   ]
  │
  ├── simulations.json       # Simulation results
  │   [
  │     {
  │       "id": 1,
  │       "readiness_score": 72,
  │       "success_prob": 78,
  │       "improved_prob": 91,
  │       "personality_type": "Builder",
  │       "key_insight": "...",
  │       "strengths": ["..."],
  │       "risks": ["..."]
  │     }
  │   ]
  │
  ├── battles.json          # Decision battle results
  │   [
  │     {
  │       "id": 1,
  │       "choice_a": "Startup",
  │       "choice_b": "FAANG",
  │       "winner": "A",
  │       "confidence": 78,
  │       "criteria": [...]
  │     }
  │   ]
  │
  ├── roadmaps.json         # Generated roadmaps
  │   [
  │     {
  │       "id": 1,
  │       "goal": "Senior Engineer",
  │       "phases": [...],
  │       "daily_habits": [...],
  │       "metrics": [...]
  │     }
  │   ]
  │
  └── chat_sessions.json   # Mentor chat history
      [
        {
          "id": 1,
          "persona": "Career Coach",
          "messages": [
            {"role": "user", "content": "..."},
            {"role": "assistant", "content": "..."}
          ]
        }
      ]


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                          OLLAMA INTEGRATION

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                     HOW OLLAMA CALLS WORK                                  │
  └─────────────────────────────────────────────────────────────────────────────┘

  1. REST API CALL (Standard)
  ─────────────────────────

  Client ──── POST /api/generate ────► Ollama Server
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Model: llama3.2  │
                                    │                 │
                                    │ Temperature: 0.7 │
                                    │ Max tokens: 2048 │
                                    └────────┬────────┘
                                             │
                                             ▼
                                    ┌─────────────────┐
                                    │ JSON Response   │
                                    │ with 'response' │
                                    │ field           │
                                    └────────┬────────┘
                                             │
  Client ◄──── Parse JSON ───────────────┘


  2. WEBSOCKET STREAMING (Real-time)
  ────────────────────────────────────

  Client ──── WebSocket Connect ────► Server
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ Send prompt to  │
                                    │ Ollama (stream) │
                                    └────────┬────────┘
                                             │
                        ┌───────────────────┼───────────────────┐
                        │                   │                   │
                        ▼                   ▼                   ▼
                 ┌───────────┐        ┌───────────┐        ┌───────────┐
                 │ "The"     │        │ "quick"   │        │ "brown"  │  ...
                 │  token    │        │  token    │        │  token   │
                 └─────┬─────┘        └─────┬─────┘        └─────┬─────┘
                       │                  │                   │
                       ▼                  ▼                   ▼
              WebSocket.send ◄───────────────────────────────┘
              to client
                       │
                       ▼
              ┌─────────────────┐
              │ Update chat     │
              │ message in     │
              │ real-time      │
              └─────────────────┘


  3. PROMPT ENGINEERING
  ─────────────────────

  Each module uses structured prompts:

  ┌─────────────────────────────────────────────────────────────────────┐
  │ SIMULATION PROMPT                                                  │
  ├─────────────────────────────────────────────────────────────────────┤
  │ You are an expert AI life simulation engine...                    │
  │                                                                   │
  │ Profile:                                                         │
  │ - Name: Alex                                                     │
  │ - Age: 24                                                        │
  │ - Field: Computer Science                                        │
  │ - Skills: Python, JavaScript, SQL                                 │
  │ - Goal: Senior ML Engineer at Google by 30                        │
  │                                                                   │
  │ Provide JSON with:                                               │
  │ {                                                                │
  │   "personalityType": "...",                                      │
  │   "keyInsight": "...",                                          │
  │   "currentPath": "...",                                         │
  │   "improvedPath": "...",                                        │
  │   "topStrengths": [...],                                        │
  │   "topRisks": [...],                                            │
  │   "criticalAction": "..."                                      │
  │ }                                                                │
  └─────────────────────────────────────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                          FILES & RESPONSIBILITIES

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  BACKEND (Node.js + Express)
  ───────────────────────────

  📄 src/index.js
     └─ Express server setup, all API routes, WebSocket handling
  
  📄 src/services/db.js
     └─ JSON file-based database operations
  
  📄 src/services/ollama.js
     └─ Ollama API wrapper (REST + streaming)
  
  📄 src/services/prompts.js
     └─ LLM prompt templates for all modules
  
  📄 src/utils/scoring.js
     └─ Readiness score calculation algorithms


  FRONTEND (React + Tailwind)
  ────────────────────────────

  📄 src/App.jsx
     └─ Main app, routing between modules
  
  📄 src/pages/Simulate.jsx
     └─ Future simulation form and results
  
  📄 src/pages/Battle.jsx
     └─ Decision battle comparison UI
  
  📄 src/pages/SkillGap.jsx
     └─ Skill gap analysis display
  
  📄 src/pages/Roadmap.jsx
     └─ Roadmap with collapsible phases
  
  📄 src/pages/Mentor.jsx
     └─ AI chat with WebSocket streaming
  
  📄 src/components/Header.jsx
     └─ Header with Ollama status indicator
  
  📄 src/components/Nav.jsx
     └─ Navigation tabs for modules
  
  📄 src/components/ParticleBackground.jsx
     └─ Animated particle canvas effect
  
  📄 src/components/ScoreRing.jsx
     └─ Animated SVG score ring
  
  📄 src/components/LoadingOverlay.jsx
     └─ Step-by-step loading animation
  
  📄 src/stores/index.js
     └─ Zustand state management
  
  📄 src/lib/api.js
     └─ Axios API client


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                         HOW TO RUN (STEP BY STEP)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. START OLLAMA (on remote machine)
  ─────────────────────────────────────
  
  # SSH to your Ollama machine
  ssh user@ollama-server
  
  # Start Ollama
  ollama serve
  
  # Ensure model is available
  ollama list
  # Should show: llama3.2:3b


  2. START BACKEND
  ─────────────────
  
  # Navigate to backend
  cd AI-FutureForge/backend
  
  # Set Ollama URL (replace with actual IP)
  export OLLAMA_URL=http://192.168.1.100:11434
  
  # Install & run
  npm install
  npm run dev
  
  # Output:
  # Server running on: http://localhost:3001
  # WebSocket on: ws://localhost:3001


  3. START FRONTEND
  ──────────────────
  
  # New terminal
  cd AI-FutureForge/frontend
  
  # Install & run
  npm install
  npm run dev
  
  # Output:
  # VITE v5.x.x ready in xxx ms
  # ➜ Local: http://localhost:5173


  4. OPEN IN BROWSER
  ────────────────────
  
  Navigate to: http://localhost:5173
  
  You should see:
  ┌────────────────────────────────────────────┐
  │      🤖 AI FUTUREFORGE                      │
  │      SIMULATE · BATTLE · SKILL GAP · ...   │
  │                                            │
  │      [MODULE CONTENT]                      │
  │                                            │
  └────────────────────────────────────────────┘


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                         ERROR HANDLING & FALLBACKS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  If Ollama is unavailable:
  ──────────────────────────

  The system has built-in fallbacks:

  ┌─────────────────────────────────────────────────────────────────┐
  │                        FALLBACK CHAIN                            │
  ├─────────────────────────────────────────────────────────────────┤
  │                                                                  │
  │  Request ──▶ Ollama ──▶ SUCCESS ──▶ Return response             │
  │     │                │                                           │
  │     │                │ (timeout/error)                           │
  │     │                ▼                                           │
  │     │         ┌──────────────┐                                  │
  │     │         │ Try fallback │                                  │
  │     │         │ generator    │                                  │
  │     │         └──────┬───────┘                                  │
  │     │                │                                           │
  │     │                ▼                                           │
  │     │         ┌──────────────┐                                  │
  │     │         │ Return      │                                  │
  │     │         │ reasonable  │                                  │
  │     │         │ default    │                                  │
  │     │         │ data       │                                  │
  │     │         └──────────────┘                                  │
  │     │                                                           │
  │     │         Examples:                                          │
  │     │         - Score: 65 (calculated)                        │
  │     │         - Criteria: Default set                          │
  │     │         - Gap: Generic analysis                          │
  │     │                                                           │
  └─────┴───────────────────────────────────────────────────────────┘


  Toast Notifications:
  ───────────────────

  System shows status toasts:

  ✓ Simulation complete!      (success)
  ⚠ Ollama offline - using...  (warning)
  ℹ Option B wins - 78%...      (info)
  ⚠ Connection failed...        (error)


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
