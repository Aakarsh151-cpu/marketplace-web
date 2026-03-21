import { create } from 'zustand';

// 1. Strict typing for your startup's data
export interface WorkOrder {
  id: string;
  category: string;
  urgency: string;
  summary: string;
}

interface AppState {
  // Shared state between Customer and Provider
  activeLeads: WorkOrder[];
  addLead: (lead: WorkOrder) => void;
  removeLead: (id: string) => void;
  techLocation: { lat: number; lng: number } | null;
  setTechLocation: (location: { lat: number; lng: number } | null) => void;
}

// 2. The Zustand Store
export const useAppStore = create<AppState>((set) => ({
  activeLeads: [],
  addLead: (lead) => set((state) => ({ 
    activeLeads: [...state.activeLeads, lead] 
  })),
  removeLead: (id) => set((state) => ({ 
    activeLeads: state.activeLeads.filter(l => l.id !== id) 
  })),
  techLocation: null,
  setTechLocation: (location) => set({ techLocation: location }),
}));