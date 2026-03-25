import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { initDatabase, profileDB, simulationDB, battleDB, roadmapDB, chatDB } from './services/db.js';
import { callOllama, streamOllama, checkOllamaHealth, getOllamaModels } from './services/ollama.js';
import { generateSimulationPrompt, generateBattlePrompt, generateGapPrompt, generateRoadmapPrompt, getMentorSystemPrompt } from './services/prompts.js';
import { calculateReadinessScore, categorizePersonality, identifyStrengths, identifyRisks, calculateSuccessProbability } from './utils/scoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3001;
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://192.168.43.139:11434';

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
initDatabase();

// WebSocket handling
const wsClients = new Map();

wss.on('connection', (ws) => {
  const clientId = Date.now();
  wsClients.set(clientId, ws);
  
  console.log(`WebSocket client connected: ${clientId}`);
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      
      if (data.type === 'MENTOR_STREAM') {
        const { sessionId, prompt, persona, history } = data.payload;
        const systemPrompt = getMentorSystemPrompt(persona);
        
        let fullPrompt = prompt;
        if (history && history.length > 0) {
          fullPrompt = history.map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`).join('\n') + '\n\nHuman: ' + prompt;
        }
        
        ws.send(JSON.stringify({ type: 'TYPING', sessionId }));
        await streamOllama(fullPrompt, systemPrompt, ws, OLLAMA_URL, 'llama3.2:3b');
        ws.send(JSON.stringify({ type: 'DONE', sessionId }));
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ type: 'ERROR', error: error.message }));
    }
  });
  
  ws.on('close', () => {
    wsClients.delete(clientId);
    console.log(`WebSocket client disconnected: ${clientId}`);
  });
});

// Health check
app.get('/api/health', async (req, res) => {
  const ollamaStatus = await checkOllamaHealth(OLLAMA_URL);
  res.json({
    status: 'ok',
    ollama: ollamaStatus,
    timestamp: new Date().toISOString()
  });
});

// Ollama status
app.get('/api/ollama/status', async (req, res) => {
  try {
    const models = await getOllamaModels(OLLAMA_URL);
    res.json({ connected: true, models, url: OLLAMA_URL });
  } catch (error) {
    res.json({ connected: false, error: error.message, url: OLLAMA_URL });
  }
});

// Profile endpoints
app.get('/api/profile', (req, res) => {
  try {
    const profile = profileDB.getLatest();
    res.json(profile || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/profile', (req, res) => {
  try {
    const { name, age, field, gpa, skills, habits, goal, industry } = req.body;
    
    const profile = profileDB.create({
      name,
      age: age ? parseInt(age) : null,
      field,
      gpa: gpa ? parseFloat(gpa) : null,
      skills: skills ? (Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())) : [],
      habits,
      goal,
      industry
    });
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Simulation endpoint
app.post('/api/simulate', async (req, res) => {
  try {
    const { name, age, field, gpa, skills, habits, goal } = req.body;
    
    // Calculate readiness score locally
    const readinessScore = calculateReadinessScore({ age, gpa, skills, habits });
    const successProb = calculateSuccessProbability(readinessScore, goal);
    const improvedProb = Math.min(95, successProb + 25);
    
    // Get personality and analysis
    const personalityType = categorizePersonality({ skills, habits, field });
    const strengths = identifyStrengths({ skills, habits, gpa });
    const risks = identifyRisks({ skills, habits, field });
    
    // Generate prompt for Ollama
    const prompt = generateSimulationPrompt({ name, age, field, gpa, skills, habits, goal });
    
    let aiAnalysis = null;
    try {
      const response = await callOllama(prompt, '', OLLAMA_URL, 'llama3.2:3b');
      aiAnalysis = response.response || response;
    } catch (ollamaError) {
      console.log('Ollama not available, using fallback analysis');
      aiAnalysis = null;
    }
    
    // Parse AI analysis
    const analysis = aiAnalysis ? parseSimulationAnalysis(aiAnalysis) : generateFallbackAnalysis({ 
      readinessScore, successProb, improvedProb, goal, personalityType, strengths, risks 
    });
    
    // Save to database
    const simulation = simulationDB.create({
      name,
      field,
      goal,
      readiness_score: readinessScore,
      success_prob: successProb,
      improved_prob: improvedProb,
      personality_type: analysis.personalityType || personalityType,
      key_insight: analysis.keyInsight,
      current_path: analysis.currentPath,
      improved_path: analysis.improvedPath,
      strengths: analysis.strengths || strengths,
      risks: analysis.risks || risks,
      action: analysis.action
    });
    
    res.json(simulation);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get simulation history
app.get('/api/simulate/history', (req, res) => {
  try {
    const simulations = simulationDB.getAll(10);
    res.json(simulations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Battle endpoint
app.post('/api/battle', async (req, res) => {
  try {
    const { choiceA, choiceB, context, priority, prosA, consA, prosB, consB, timelineA, timelineB } = req.body;
    
    const prompt = generateBattlePrompt({ choiceA, choiceB, context, priority, prosA, consA, prosB, consB, timelineA, timelineB });
    
    let aiAnalysis = null;
    try {
      const response = await callOllama(prompt, '', OLLAMA_URL, 'llama3.2:3b');
      aiAnalysis = response.response || response;
    } catch (ollamaError) {
      console.log('Ollama not available, using fallback battle');
      aiAnalysis = null;
    }
    
    const analysis = aiAnalysis ? parseBattleAnalysis(aiAnalysis) : generateFallbackBattle({ 
      choiceA, choiceB, priority 
    });
    
    // Save to database
    const battle = battleDB.create({
      choice_a: choiceA,
      choice_b: choiceB,
      context,
      priority,
      winner: analysis.winner,
      confidence: analysis.confidence,
      criteria: analysis.criteria,
      reasoning: analysis.reasoning,
      hybrid: analysis.hybrid
    });
    
    res.json(battle);
  } catch (error) {
    console.error('Battle error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get battle history
app.get('/api/battle/history', (req, res) => {
  try {
    const battles = battleDB.getAll(10);
    res.json(battles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gap analysis endpoint
app.post('/api/gap', async (req, res) => {
  try {
    const { role, industry, skills, experience } = req.body;
    
    const prompt = generateGapPrompt({ role, industry, skills, experience });
    
    let aiAnalysis = null;
    try {
      const response = await callOllama(prompt, '', OLLAMA_URL, 'llama3.2:3b');
      aiAnalysis = response.response || response;
    } catch (ollamaError) {
      console.log('Ollama not available, using fallback gap analysis');
      aiAnalysis = null;
    }
    
    const analysis = aiAnalysis ? parseGapAnalysis(aiAnalysis) : generateFallbackGap({ role, skills });
    
    res.json(analysis);
  } catch (error) {
    console.error('Gap analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Roadmap endpoint
app.post('/api/roadmap', async (req, res) => {
  try {
    const { goal, timeline, style, background } = req.body;
    
    const prompt = generateRoadmapPrompt({ goal, timeline, style, background });
    
    let aiAnalysis = null;
    try {
      const response = await callOllama(prompt, '', OLLAMA_URL, 'llama3.2:3b');
      aiAnalysis = response.response || response;
    } catch (ollamaError) {
      console.log('Ollama not available, using fallback roadmap');
      aiAnalysis = null;
    }
    
    const analysis = aiAnalysis ? parseRoadmapAnalysis(aiAnalysis) : generateFallbackRoadmap({ goal, timeline });
    
    // Save to database
    const roadmap = roadmapDB.create({
      goal,
      timeline,
      style,
      phases: analysis.phases,
      daily_habits: analysis.dailyHabits,
      weekly_targets: analysis.weeklyTargets,
      metrics: analysis.metrics,
      warning: analysis.warning,
      quote: analysis.quote,
      title: analysis.title
    });
    
    res.json(roadmap);
  } catch (error) {
    console.error('Roadmap error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get roadmap history
app.get('/api/roadmap/history', (req, res) => {
  try {
    const roadmaps = roadmapDB.getAll(10);
    res.json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mentor chat endpoint
app.post('/api/mentor/chat', async (req, res) => {
  try {
    const { message, persona, history } = req.body;
    
    const systemPrompt = getMentorSystemPrompt(persona);
    
    let fullPrompt = message;
    if (history && history.length > 0) {
      fullPrompt = history.map(m => `${m.role === 'user' ? 'Human' : 'Assistant'}: ${m.content}`).join('\n') + '\n\nHuman: ' + message;
    }
    
    let response;
    try {
      const result = await callOllama(fullPrompt, systemPrompt, OLLAMA_URL, 'llama3.2:3b');
      response = result.response || result;
    } catch (ollamaError) {
      response = getFallbackMentorResponse(message, persona);
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Mentor chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Save chat session
app.post('/api/mentor/session', (req, res) => {
  try {
    const { messages, persona } = req.body;
    
    const session = chatDB.create({
      messages,
      persona
    });
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chat history
app.get('/api/mentor/sessions', (req, res) => {
  try {
    const sessions = chatDB.getAll(20);
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Parse functions
function parseSimulationAnalysis(text) {
  const extract = (field, defaultVal) => {
    const patterns = [
      new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`, 'i'),
      new RegExp(`"${field}"\\s*:\\s*'([^']+)'`, 'i')
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return defaultVal;
  };
  
  const extractArray = (field, defaultVal) => {
    const pattern = new RegExp(`"${field}"\\s*:\\s*\\[([^\\]]+)\\]`, 'i');
    const match = text.match(pattern);
    if (match) {
      const items = match[1].match(/"([^"]+)"/g);
      if (items) return items.map(i => i.replace(/"/g, ''));
    }
    return defaultVal;
  };
  
  return {
    personalityType: extract('personalityType', 'Builder'),
    keyInsight: extract('keyInsight', 'Focus on consistent skill development.'),
    currentPath: extract('currentPath', 'With current trajectory, expect 5-7 years to goal.'),
    improvedPath: extract('improvedPath', 'With optimization, achieve goal in 3-4 years.'),
    strengths: extractArray('topStrengths', ['Technical foundation', 'Learning motivation']),
    risks: extractArray('topRisks', ['Network gaps', 'Skill consistency']),
    action: extract('criticalAction', 'Network with 3 professionals this week.')
  };
}

function parseBattleAnalysis(text) {
  const extract = (field, defaultVal) => {
    const patterns = [
      new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`, 'i'),
      new RegExp(`"${field}"\\s*:\\s*([0-9]+)`, 'i')
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return isNaN(parseInt(match[1])) ? match[1] : parseInt(match[1]);
    }
    return defaultVal;
  };
  
  return {
    winner: extract('winner', 'A'),
    confidence: parseInt(extract('confidence', 72)),
    criteria: generateDefaultCriteria(),
    reasoning: extract('reasoning', 'Based on the provided information, this option better aligns.'),
    hybrid: extract('synergy', 'Consider a hybrid approach combining elements.')
  };
}

function parseGapAnalysis(text, userSkills) {
  const extract = (field, defaultVal) => {
    const patterns = [
      new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`, 'i'),
      new RegExp(`"${field}"\\s*:\\s*([0-9]+)`, 'i')
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return isNaN(parseInt(match[1])) ? match[1] : parseInt(match[1]);
    }
    return defaultVal;
  };
  
  return {
    overallReadiness: extract('overallReadiness', 50),
    gapSeverity: extract('gapSeverity', 'Moderate'),
    summary: extract('summary', 'You have a solid foundation with some gaps to address.'),
    missingSkills: generateDefaultMissingSkills(),
    existingStrengths: generateDefaultStrengths(userSkills?.skills),
    quickWins: [{ action: 'Complete an online certification', timeframe: '2-4 weeks' }],
    learningPath: ['Master fundamentals', 'Build projects', 'Get certified', 'Network'],
    totalTime: extract('totalTimeEstimate', '6-9 months'),
    marketDemand: extract('marketDemand', 75),
    salaryImpact: extract('salaryImpact', '+30-50% potential increase')
  };
}

function parseRoadmapAnalysis(text) {
  const extract = (field, defaultVal) => {
    const patterns = [
      new RegExp(`"${field}"\\s*:\\s*"([^"]+)"`, 'i')
    ];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) return match[1];
    }
    return defaultVal;
  };
  
  return {
    title: extract('title', 'Your Growth Roadmap'),
    summary: extract('summary', 'A structured path to achieve your goals.'),
    phases: generateDefaultPhases(),
    dailyHabits: [
      { habit: 'Morning study session', duration: '2 hours', why: 'Fresh mind absorbs better' },
      { habit: 'Practice coding', duration: '1 hour', why: 'Skill reinforcement' }
    ],
    weeklyTargets: ['Complete course modules', 'Build project component', 'Network'],
    metrics: ['Complete all phases', 'Build portfolio', 'Land interviews'],
    warning: extract('warningSign', 'Consistency beats intensity.'),
    quote: extract('motivationalNote', 'The journey of 1000 miles begins with a single step.')
  };
}

// Fallback generators
function generateFallbackAnalysis({ readinessScore, successProb, improvedProb, goal, personalityType, strengths, risks }) {
  return {
    personalityType,
    keyInsight: `Your ${readinessScore >= 60 ? 'strong' : 'developing'} profile shows ${readinessScore >= 60 ? 'great potential' : 'room for growth'}. Focus on ${risks[0] || 'consistent skill building'} to accelerate progress.`,
    currentPath: `With your current trajectory, expect approximately ${Math.round((100 - readinessScore) / 15)} years to achieve "${goal || 'your goal'}". Growth follows standard industry progression without major interventions.`,
    improvedPath: `With targeted improvements in ${strengths.slice(0, 2).join(' and ')}, you can accelerate this by 2-3 years and achieve higher compensation.`,
    strengths,
    risks,
    action: `This week: ${risks.includes('Limited professional networking') ? 'Schedule 3 networking calls' : 'Complete one advanced course module'}.`
  };
}

function generateFallbackBattle({ choiceA, choiceB, priority }) {
  return {
    winner: 'A',
    confidence: 75,
    criteria: [
      { name: 'Long-Term Growth', a: 8, b: 7 },
      { name: 'Financial Potential', a: 7, b: 8 },
      { name: 'Risk Level', a: 6, b: 4 },
      { name: 'Goal Alignment', a: 9, b: 7 },
      { name: 'Personal Satisfaction', a: 7, b: 8 },
      { name: 'Timeline', a: 8, b: 6 },
      { name: 'Skill Leverage', a: 7, b: 6 },
      { name: 'Reversibility', a: 5, b: 8 }
    ],
    reasoning: `"${choiceA}" shows stronger alignment with ${priority || 'balanced'} priorities. The decision matrix favors this option for long-term success.`,
    hybrid: `Consider starting with "${choiceB}" for stability, then transitioning to "${choiceA}" after gaining experience.`
  };
}

function generateDefaultCriteria() {
  return [
    { name: 'Long-Term Growth', a: 7, b: 8 },
    { name: 'Financial Potential', a: 8, b: 7 },
    { name: 'Risk Level', a: 6, b: 4 },
    { name: 'Goal Alignment', a: 8, b: 9 },
    { name: 'Personal Satisfaction', a: 7, b: 6 },
    { name: 'Timeline Feasibility', a: 9, b: 5 },
    { name: 'Skill Leverage', a: 6, b: 7 },
    { name: 'Reversibility', a: 4, b: 8 }
  ];
}

function generateFallbackGap({ role, skills }) {
  return {
    overallReadiness: 50,
    gapSeverity: 'Moderate',
    missingSkills: [
      { skill: 'System Design', category: 'Technical', importance: 'Critical', timeToLearn: '2-3 months', freeResource: 'Coursera', reason: 'Required for senior roles', demandScore: 9 },
      { skill: 'Cloud Platforms', category: 'Technical', importance: 'High', timeToLearn: '1-2 months', freeResource: 'AWS Free Tier', reason: 'Industry standard', demandScore: 8 },
      { skill: 'Leadership', category: 'Soft', importance: 'Medium', timeToLearn: 'Ongoing', freeResource: 'Harvard Online', reason: 'Career advancement', demandScore: 6 }
    ],
    existingStrengths: generateDefaultStrengths(skills)
  };
}

function generateDefaultMissingSkills() {
  return [
    { skill: 'System Design', category: 'Technical', importance: 'Critical', timeToLearn: '2-3 months', freeResource: 'Coursera', reason: 'Required for senior roles', demandScore: 9 },
    { skill: 'Cloud Platforms', category: 'Technical', importance: 'High', timeToLearn: '1-2 months', freeResource: 'AWS Free Tier', reason: 'Industry standard', demandScore: 8 },
    { skill: 'Leadership', category: 'Soft', importance: 'Medium', timeToLearn: 'Ongoing', freeResource: 'Harvard Online', reason: 'Career advancement', demandScore: 6 }
  ];
}

function generateDefaultStrengths(userSkills) {
  if (userSkills && userSkills.length > 0) {
    return userSkills.map(s => ({ skill: s, relevance: 'High', note: 'Strong foundation' }));
  }
  return [
    { skill: 'Problem Solving', relevance: 'High', note: 'Analytical mindset' },
    { skill: 'Communication', relevance: 'Medium', note: 'Clear articulation' }
  ];
}

function generateDefaultPhases() {
  return [
    { phase: 1, title: 'Foundation Sprint', theme: 'Core Skills', duration: 'Weeks 1-4', tasks: ['Set up environment', 'Complete basics', 'First project'], milestone: 'Basic proficiency' },
    { phase: 2, title: 'Skill Deepening', theme: 'Intermediate', duration: 'Weeks 5-8', tasks: ['Advanced topics', 'Build projects', 'Get reviews'], milestone: 'Intermediate level' },
    { phase: 3, title: 'Advanced Focus', theme: 'Senior Prep', duration: 'Weeks 9-12', tasks: ['System design', 'Behavioral prep', 'Networking'], milestone: 'Interview ready' },
    { phase: 4, title: 'Job Push', theme: 'Career Launch', duration: 'Weeks 13-16', tasks: ['Apply widely', 'Interview', 'Negotiate'], milestone: 'Job offer' }
  ];
}

function generateFallbackRoadmap({ goal, timeline }) {
  return {
    title: `Roadmap: ${goal || 'Your Goal'}`,
    summary: `This ${timeline || '6-month'} roadmap provides a structured path to achieve your goals with clear milestones.`,
    phases: generateDefaultPhases(),
    dailyHabits: [
      { habit: 'Morning study session', duration: '2 hours', why: 'Fresh mind absorbs better' },
      { habit: 'Practice coding', duration: '1 hour', why: 'Skill reinforcement' },
      { habit: 'Network engagement', duration: '30 min', why: 'Build connections' }
    ],
    weeklyTargets: ['Complete course modules', 'Build project component', 'Network with 3 people'],
    metrics: ['Complete all phases', 'Build 5 portfolio projects', 'Land interviews'],
    warning: 'Consistency beats intensity — 1 hour daily beats 7 hours once a week.',
    quote: 'The journey of 1000 miles begins with a single step. Stay consistent and celebrate small wins.'
  };
}

function getFallbackMentorResponse(message, persona) {
  const lower = message.toLowerCase();
  
  if (lower.includes('career') || lower.includes('job')) {
    return 'Based on your profile, focusing on building a strong portfolio and networking actively will accelerate your career growth. What specific industry or role are you targeting?';
  }
  if (lower.includes('stuck') || lower.includes('lost')) {
    return 'Feeling stuck is often a sign of growth. Take one small step today — even a 15-minute learning session. What would you do if you couldn\'t fail?';
  }
  if (lower.includes('procrastinat') || lower.includes('focus')) {
    return 'Procrastination often signals overwhelm. Break your goal into tiny 5-minute tasks. Start with just one thing. What\'s the smallest step forward?';
  }
  if (lower.includes('confidence') || lower.includes('doubt')) {
    return 'Confidence comes from action, not the other way around. Complete one uncomfortable task today, regardless of outcome. Small wins build momentum.';
  }
  
  return 'I understand. Let\'s explore this further. What specific aspect would you like to dig deeper into? Remember, every expert was once a beginner.';
}

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🤖 AI FUTUREFORGE BACKEND v1.0                     ║
║                                                       ║
║   Server running on: http://localhost:${PORT}            ║
║   WebSocket on: ws://localhost:${PORT}                  ║
║   Ollama URL: ${OLLAMA_URL}                    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
