# AI FutureForge - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Ollama running on your remote machine

## Setup Instructions

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on http://localhost:3001

### 2. In another terminal, start Frontend
```bash
cd frontend
# If node_modules exists but incomplete, run:
pnpm install
# or
npm install

# Then start:
npm run dev
```
Frontend will run on http://localhost:5173

### 3. Ollama Connection
Update your Ollama URL in:
- Backend: Set `OLLAMA_URL` environment variable
- Frontend .env: Set `VITE_API_URL`

Example:
```bash
# Windows
set OLLAMA_URL=http://192.168.1.100:11434

# Linux/Mac
export OLLAMA_URL=http://192.168.1.100:11434
```

## Features
- 🤖 **SIMULATE**: Future life trajectory with AI-powered analysis
- ⚔️ **BATTLE**: Decision comparison engine with criteria scoring
- 📊 **SKILL GAP**: Competency scanner with learning path
- 🗺️ **ROADMAP**: Phase-by-phase transformation blueprint
- 💬 **MENTOR**: AI chat with WebSocket streaming

## API Endpoints
- `POST /api/simulate` - Run future simulation
- `POST /api/battle` - Decision battle analysis
- `POST /api/gap` - Skill gap analysis
- `POST /api/roadmap` - Generate roadmap
- `POST /api/mentor/chat` - AI mentor chat
- `WS /` - WebSocket for streaming responses

## Health Check
```bash
curl http://localhost:3001/api/health
```
