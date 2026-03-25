import { useAppStore } from '../stores';

function Header() {
  const { ollamaStatus } = useAppStore();

  return (
    <header className="text-center mb-8 pb-6 border-b border-white/5">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forge-cyan/5 border border-forge-cyan/20 rounded-none mb-4">
        <div className="w-1.5 h-1.5 bg-forge-cyan rounded-full animate-pulse"></div>
        <span className="text-forge-cyan text-[9px] tracking-widest">LIFE NAVIGATION SYSTEM · v1.0</span>
        <div className="w-1.5 h-1.5 bg-forge-cyan rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <h1 className="font-orbitron text-4xl md:text-5xl font-black tracking-wider animate-glow mb-2">
        AI FUTURE<span className="text-forge-cyan">FORGE</span>
      </h1>
      
      <p className="text-white/25 text-xs tracking-[0.3em] mb-6">SIMULATE · DECIDE · TRANSFORM · GROW</p>
      
      <div className="flex items-center justify-center gap-2">
        <div className="h-px w-32 bg-gradient-to-r from-transparent to-forge-cyan/30"></div>
        <div className="flex gap-1">
          {['◈', '⚔', '◎', '⟴', '✦'].map((icon, i) => (
            <div 
              key={i}
              className="w-6 h-6 flex items-center justify-center text-[10px] border border-white/10 rounded-none"
              style={{ 
                background: ['#00f5ff18', '#ff6b3518', '#a855f718', '#22c55e18', '#f59e0b18'][i],
                borderColor: ['#00f5ff30', '#ff6b3530', '#a855f730', '#22c55e30', '#f59e0b30'][i],
                color: ['#00f5ff', '#ff6b35', '#a855f7', '#22c55e', '#f59e0b'][i]
              }}
            >
              {icon}
            </div>
          ))}
        </div>
        <div className="h-px w-32 bg-gradient-to-l from-transparent to-forge-cyan/30"></div>
      </div>
      
      {/* Ollama Status */}
      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 text-[10px]">
        <div className={`w-2 h-2 rounded-full ${ollamaStatus.connected ? 'bg-forge-green' : 'bg-forge-orange'}`}></div>
        <span className="text-white/40">
          Ollama: {ollamaStatus.connected ? 'Connected' : 'Offline'}
        </span>
        <span className="text-white/20">{ollamaStatus.url}</span>
      </div>
    </header>
  );
}

export default Header;
