import { create } from 'zustand';
import type { SupportMaterial } from '../schemas/supportMaterialSchema';

export interface CreationSummary {
  name?: string | null;
  format?: string | null;
  duration?: number | null;
  qtyPeople?: number | null;
  qtySessions?: number | null;
  qtyTrainers?: number | null;
  isAtTheSameTime?: boolean | null;
  target?: string | null;
  dateAndHour?: string | null;
  place?: string | null;
  qtyRooms?: number | null;
}

interface CreationState {
  summary: CreationSummary;
  materials: SupportMaterial[];
  setSummary: (summary: Partial<CreationSummary>) => void;
  addMaterial: (material: SupportMaterial) => void;
  updateMaterial: (id: string, updatedMaterial: SupportMaterial) => void;
  removeMaterial: (id: string) => void;
  setMaterials: (materials: SupportMaterial[]) => void;
}

export const useCreationStore = create<CreationState>(set => ({
  summary: {
    name: null,
    format: null,
    duration: null,
    qtyPeople: null,
    qtySessions: null,
    qtyTrainers: null,
    isAtTheSameTime: null,
    target: null,
    dateAndHour: null,
    place: null,
    qtyRooms: null,
  },
  materials: [],

  setSummary: newSummary => {
    set(state => ({
      summary: { ...state.summary, ...newSummary },
    }));
  },

  addMaterial: material => {
    set(state => ({
      materials: [...state.materials, material],
    }));
  },

  updateMaterial: (id, updatedMaterial) => {
    set(state => ({
      materials: state.materials.map(material => (material.id === id ? updatedMaterial : material)),
    }));
  },

  removeMaterial: id => {
    set(state => ({
      materials: state.materials.filter(material => material.id !== id),
    }));
  },

  setMaterials: materials => {
    set({ materials });
  },
}));
