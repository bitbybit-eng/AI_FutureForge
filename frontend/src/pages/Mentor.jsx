import { useState, useEffect, useRef } from 'react';
import { sendMentorMessage, createMentorStream } from '../lib/api';
import { useChatStore } from '../stores';

const PERSONAS = {
  'Career Coach': 'Expert career coach helping professionals land top jobs and reach leadership.',
  'Life Coach': 'Certified life coach specializing in work-life balance and personal growth.',
  'Startup Mentor': 'Serial entrepreneur with multiple successful exits.',
  'Academic Advisor': 'Top university advisor maximizing education ROI.',
  'Mindset Coach': 'High-performance mindset coach for peak performance.'
};

const QUICK_PROMPTS = [
  "I don't know what career to choose",
  "How do I stop procrastinating?",
  "Should I quit my job to follow my passion?",
  "I feel stuck — what should I do?",
  "How do I build self-confidence?"
];

function Mentor() {
  const { messages, persona, isTyping, setPersona, addMessage, setTyping, clearChat } = useChatStore();
  const [input, setInput] = useState('');
  const [ws, setWs] = useState(null);
  const chatEndRef = useRef(null);
  const color = '#f59e0b';

  useEffect(() => {
    // Create WebSocket connection
    const websocket = createMentorStream(
      (data) => {
        if (data.type === 'TYPING') {
          setTyping(true);
        } else if (data.type === 'TOKEN') {
          setTyping(false);
          // Append token to last message
          const msgs = useChatStore.getState().messages;
          if (msgs.length > 0 && msgs[msgs.length - 1].role === 'assistant') {
            const lastMsg = msgs[msgs.length - 1];
            useChatStore.setState({
              messages: [...msgs.slice(0, -1), { ...lastMsg, content: lastMsg.content + data.content }]
            });
          }
        } else if (data.type === 'DONE') {
          setTyping(false);
        } else if (data.type === 'ERROR') {
          setTyping(false);
          addMessage('assistant', 'I encountered an error. Please try again.');
        }
      },
      (error) => {
        console.error('WebSocket error:', error);
        setTyping(false);
      }
    );

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    addMessage('user', userMsg);

    if (ws && ws.readyState === WebSocket.OPEN) {
      // Use WebSocket streaming
      const history = useChatStore.getState().messages.slice(0, -1).map(m => ({ role: m.role, content: m.content }));
      ws.send(JSON.stringify({
        type: 'MENTOR_STREAM',
        payload: {
          prompt: userMsg,
          persona: useChatStore.getState().persona,
          history
        }
      }));
    } else {
      // Fallback to REST API
      setTyping(true);
      try {
        const history = useChatStore.getState().messages.map(m => ({ role: m.role, content: m.content }));
        const { response } = await sendMentorMessage({
          message: userMsg,
          persona: useChatStore.getState().persona,
          history
        });
        addMessage('assistant', response);
      } catch (error) {
        addMessage('assistant', 'I encountered an error. Please try again.');
      } finally {
        setTyping(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Section Header */}
      <div className="border-l-2 border-forge-yellow pl-4">
        <div className="text-forge-yellow text-[10px] tracking-widest mb-1">MODULE 05</div>
        <h2 className="font-orbitron text-xl md:text-2xl font-bold tracking-wider mb-1">AI MENTOR CHAT</h2>
        <p className="text-white/30 text-xs tracking-wide">Real-time coaching from your personal AI advisor — career, life, mindset & beyond</p>
      </div>

      {/* Persona Selector */}
      <div className="panel">
        <div className="text-[9px] tracking-widest uppercase mb-3" style={{ color }}>SELECT MENTOR PERSONA</div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(PERSONAS).map((p) => (
            <button
              key={p}
              onClick={() => setPersona(p)}
              className="px-4 py-2 text-[11px] tracking-wide border transition-all"
              style={{
                background: persona === p ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.025)',
                borderColor: persona === p ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                color: persona === p ? '#f59e0b' : 'rgba(255,255,255,0.35)',
                boxShadow: persona === p ? '0 0 12px rgba(245,158,11,0.25)' : 'none'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="panel p-0 overflow-hidden">
        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-5 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                style={{ 
                  background: msg.role === 'user' ? 'rgba(0,245,255,0.1)' : 'rgba(245,158,11,0.1)',
                  border: `1.5px solid ${msg.role === 'user' ? '#00f5ff' : '#f59e0b'}`,
                  color: msg.role === 'user' ? '#00f5ff' : '#f59e0b'
                }}
              >
                {msg.role === 'user' ? 'U' : '✦'}
              </div>
              <div 
                className="max-w-[76%] p-3"
                style={{ 
                  background: msg.role === 'user' ? 'rgba(0,245,255,0.05)' : 'rgba(245,158,11,0.04)',
                  border: `1px solid ${msg.role === 'user' ? 'rgba(0,245,255,0.18)' : 'rgba(245,158,11,0.12)'}`
                }}
              >
                <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 animate-fade-in">
              <div 
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ 
                  background: 'rgba(245,158,11,0.1)',
                  border: '1.5px solid #f59e0b',
                  color: '#f59e0b'
                }}
              >
                ✦
              </div>
              <div 
                className="p-3"
                style={{ 
                  background: 'rgba(245,158,11,0.04)',
                  border: '1px solid rgba(245,158,11,0.12)'
                }}
              >
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-forge-yellow typing-dot"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-forge-yellow typing-dot"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-forge-yellow typing-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts (only on first message) */}
        {messages.length === 1 && (
          <div className="border-t border-white/5 p-4">
            <div className="text-white/18 text-[9px] tracking-widest mb-2">QUICK STARTS</div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => { setInput(prompt); }}
                  className="px-3 py-1.5 text-[10px] border transition-all"
                  style={{ 
                    background: 'rgba(245,158,11,0.04)',
                    borderColor: 'rgba(245,158,11,0.15)',
                    color: 'rgba(245,158,11,0.6)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.1)';
                    e.currentTarget.style.color = '#f59e0b';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.04)';
                    e.currentTarget.style.color = 'rgba(245,158,11,0.6)';
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-white/5 p-4 flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your mentor anything... (Enter to send, Shift+Enter for new line)"
            rows="2"
            className="flex-1 bg-white/5 border border-forge-yellow/20 border-b-2 border-b-forge-yellow px-3 py-2 text-sm resize-none"
            style={{ borderBottomColor: color }}
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="px-4 py-2 font-bold tracking-widest uppercase border-2 self-end disabled:opacity-40 transition-all"
            style={{ 
              borderColor: color, 
              color, 
              background: `linear-gradient(135deg, ${color}14, ${color}06)`
            }}
          >
            SEND ▶
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <button
          onClick={clearChat}
          className="px-4 py-2 text-[10px] tracking-widest border border-white/08 text-white/25 hover:border-white/20 hover:text-white/40 transition-all"
        >
          ↺ NEW SESSION
        </button>
      </div>
    </div>
  );
}

export default Mentor;
