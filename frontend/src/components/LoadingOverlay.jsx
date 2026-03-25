function LoadingOverlay({ steps, currentStep, color = '#00f5ff' }) {
  return (
    <div className="absolute inset-0 z-50 bg-forge-bg/95 backdrop-blur-md flex flex-col items-center justify-center gap-6">
      <svg className="animate-spin-slow" width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
        <circle 
          cx="36" 
          cy="36" 
          r="30" 
          fill="none" 
          stroke={color} 
          strokeWidth="4"
          strokeDasharray="54 140"
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text 
          x="36" 
          y="41" 
          textAnchor="middle" 
          fill={color} 
          fontSize="12"
          fontFamily="'Orbitron', sans-serif"
          fontWeight="700"
        >
          AI
        </text>
      </svg>
      
      <div className="flex flex-col gap-2.5 w-64">
        {steps.map((step, i) => {
          const done = i < currentStep;
          const active = i === currentStep;
          
          return (
            <div key={i} className="flex items-center gap-3">
              <div 
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold transition-all duration-300"
                style={{
                  background: done ? `${color}18` : active ? `${color}28` : 'rgba(255,255,255,0.03)',
                  border: `1.5px solid ${i <= currentStep ? color : 'rgba(255,255,255,0.08)'}`,
                  color: i <= currentStep ? color : 'rgba(255,255,255,0.15)',
                  boxShadow: active ? `0 0 10px ${color}55` : 'none'
                }}
              >
                {done ? '✓' : i + 1}
              </div>
              <span 
                className="text-xs tracking-wide"
                style={{ 
                  color: active ? 'white' : done ? color : 'rgba(255,255,255,0.2)'
                }}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LoadingOverlay;
