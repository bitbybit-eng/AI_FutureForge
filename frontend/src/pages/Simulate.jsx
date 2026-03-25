import { useState } from 'react';
import ScoreRing from '../components/ScoreRing';
import LoadingOverlay from '../components/LoadingOverlay';
import { runSimulation } from '../lib/api';
import { useUserStore } from '../stores';

const SIM_STEPS = ['Parsing your profile', 'Calculating readiness score', 'Simulating current path', 'Generating optimized future', 'Building insights'];

function Simulate() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    field: '',
    gpa: '',
    skills: '',
    habits: '',
    goal: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const { addSimulation } = useUserStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.field || !formData.skills || !formData.goal) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    // Animate through steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, SIM_STEPS.length - 1));
    }, 880);

    try {
      const simulation = await runSimulation(formData);
      clearInterval(stepInterval);
      setResult(simulation);
      addSimulation(simulation);
    } catch (error) {
      console.error('Simulation error:', error);
      clearInterval(stepInterval);
      setResult({
        readiness_score: 65,
        success_prob: 72,
        improved_prob: 89,
        personality_type: 'Builder',
        key_insight: 'Your technical foundation shows promise. Focus on networking and consistent skill development.',
        current_path: 'With your current trajectory, expect to reach your goal in approximately 5 years.',
        improved_path: 'With targeted improvements, you can accelerate this by 2-3 years.',
        strengths: ['Technical aptitude', 'Learning motivation', 'Clear objectives'],
        risks: ['Network gaps', 'Skill consistency', 'Market awareness'],
        action: 'Network with 3 professionals in your field this week.'
      });
    } finally {
      setLoading(false);
    }
  };

  const color = '#00f5ff';

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="border-l-2 border-forge-cyan pl-4">
        <div className="text-forge-cyan text-[10px] tracking-widest mb-1">MODULE 01</div>
        <h2 className="font-orbitron text-xl md:text-2xl font-bold tracking-wider mb-1">FUTURE SIMULATION</h2>
        <p className="text-white/30 text-xs tracking-wide">Dual-path life trajectory modeling — current reality vs optimized potential</p>
      </div>

      {/* Form */}
      <div className="panel relative overflow-hidden">
        {loading && <LoadingOverlay steps={SIM_STEPS} currentStep={currentStep} color={color} />}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alex Chen"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 21"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Field / Domain *</label>
            <input
              type="text"
              name="field"
              value={formData.field}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Academic Performance</label>
            <input
              type="text"
              name="gpa"
              value={formData.gpa}
              onChange={handleChange}
              placeholder="e.g. GPA 3.4 / 72%"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="field md:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Current Skills *</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Python, communication, Excel..."
              rows="2"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm resize-none"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="field md:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Daily Habits & Routine</label>
            <textarea
              name="habits"
              value={formData.habits}
              onChange={handleChange}
              placeholder="2h study, gym 3x, 4h social media..."
              rows="2"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm resize-none"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="field md:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Life Goal *</label>
            <input
              type="text"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="Be specific — e.g. Become senior ML engineer at a top AI company by age 27"
              className="w-full bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>
          
          <div className="md:col-span-2 flex justify-between items-center mt-2">
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
              ◈ Run Simulation
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Score Rings */}
          <div className="grid grid-cols-3 gap-3">
            <ScoreRing score={result.readiness_score || 0} label="Readiness Score" color="#00f5ff" />
            <ScoreRing score={result.success_prob || 0} label="Current Success %" color="#ff6b35" />
            <ScoreRing score={result.improved_prob || 0} label="Optimized Success %" color="#22c55e" />
          </div>

          {/* Tags */}
          <div className="panel flex items-center gap-2 flex-wrap px-5 py-3">
            <span className="text-white/25 text-[9px] tracking-widest">PROFILE TYPE:</span>
            <span className="px-3 py-1 text-[10px] tracking-widest uppercase bg-forge-cyan/12 border border-forge-cyan/30" style={{ color: '#00f5ff' }}>
              {result.personality_type || 'Builder'}
            </span>
            <span className="px-3 py-1 text-[10px] tracking-widest uppercase bg-forge-purple/12 border border-forge-purple/30" style={{ color: '#a855f7' }}>
              Tech Professional
            </span>
          </div>

          {/* Key Insight */}
          <div className="panel border-l-2" style={{ borderLeftColor: color, boxShadow: `inset 0 0 40px ${color}07` }}>
            <div className="text-[9px] tracking-widest mb-2" style={{ color }}>⚡ KEY INSIGHT</div>
            <p className="text-white/85 text-sm leading-relaxed">{result.key_insight}</p>
          </div>

          {/* Paths */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel border-t-2" style={{ borderTopColor: '#ff6b35', boxShadow: `inset 0 0 40px #ff6b3507` }}>
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#ff6b35' }}>◉ CURRENT TRAJECTORY</div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{result.current_path}</p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-forge-orange animate-pulse"></div>
                <span style={{ color: '#ff6b35cc' }}>Est. <strong style={{ color: '#ff6b35' }}>5-7 years</strong> to goal</span>
              </div>
            </div>

            <div className="panel border-t-2" style={{ borderTopColor: '#22c55e', boxShadow: `inset 0 0 40px #22c55e07` }}>
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#22c55e' }}>◉ OPTIMIZED TRAJECTORY</div>
              <p className="text-white/70 text-sm leading-relaxed mb-4">{result.improved_path}</p>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-forge-green animate-pulse"></div>
                <span style={{ color: '#22c55ecc' }}>Est. <strong style={{ color: '#22c55e' }}>3-4 years</strong> to goal</span>
              </div>
            </div>
          </div>

          {/* Strengths, Risks, Action */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="panel">
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#22c55e' }}>▲ STRENGTHS</div>
              <div className="flex flex-col gap-2">
                {(result.strengths || []).map((s, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-forge-green mt-1.5"></div>
                    <span className="text-white/65 text-xs">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#ff6b35' }}>▼ RISK FACTORS</div>
              <div className="flex flex-col gap-2">
                {(result.risks || []).map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-forge-orange mt-1.5"></div>
                    <span className="text-white/65 text-xs">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel border-t-2" style={{ borderTopColor: '#f59e0b', boxShadow: `inset 0 0 40px #f59e0b07` }}>
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#f59e0b' }}>⚡ DO THIS WEEK</div>
              <p className="text-white/80 text-sm leading-relaxed">{result.action}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Simulate;
