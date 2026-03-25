import { useState } from 'react';
import LoadingOverlay from '../components/LoadingOverlay';
import { generateRoadmap } from '../lib/api';
import { useUserStore } from '../stores';

const ROAD_STEPS = ['Analyzing your goal', 'Mapping requirements', 'Designing phases', 'Building task library', 'Calibrating timeline', 'Finalizing roadmap'];
const PHASE_COLORS = ['#00f5ff', '#a855f7', '#ff6b35', '#22c55e', '#f59e0b', '#ec4899'];

function Roadmap() {
  const [formData, setFormData] = useState({
    goal: 'Get hired as Senior Software Engineer at a top tech company within 12 months',
    timeline: '6 months',
    style: 'Structured',
    background: '3 years of experience, strong in Python and JavaScript'
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const [openPhase, setOpenPhase] = useState(0);
  const { addRoadmap } = useUserStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.goal) {
      alert('Please enter your goal');
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, ROAD_STEPS.length - 1));
    }, 750);

    try {
      const roadmap = await generateRoadmap(formData);
      clearInterval(stepInterval);
      setResult(roadmap);
      addRoadmap(roadmap);
    } catch (error) {
      clearInterval(stepInterval);
      // Fallback
      setResult({
        title: formData.goal,
        summary: 'This 6-month roadmap provides a structured path to achieve your goal with clear milestones and actionable steps.',
        phases: [
          { phase: 1, title: 'Foundation Sprint', theme: 'Core Skills', duration: 'Weeks 1-4', tasks: ['Set up learning environment', 'Complete prerequisite courses', 'Build first portfolio piece', 'Join relevant communities'], milestone: 'Complete 3 mini-projects', resources: [{ name: 'Codecademy Pro', type: 'Paid' }, { name: 'FreeCodeCamp', type: 'Free' }], checkpoint: 'Can demonstrate basic proficiency' },
          { phase: 2, title: 'Skill Deepening', theme: 'Intermediate', duration: 'Weeks 5-8', tasks: ['Complete intermediate course track', 'Build complex project', 'Get code reviews', 'Start contributing to open source'], milestone: '1 complex project completed', resources: [{ name: 'Udemy Courses', type: 'Paid' }, { name: 'GitHub', type: 'Free' }], checkpoint: 'Intermediate level demonstrated' },
          { phase: 3, title: 'Advanced Focus', theme: 'Senior Prep', duration: 'Weeks 9-12', tasks: ['Master advanced topics', 'System design fundamentals', 'Behavioral interview prep', 'Build network connections'], milestone: 'Ready for senior interviews', resources: [{ name: 'Exercism', type: 'Free' }, { name: 'System Design Primer', type: 'Free' }], checkpoint: 'Passing mock interviews' },
          { phase: 4, title: 'Job Application Push', theme: 'Career Transition', duration: 'Weeks 13-24', tasks: ['Tailor resume for each role', 'Apply to 50+ positions', 'Negotiate offers', 'Accept and transition'], milestone: 'Job offer received', resources: [{ name: 'LinkedIn Premium', type: 'Paid' }, { name: 'Interviewing.io', type: 'Paid' }], checkpoint: 'Received job offer' }
        ],
        dailyHabits: [
          { habit: 'Morning study session (2h)', duration: '9-11 AM', why: 'Fresh mind absorbs better' },
          { habit: 'Code review & practice', duration: '1 hour', why: 'Reinforce learning' },
          { habit: 'Network engagement', duration: '30 min', why: 'Build connections' }
        ],
        weeklyTargets: ['Complete course modules', 'Build project component', 'Network with 3 people'],
        metrics: ['Complete all 4 phases', 'Build 5 portfolio projects', 'Land interviews at target company'],
        warning: 'Consistency beats intensity — 1 hour daily beats 7 hours once a week',
        quote: 'The journey of 1000 miles begins with a single step. Stay consistent and celebrate small wins along the way.'
      });
    } finally {
      setLoading(false);
    }
  };

  const color = '#22c55e';

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="border-l-2 border-forge-green pl-4">
        <div className="text-forge-green text-[10px] tracking-widest mb-1">MODULE 04</div>
        <h2 className="font-orbitron text-xl md:text-2xl font-bold tracking-wider mb-1">PERSONALIZED ROADMAP</h2>
        <p className="text-white/30 text-xs tracking-wide">Phase-by-phase transformation blueprint — built for your exact goal and timeline</p>
      </div>

      {/* Form */}
      <div className="panel relative overflow-hidden">
        {loading && <LoadingOverlay steps={ROAD_STEPS} currentStep={currentStep} color={color} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Your Goal *</label>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Be ultra specific — e.g. Get hired as UX designer at top agency within 12 months"
              className="w-full bg-white/5 border border-forge-green/30 border-b-2 border-b-forge-green/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Timeline</label>
              <select
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                className="w-full bg-white/5 border border-forge-green/30 border-b-2 border-b-forge-green px-3 py-2 text-sm cursor-pointer"
                style={{ borderBottomColor: color }}
              >
                {['4 weeks', '2 months', '3 months', '6 months', '1 year', '18 months', '2 years'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Learning Style</label>
              <select
                name="style"
                value={formData.style}
                onChange={handleChange}
                className="w-full bg-white/5 border border-forge-green/30 border-b-2 border-b-forge-green px-3 py-2 text-sm cursor-pointer"
                style={{ borderBottomColor: color }}
              >
                {['Structured', 'Self-paced', 'Project-based', 'Bootcamp intensity', 'Gradual & steady'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Your Background & Starting Point</label>
            <textarea
              name="background"
              value={formData.background}
              onChange={handleChange}
              placeholder="e.g. CS graduate, 1 year experience, know Python basics..."
              rows="2"
              className="w-full bg-white/5 border border-forge-green/30 border-b-2 border-b-forge-green/60 px-3 py-2 text-sm resize-none"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <span className="text-white/20 text-[10px] tracking-wide">* required fields</span>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-xs font-bold tracking-widest uppercase border-2 transition-all relative overflow-hidden disabled:opacity-40"
              style={{ 
                borderColor: color, 
                color, 
                background: `linear-gradient(135deg, ${color}14, ${color}06)`,
                boxShadow: `0 0 12px ${color}1a`
              }}
            >
              {loading && <span className="shimmer"></span>}
              ⟴ Generate Roadmap
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Header */}
          <div className="panel border-t-2" style={{ 
            borderTopColor: color, 
            background: `linear-gradient(135deg, rgba(34,197,94,0.06), rgba(0,245,255,0.02))`,
            boxShadow: `inset 0 0 40px ${color}07`
          }}>
            <h3 className="font-orbitron text-lg font-bold tracking-wider mb-2">{result.title}</h3>
            <p className="text-white/55 text-sm leading-relaxed mb-4">{result.summary}</p>
            <div className="flex gap-2 flex-wrap mb-4">
              <span className="px-3 py-1 text-[10px] tracking-widest uppercase bg-forge-cyan/12 border border-forge-cyan/30" style={{ color: '#00f5ff' }}>480h total</span>
              <span className="px-3 py-1 text-[10px] tracking-widest uppercase bg-forge-purple/12 border border-forge-purple/30" style={{ color: '#a855f7' }}>4h/day</span>
              <span className="px-3 py-1 text-[10px] tracking-widest uppercase bg-forge-green/12 border border-forge-green/30" style={{ color: color }}>{result.phases?.length || 4} phases</span>
            </div>
            {result.warning && (
              <div className="p-3 bg-forge-yellow/7 border border-forge-yellow/22">
                <span style={{ color: '#f59e0b' }} className="text-xs">⚠ WATCH: {result.warning}</span>
              </div>
            )}
          </div>

          {/* Phases */}
          <div className="flex flex-col">
            {(result.phases || []).map((phase, i) => {
              const pColor = PHASE_COLORS[i % PHASE_COLORS.length];
              const isOpen = openPhase === i;
              
              return (
                <div key={i}>
                  <button
                    onClick={() => setOpenPhase(isOpen ? null : i)}
                    className="w-full flex items-center gap-3 p-4 text-left transition-all cursor-pointer"
                    style={{ 
                      background: isOpen ? `${pColor}0e` : 'rgba(5,9,18,0.8)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${pColor}`
                    }}
                  >
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center font-orbitron text-[10px] font-bold"
                      style={{ 
                        background: `${pColor}15`, 
                        border: `1.5px solid ${pColor}`,
                        color: pColor,
                        boxShadow: isOpen ? `0 0 12px ${pColor}44` : 'none'
                      }}
                    >
                      {phase.phase}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{phase.title}</div>
                      <div className="text-white/30 text-[10px] mt-0.5">{phase.duration} · {phase.theme}</div>
                    </div>
                    <div 
                      className="px-3 py-1 text-[9px] tracking-widest border max-w-[160px] text-right break-words"
                      style={{ 
                        background: `${pColor}12`, 
                        borderColor: `${pColor}2a`, 
                        color: pColor 
                      }}
                    >
                      🎯 {phase.milestone?.slice(0, 28)}...
                    </div>
                    <span style={{ color: pColor, marginLeft: 'auto' }}>{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div 
                      className="p-4 border border-t-0 animate-fade-in"
                      style={{ borderColor: `${pColor}1a`, background: 'rgba(5,9,18,0.5)' }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Tasks */}
                        <div>
                          <div className="text-white/25 text-[9px] tracking-widest mb-2">TASKS</div>
                          {(phase.tasks || []).map((task, j) => (
                            <div key={j} className="flex gap-2 mb-2">
                              <span style={{ color: pColor, marginTop: '3px' }}>▸</span>
                              <span className="text-white/65 text-xs">{task}</span>
                            </div>
                          ))}
                        </div>

                        {/* Resources */}
                        <div>
                          <div className="text-white/25 text-[9px] tracking-widest mb-2">RESOURCES</div>
                          {(phase.resources || []).map((res, j) => (
                            <div key={j} className="flex gap-2 mb-2">
                              <span style={{ color: '#a855f7' }}>◈</span>
                              <div className="flex gap-1 flex-wrap">
                                <span className="text-white/65 text-xs">{res.name}</span>
                                <span 
                                  className="px-1 text-[9px] border"
                                  style={{ 
                                    background: res.type === 'Free' ? 'rgba(34,197,94,0.07)' : 'rgba(245,158,11,0.07)',
                                    borderColor: res.type === 'Free' ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)',
                                    color: res.type === 'Free' ? '#22c55e' : '#f59e0b'
                                  }}
                                >
                                  {res.type}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Checkpoint */}
                        <div>
                          <div className="text-white/25 text-[9px] tracking-widest mb-2">COMPLETION CHECK</div>
                          <div 
                            className="p-3"
                            style={{ background: `${pColor}07`, border: `1px solid ${pColor}1a` }}
                          >
                            <span className="text-white/60 text-xs leading-relaxed">{phase.checkpoint}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Daily Habits & Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel">
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#f59e0b' }}>☀ DAILY HABITS</div>
              {(result.dailyHabits || []).map((h, i) => (
                <div key={i} className="flex gap-3 mb-2 p-2 bg-forge-yellow/4 border border-forge-yellow/10">
                  <div className="w-4 h-4 border-2 border-forge-yellow/35"></div>
                  <div>
                    <div className="text-white/70 text-xs">{h.habit}</div>
                    <div className="text-white/22 text-[10px]">⏱ {h.duration} — {h.why}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="panel">
              <div className="text-[9px] tracking-widest mb-3" style={{ color }}>◉ SUCCESS METRICS</div>
              {(result.metrics || []).map((m, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <span style={{ color, fontSize: '12px', fontWeight: 'bold' }}>✓</span>
                  <span className="text-white/65 text-xs">{m}</span>
                </div>
              ))}
              <div className="h-px bg-white/5 my-3"></div>
              <div className="text-forge-cyan text-[9px] tracking-widest mb-2">WEEKLY TARGETS</div>
              {(result.weeklyTargets || []).map((t, i) => (
                <div key={i} className="text-white/50 text-xs mb-1">→ {t}</div>
              ))}
            </div>
          </div>

          {/* Quote */}
          {result.quote && (
            <div className="panel text-center" style={{ background: `linear-gradient(135deg, rgba(168,85,247,0.06), rgba(34,197,94,0.03))` }}>
              <div className="text-white/12 text-4xl leading-none mb-1">"</div>
              <p className="text-white/80 text-sm max-w-xl mx-auto leading-relaxed italic">{result.quote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Roadmap;
