import { useEffect } from 'react';
import { useAppStore } from './stores';
import { getOllamaStatus } from './lib/api';
import Header from './components/Header';
import Nav from './components/Nav';
import Simulate from './pages/Simulate';
import Battle from './pages/Battle';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Mentor from './pages/Mentor';
import ParticleBackground from './components/ParticleBackground';

const MODULES = ['SIMULATE', 'BATTLE', 'SKILL GAP', 'ROADMAP', 'MENTOR'];

function App() {
  const { activeModule, setActiveModule, setOllamaStatus } = useAppStore();

  useEffect(() => {
    // Check Ollama status on load
    getOllamaStatus()
      .then((status) => setOllamaStatus(status))
      .catch(() => setOllamaStatus({ connected: false, error: 'Failed to connect' }));
  }, []);

  const renderModule = () => {
    switch (activeModule) {
      case 'SIMULATE': return <Simulate />;
      case 'BATTLE': return <Battle />;
      case 'SKILL GAP': return <SkillGap />;
      case 'ROADMAP': return <Roadmap />;
      case 'MENTOR': return <Mentor />;
      default: return <Simulate />;
    }
  };

  return (
    <div className="min-h-screen bg-forge-bg relative overflow-hidden">
      <ParticleBackground />
      <div className="fixed inset-0 grid-overlay pointer-events-none z-0"></div>
      <div className="fixed left-0 right-0 h-0.5 bg-forge-cyan/5 z-10 animate-[scanline_9s_linear_infinite]" style={{ animation: 'scanline 9s linear infinite' }}></div>
      
      <div className="relative z-20 max-w-6xl mx-auto px-4 py-6">
        <Header />
        <Nav modules={MODULES} activeModule={activeModule} onModuleChange={setActiveModule} />
        <main className="animate-fade-in">
          {renderModule()}
        </main>
        <footer className="mt-12 text-center border-t border-white/5 pt-6">
          <p className="text-white/8 text-xs tracking-widest">AI FUTUREFORGE · POWERED BY OLLAMA · SHAPE YOUR DESTINY</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
