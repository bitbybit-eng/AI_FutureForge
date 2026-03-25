const MOD_COLORS = {
  'SIMULATE': '#00f5ff',
  'BATTLE': '#ff6b35',
  'SKILL GAP': '#a855f7',
  'ROADMAP': '#22c55e',
  'MENTOR': '#f59e0b'
};

const MOD_ICONS = {
  'SIMULATE': '◈',
  'BATTLE': '⚔',
  'SKILL GAP': '◎',
  'ROADMAP': '⟴',
  'MENTOR': '✦'
};

const MOD_DESC = {
  'SIMULATE': 'Life trajectory engine',
  'BATTLE': 'Decision analysis AI',
  'SKILL GAP': 'Competency scanner',
  'ROADMAP': 'Growth path builder',
  'MENTOR': 'Personal AI advisor'
};

function Nav({ modules, activeModule, onModuleChange }) {
  return (
    <nav className="flex mb-6 bg-white/5 border border-white/5">
      {modules.map((mod) => {
        const isActive = mod === activeModule;
        const color = MOD_COLORS[mod];
        
        return (
          <button
            key={mod}
            onClick={() => onModuleChange(mod)}
            className={`
              flex-1 py-3.5 px-2 text-center transition-all duration-200 border-b-2
              flex flex-col items-center gap-1
              ${isActive 
                ? 'text-white border-b-2' 
                : 'text-white/30 border-b-2 border-transparent hover:text-white/60'
              }
            `}
            style={{
              background: isActive ? `${color}0e` : 'transparent',
              borderBottomColor: isActive ? color : 'transparent',
              color: isActive ? color : undefined
            }}
          >
            <span 
              className="text-base"
              style={{
                filter: isActive ? `drop-shadow(0 0 7px ${color})` : 'none'
              }}
            >
              {MOD_ICONS[mod]}
            </span>
            <span className="text-[9px] tracking-wider font-bold uppercase">{mod}</span>
            {isActive && (
              <span 
                className="text-[7px] tracking-wider hidden sm:block"
                style={{ color: `${color}77` }}
              >
                {MOD_DESC[mod]}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

export default Nav;
