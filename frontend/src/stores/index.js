import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      profile: null,
      simulations: [],
      battles: [],
      roadmaps: [],
      chatSessions: [],
      
      setProfile: (profile) => set({ profile }),
      addSimulation: (simulation) => set((state) => ({
        simulations: [simulation, ...state.simulations].slice(0, 10)
      })),
      addBattle: (battle) => set((state) => ({
        battles: [battle, ...state.battles].slice(0, 10)
      })),
      addRoadmap: (roadmap) => set((state) => ({
        roadmaps: [roadmap, ...state.roadmaps].slice(0, 10)
      })),
      addChatSession: (session) => set((state) => ({
        chatSessions: [session, ...state.chatSessions].slice(0, 20)
      })),
      clearHistory: () => set({ simulations: [], battles: [], roadmaps: [], chatSessions: [] })
    }),
    {
      name: 'forge-user-storage',
      partialize: (state) => ({
        profile: state.profile,
        simulations: state.simulations,
        battles: state.battles,
        roadmaps: state.roadmaps,
        chatSessions: state.chatSessions
      })
    }
  )
);

export const useAppStore = create((set) => ({
  ollamaStatus: { connected: false, url: 'http://192.168.43.139:11434' },
  activeModule: 'SIMULATE',
  isLoading: false,
  
  setOllamaStatus: (status) => set({ ollamaStatus: status }),
  setActiveModule: (module) => set({ activeModule: module }),
  setLoading: (loading) => set({ isLoading: loading })
}));

export const useChatStore = create((set, get) => ({
  messages: [{
    role: 'assistant',
    content: "Hello! I'm your personal AI Mentor. I can help with career advice, goal-setting, overcoming challenges, mindset coaching, and life decisions.\n\nWhat's on your mind today?"
  }],
  persona: 'Career Coach',
  isTyping: false,
  
  setPersona: (persona) => set({ persona }),
  addMessage: (role, content) => set((state) => ({
    messages: [...state.messages, { role, content }]
  })),
  setTyping: (typing) => set({ isTyping: typing }),
  clearChat: () => set({
    messages: [{
      role: 'assistant',
      content: "Session reset. I'm here — what would you like to explore?"
    }]
  })
}));
