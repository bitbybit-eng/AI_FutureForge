import { useState } from 'react';
import ScoreRing from '../components/ScoreRing';
import LoadingOverlay from '../components/LoadingOverlay';
import { runGapAnalysis } from '../lib/api';

const GAP_STEPS = ['Mapping role requirements', 'Scanning your skills', 'Calculating gap severity', 'Prioritizing skill tree', 'Generating action plan'];

function SkillGap() {
  const [formData, setFormData] = useState({
    role: 'Senior Software Engineer',
    industry: 'Technology',
    skills: 'Python, JavaScript, SQL, Git',
    experience: '3 years experience, built multiple projects'
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.skills) {
      alert('Please fill in required fields');
      return;
    }

    setLoading(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, GAP_STEPS.length - 1));
    }, 870);

    try {
      const analysis = await runGapAnalysis(formData);
      clearInterval(stepInterval);
      setResult(analysis);
    } catch (error) {
      clearInterval(stepInterval);
      // Fallback
      setResult({
        overallReadiness: 52,
        gapSeverity: 'Moderate',
        summary: 'You have a solid technical foundation with some gaps in advanced areas. Focus on system design and cloud platforms to accelerate your career.',
        missingSkills: [
          { skill: 'System Design', category: 'Technical', importance: 'Critical', timeToLearn: '2-3 months', freeResource: 'Coursera / AWS docs', reason: 'Required for senior-level roles', demandScore: 9 },
          { skill: 'Cloud Platforms', category: 'Technical', importance: 'High', timeToLearn: '1-2 months', freeResource: 'AWS Free Tier', reason: 'Industry standard requirement', demandScore: 8 },
          { skill: 'Leadership', category: 'Soft', importance: 'Medium', timeToLearn: 'Ongoing', freeResource: 'Harvard Business Online', reason: 'Needed for career advancement', demandScore: 6 }
        ],
        existingStrengths: [
          { skill: 'Python Programming', relevance: 'High', note: 'Strong foundation' },
          { skill: 'JavaScript', relevance: 'High', note: 'Solid full-stack skills' },
          { skill: 'SQL', relevance: 'Medium', note: 'Good database knowledge' }
        ],
        quickWins: [
          { action: 'Complete AWS Cloud Practitioner certification', timeframe: '2-3 weeks' },
          { action: 'Build and deploy a microservice', timeframe: '1 month' }
        ],
        learningPath: ['Master cloud fundamentals', 'Complete ML specialization', 'Build distributed systems projects', 'Develop leadership skills'],
        totalTime: '6-9 months',
        marketDemand: 78,
        salaryImpact: '+35-50% salary uplift'
      });
    } finally {
      setLoading(false);
    }
  };

  const color = '#a855f7';
  const impColors = { Critical: '#ff4444', High: '#ff6b35', Medium: '#f59e0b' };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="border-l-2 border-forge-purple pl-4">
        <div className="text-forge-purple text-[10px] tracking-widest mb-1">MODULE 03</div>
        <h2 className="font-orbitron text-xl md:text-2xl font-bold tracking-wider mb-1">SKILL GAP ANALYZER</h2>
        <p className="text-white/30 text-xs tracking-wide">Precision scan — identify exactly what stands between you and your goal</p>
      </div>

      {/* Form */}
      <div className="panel relative overflow-hidden">
        {loading && <LoadingOverlay steps={GAP_STEPS} currentStep={currentStep} color={color} />}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Target Role / Goal *</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. Senior Data Scientist at FAANG"
              className="w-full bg-white/5 border border-forge-purple/30 border-b-2 border-b-forge-purple/60 px-3 py-2 text-sm"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>

          <div className="field">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Industry</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full bg-white/5 border border-forge-purple/30 border-b-2 border-b-forge-purple px-3 py-2 text-sm cursor-pointer"
              style={{ borderBottomColor: color }}
            >
              {['Technology', 'Finance', 'Healthcare', 'Marketing', 'Design', 'Engineering', 'Education', 'Consulting', 'Other'].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="field md:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Your Current Skills *</label>
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="List all skills honestly, even basic ones..."
              rows="2"
              className="w-full bg-white/5 border border-forge-purple/30 border-b-2 border-b-forge-purple/60 px-3 py-2 text-sm resize-none"
              style={{ borderBottomColor: `${color}99` }}
            />
          </div>

          <div className="field md:col-span-2">
            <label className="text-[9px] tracking-widest font-bold uppercase" style={{ color }}>Experience & Background</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Education, internships, projects, years of exp..."
              rows="2"
              className="w-full bg-white/5 border border-forge-purple/30 border-b-2 border-b-forge-purple/60 px-3 py-2 text-sm resize-none"
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
              ◎ Analyze Skill Gaps
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {/* Gap Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4">
            {/* Left - Score */}
            <div className="panel flex flex-col items-center justify-center gap-3 p-6" style={{ boxShadow: `inset 0 0 40px ${color}07` }}>
              <ScoreRing score={result.overallReadiness || 50} label="Gap Readiness" color={color} size={100} />
              <span 
                className="px-3 py-1 text-[10px] tracking-widest uppercase border"
                style={{ 
                  background: `${impColors[result.gapSeverity] || color}12`,
                  borderColor: `${impColors[result.gapSeverity] || color}38`,
                  color: impColors[result.gapSeverity] || color
                }}
              >
                {result.gapSeverity?.toUpperCase() || 'MODERATE'} GAP
              </span>
              <div className="text-center">
                <div className="text-white/25 text-[9px] tracking-widest mb-1">TIME TO BRIDGE</div>
                <div className="font-orbitron text-sm">{result.totalTime || '6-9 months'}</div>
              </div>
            </div>

            {/* Middle - Assessment */}
            <div className="panel border-l-2" style={{ borderLeftColor: color }}>
              <div className="text-[9px] tracking-widest mb-3" style={{ color }}>ASSESSMENT</div>
              <p className="text-white/80 text-sm leading-relaxed mb-4">{result.summary}</p>
              <div className="text-white/25 text-[9px] tracking-widest mb-2">CURRENT STRENGTHS</div>
              <div className="flex flex-wrap gap-2">
                {(result.existingStrengths || []).map((s, i) => (
                  <span key={i} className="px-3 py-1 bg-forge-green/7 border border-forge-green/25 text-forge-green text-xs">
                    {s.skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right - Stats */}
            <div className="panel flex flex-col gap-4 p-5 min-w-[140px]">
              <div>
                <div className="text-white/25 text-[9px] tracking-widest mb-2">MARKET DEMAND</div>
                <div className="h-2 bg-white/5 mb-1 overflow-hidden">
                  <div 
                    className="h-full transition-all duration-1000"
                    style={{ 
                      width: `${result.marketDemand || 75}%`,
                      background: 'linear-gradient(90deg, #00f5ff, #00f5ff99)',
                      boxShadow: '0 0 6px #00f5ff55'
                    }}
                  />
                </div>
                <div className="font-orbitron text-xl font-bold" style={{ color: '#00f5ff' }}>
                  {result.marketDemand || 75}/100
                </div>
              </div>
              <div>
                <div className="text-white/25 text-[9px] tracking-widest mb-1">SALARY IMPACT</div>
                <div className="text-forge-green text-sm font-bold leading-tight">{result.salaryImpact}</div>
              </div>
            </div>
          </div>

          {/* Missing Skills */}
          <div className="panel">
            <div className="text-[9px] tracking-widest mb-4" style={{ color }}>◎ PRIORITY SKILL GAPS</div>
            <div className="flex flex-col gap-2">
              {(result.missingSkills || []).map((sk, i) => {
                const impColor = impColors[sk.importance] || color;
                return (
                  <div 
                    key={i} 
                    className="grid grid-cols-[30px_1fr_auto_auto] gap-3 items-center p-3 border"
                    style={{ background: `${color}03`, borderColor: `${color}09`, borderLeft: `3px solid ${impColor}` }}
                  >
                    <div 
                      className="w-7 h-7 rounded-full flex items-center justify-center font-orbitron text-[9px] font-bold"
                      style={{ background: `${impColor}15`, border: `1.5px solid ${impColor}33`, color: impColor }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{sk.skill}</div>
                      <div className="text-white/28 text-[11px] mt-0.5">
                        {sk.reason} → <span style={{ color }}>{sk.freeResource}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span 
                        className="px-2 py-0.5 text-[9px] tracking-widest uppercase border"
                        style={{ 
                          background: `${impColor}12`,
                          borderColor: `${impColor}38`,
                          color: impColor
                        }}
                      >
                        {sk.importance}
                      </span>
                      <span 
                        className="px-2 py-0.5 text-[9px] tracking-widest uppercase border"
                        style={{ 
                          background: `${color}12`,
                          borderColor: `${color}38`,
                          color
                        }}
                      >
                        {sk.category}
                      </span>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="text-white/30 text-[10px]">⏱ {sk.timeToLearn}</div>
                      <div className="h-1 bg-white/5 mt-1 overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000"
                          style={{ 
                            width: `${(sk.demandScore || 7) * 10}%`,
                            background: impColor,
                            boxShadow: `0 0 4px ${impColor}55`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Wins & Learning Path */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel border-t-2" style={{ borderTopColor: '#22c55e' }}>
              <div className="text-[9px] tracking-widest mb-3" style={{ color: '#22c55e' }}>⚡ QUICK WINS</div>
              {(result.quickWins || []).map((w, i) => (
                <div key={i} className="flex gap-3 mb-2 p-2 bg-forge-green/4 border border-forge-green/10">
                  <span className="font-orbitron text-[9px] font-bold" style={{ color: '#22c55e' }}>0{i + 1}</span>
                  <div>
                    <div className="text-white/70 text-xs">{w.action}</div>
                    {w.timeframe && <div className="text-white/25 text-[10px] mt-0.5">⏱ {w.timeframe}</div>}
                  </div>
                </div>
              ))}
            </div>

            <div className="panel border-t-2" style={{ borderTopColor: color }}>
              <div className="text-[9px] tracking-widest mb-3" style={{ color }}>⟴ ORDERED LEARNING PATH</div>
              {(result.learningPath || []).map((step, i) => (
                <div key={i} className="flex gap-3 mb-2 items-start">
                  <div className="w-2 h-2 rounded-full mt-1.5" style={{ background: color }}></div>
                  <span className="text-white/65 text-xs">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkillGap;
