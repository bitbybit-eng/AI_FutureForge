import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores';

function ParticleBackground() {
  const canvasRef = useRef(null);
  const { ollamaStatus } = useAppStore();
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    // Get accent color based on module
    const color = '#00f5ff';
    
    const particles = Array.from({ length: 85 }, () => ({
      x: Math.random() * 1920,
      y: Math.random() * 1080,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.6 + 0.3,
      a: Math.random() * 0.35 + 0.05,
      t: Math.random() > 0.65 ? 'a' : 'b'
    }));
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.t === 'a' ? color : '#a855f7';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw connections
      ctx.globalAlpha = 0.04;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (dx * dx + dy * dy < 8100) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [ollamaStatus]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      />
      <div 
        className="fixed top-[8%] left-[3%] w-[500px] h-[500px] rounded-full pointer-events-none z-0 transition-all duration-1000"
        style={{
          background: 'radial-gradient(circle, rgba(0,245,255,0.04) 0%, transparent 70%)'
        }}
      />
      <div className="fixed bottom-[8%] right-[3%] w-[350px] h-[350px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)' }}
      />
    </>
  );
}

export default ParticleBackground;
