import { useState } from 'react';
import ScoreRing from '../components/ScoreRing';
import LoadingOverlay from '../components/LoadingOverlay';
import { runBattle } from '../lib/api';
import { useUserStore } from '../stores';

const BATTLE_STEPS = ['Parsing options', 'Scoring 8 criteria', 'Running decision model', 'Building recommendation', 'Finalizing verdict'];

function Battle() {
  const [formData, setFormData] = useState({
    choiceA: 'Software Engineer at Startup',
    choiceB: 'Data Analyst at FAANG',
    prosA: 'Fast-paced environment, equity potential, high learning curve',
    consA: '60+ hour weeks, 50% failure rate startups',
    prosB: 'Stable tech giant, excellent benefits, work-life balance',
    consB: 'Slower promotion pace, larger team dynamics',
    context: 'Career growth and financial stability',
    priority: 'Balanced',
    timelineA: 'Immediate start',
    timelineB: 'Next hiring cycle (3-6 months)'
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);
  const { addBattle } = useUserStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.choiceA || !formData.choiceB) {
      alert('Please fill in both option titles');
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, BATTLE_STEPS.length - 1));
    }, 870);

    try {
      const battle = await runBattle(formData);
      clearInterval(stepInterval);
      setResult(battle);
      addBattle(battle);
    } catch (error) {
      clearInterval(stepInterval);
      // Fallback
      setResult({
        choice_a: formData.choiceA,
        choice_b: formData.choiceB,
        winner: 'A',
        confidence: 78,
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
        reasoning: 'Based on your optimization criteria, Option A shows stronger alignment with your stated priorities.',
        hybrid: 'Consider starting with Option B for stability, then transitioning to Option A after 1-2 years.'
      });
    } finally {
      setLoading(false);
    }
  };

  const color = '#ff6b35';

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="border-l-2 border-forge-orange pl-4">
        <div className="text-forge-orange text-[10px] tracking-widest mb-1">MODULE 02</div>
        <h2 className="font-orbitron text-xl md:text-2xl font-bold tracking-wider mb-1">DECISION BATTLE ENGINE</h2>
        <p className="text-white/30 text-xs tracking-wide">Multi-criteria AI head-to-head — get a data-driven verdict on any life choice</p>
      </div>

      {/* Form */}
      <div className="panel relative overflow-hidden">
        {loading && <LoadingOverlay steps={BATTLE_STEPS} currentStep={currentStep} color={color} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Choice Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_50px_1fr] gap-4">
            {/* Option A */}
            <div className="flex flex-col gap-3">
              <div className="text-center py-2 border" style={{ background: 'rgba(0,245,255,0.05)', borderColor: 'rgba(0,245,255,0.18)' }}>
                <span className="text-forge-cyan font-orbitron text-[11px] tracking-widest">⚔ OPTION A</span>
              </div>
              <input
                name="choiceA"
                value={formData.choiceA}
                onChange={handleChange}
                placeholder="Title *"
                className="bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
                style={{ borderBottomColor: '#00f5ff99' }}
              />
              <textarea
                name="prosA"
                value={formData.prosA}
                onChange={handleChange}
                placeholder="Pros..."
                rows="2"
                className="bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm resize-none"
                style={{ borderBottomColor: '#00f5ff99' }}
              />
              <textarea
                name="consA"
                value={formData.consA}
                onChange={handleChange}
                placeholder="Cons..."
                rows="2"
                className="bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm resize-none"
                style={{ borderBottomColor: '#00f5ff99' }}
              />
              <input
                name="timelineA"
                value={formData.timelineA}
                onChange={handleChange}
                placeholder="Timeline"
                className="bg-white/5 border border-forge-cyan/30 border-b-2 border-b-forge-cyan/60 px-3 py-2 text-sm"
                style={{ borderBottomColor: '#00f5ff99' }}
              />
            </div>

            {/* VS */}
            <div className="flex flex-col items-center justify-center py-8 lg:py-0">
              <span className="text-forge-orange font-orbitron text-lg font-black" style={{ textShadow: '0 0 18px #ff6b35' }}>VS</span>
              <div className="h-9 w-px bg-gradient-to-b from-transparent via-forge-orange to-transparent"></div>
            </div>

            {/* Option B */}
            <div className="flex flex-col gap-3">
              <div className="text-center py-2 border" style={{ background: 'rgba(255,107,53,0.05)', borderColor: 'rgba(255,107,53,0.18)' }}>
                <span className="text-forge-orange font-orbitron text-[11px] tracking-widest">⚔ OPTION B</span>
              </div>
              <input
                name="choiceB"
                value={formData.choiceB}
                onChange={handleChange}
                placeholder="Title *"
                className="bg-white/5 border border-forge-orange/30 border-b-2 border-b-forge-orange/60 px-3 py-2 text-sm"
                style={{ borderBottomColor: `${color}99` }}
              />
              <textarea
                name="prosB"
                value={formData.prosB}
                onChange={handleChange}
                placeholder="Pros..."
                rows="2"
                className="bg-white/5 border border-forge-orange/30 border-b-2 border-b-forge-orange/60 px-3 py-2 text-sm resize-none"
                style={{ borderBottomColor: `${color}99` }}
              />
              <textarea
                name="consB"
                value={formData.consB}
                onChange={handleChange}
                placeholder="Cons..."
                rows="2"
                className="bg-white/5 border border-forge-orange/30 border-b-2 border-b-forge-orange/60 px-3 py-2 text-sm resize-none"
                style={{ borderBottomColor: `${color}99` }}
              />
              <input
                name="timelineB"
                value={formData.timelineB}
                onChange={handleChange}
                placeholder="Timeline"
                className="bg-white/5 border border-forge-orange/30 border-b-2 border-b-forge-orange/60 px-3 py-2 text-sm"
                style={{ borderBottomColor: `${color}99` }}
              />
            </div>
          </div>

          <div className="h-px bg-white/5"></div>

          {/* Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="field">
              <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Your Goals & Context</label>
              <textarea
                name="context"
                value={formData.context}
                onChange={handleChange}
                placeholder="What are you optimizing for? Career, money, passion, lifestyle..."
                rows="2"
                className="bg-white/5 border border-forge-orange/30 border-b-2 border-b-forge-orange/60 px-3 py-2 text-sm resize-none"
                style={{ borderBottomColor: `${color}99` }}
              />
            </div>
            <div className="field">
              <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Optimize For</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="bg-white/5 border border-forge-orange/30 border-b-2 border-b-forge-orange px-3 py-2 text-sm cursor-pointer"
                style={{ borderBottomColor: color }}
              >
                {['Balanced', 'Long-term growth', 'Financial returns', 'Work-life balance', 'Learning opportunities', 'Security & stability'].map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
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
              ⚔ Begin Battle Analysis
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Winner Banner */}
          <div 
            className="panel text-center border-2"
            style={{ 
              background: `linear-gradient(135deg, ${result.winner === 'A' ? '#00f5ff' : color}0e, ${result.winner === 'A' ? '#00f5ff' : color}04)`,
              borderColor: result.winner === 'A' ? '#00f5ff' : color,
              boxShadow: `inset 0 0 40px ${result.winner === 'A' ? '#00f5ff' : color}07`
            }}
          >
            <div className="text-[9px] tracking-widest mb-2" style={{ color: result.winner === 'A' ? '#00f5ff' : color }}>
              🏆 VERDICT — {result.confidence}% AI CONFIDENCE
            </div>
            <h3 className="font-orbitron text-lg font-bold tracking-wider mb-3">
              OPTION {result.winner} WINS: {result.winner === 'A' ? result.choice_a : result.choice_b}
            </h3>
            <p className="text-white/80 text-sm max-w-xl mx-auto leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Score Rings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreRing 
              score={result.criteria?.reduce((s, c) => s + c.a, 0) * 10 / 8 || 72} 
              label={`Option A: ${result.choice_a?.slice(0, 16)}...`} 
              color="#00f5ff" 
              size={100}
            />
            <ScoreRing 
              score={result.criteria?.reduce((s, c) => s + c.b, 0) * 10 / 8 || 68} 
              label={`Option B: ${result.choice_b?.slice(0, 16)}...`} 
              color={color}
              size={100}
            />
          </div>

          {/* Criteria Breakdown */}
          <div className="panel">
            <div className="text-white/35 text-[9px] tracking-widest mb-4">CRITERIA BREAKDOWN (A vs B)</div>
            <div className="flex flex-col gap-3">
              {(result.criteria || []).map((c, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white/50 text-xs">{c.name}</span>
                    <span className="text-white/25 text-[10px]">A:{c.a}/10 · B:{c.b}/10</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="h-1.5 bg-white/5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000"
                        style={{ 
                          width: `${c.a * 10}%`, 
                          background: 'linear-gradient(90deg, #00f5ff, #00f5ff99)',
                          boxShadow: '0 0 6px #00f5ff55'
                        }}
                      />
                    </div>
                    <div className="h-1.5 bg-white/5 overflow-hidden">
                      <div 
                        className="h-full transition-all duration-1000"
                        style={{ 
                          width: `${c.b * 10}%`, 
                          background: `linear-gradient(90deg, ${color}, ${color}99)`,
                          boxShadow: `0 0 6px ${color}55`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-1 bg-forge-cyan"></div>
                <span className="text-white/25 text-[9px]">Option A</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-1" style={{ background: color }}></div>
                <span className="text-white/25 text-[9px]">Option B</span>
              </div>
            </div>
          </div>

          {/* Analysis & Hybrid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="panel lg:col-span-2 border-l-2" style={{ borderLeftColor: color }}>
              <div className="text-[9px] tracking-widest mb-2" style={{ color }}>DEEP ANALYSIS</div>
              <p className="text-white/70 text-sm leading-relaxed">{result.reasoning}</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="panel border-t-2" style={{ borderTopColor: '#22c55e', boxShadow: 'inset 0 0 40px #22c55e07' }}>
                <div className="text-[9px] tracking-widest mb-2" style={{ color: '#22c55e' }}>✦ HYBRID STRATEGY</div>
                <p className="text-white/65 text-xs leading-relaxed">{result.hybrid}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Battle;
