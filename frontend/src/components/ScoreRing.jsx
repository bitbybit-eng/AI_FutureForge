import { useEffect, useRef } from 'react';

function ScoreRing({ score, label, color = '#00f5ff', size = 118 }) {
  const svgRef = useRef(null);
  
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    
    const r = size * 0.41;
    const circ = 2 * Math.PI * r;
    const cx = size / 2;
    const cy = size / 2;
    const id = `ring-${label.replace(/[^a-zA-Z0-9]/g, '')}-${size}`;
    
    const arc = svg.querySelector('.ring-arc');
    const valEl = svg.querySelector('.ring-val');
    
    let start = null;
    const duration = 1100;
    
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(eased * score);
      
      if (valEl) valEl.textContent = val;
      if (arc) arc.setAttribute('stroke-dasharray', `${(val / 100) * circ} ${circ}`);
      
      if (progress < 1) requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }, [score, size, label]);
  
  const r = size * 0.41;
  const cx = size / 2;
  const cy = size / 2;
  const id = `ring-${label.replace(/[^a-zA-Z0-9]/g, '')}-${size}`;
  
  return (
    <div className="flex flex-col items-center gap-1.5">
      <svg 
        ref={svgRef}
        width={size} 
        height={size} 
        style={{ filter: `drop-shadow(0 0 10px ${color}77)` }}
      >
        <defs>
          <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={`${color}88`} />
          </linearGradient>
        </defs>
        <circle 
          cx={cx} 
          cy={cy} 
          r={r} 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="7" 
        />
        <circle 
          cx={cx} 
          cy={cy} 
          r={r} 
          fill="none" 
          stroke={`url(#${id})`} 
          strokeWidth="7"
          strokeDasharray="0 691"
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
          className="ring-arc transition-all duration-100"
        />
        <text 
          x={cx} 
          y={cy - 3} 
          textAnchor="middle" 
          fill="white" 
          fontSize={size * 0.17}
          fontFamily="'Orbitron', sans-serif"
          fontWeight="700"
          className="ring-val"
        >
          0
        </text>
        <text 
          x={cx} 
          y={cy + size * 0.12} 
          textAnchor="middle" 
          fill={color}
          fontSize={size * 0.08}
          fontFamily="'Rajdhani', sans-serif"
        >
          /100
        </text>
      </svg>
      <span className="text-white/45 text-[10px] tracking-wider uppercase text-center max-w-[130px]">
        {label}
      </span>
    </div>
  );
}

export default ScoreRing;
