import { produce } from 'immer';
import type { SupportMaterial } from '../../schemas/supportMaterialSchema';
import type { CreationState, SliceCreator } from '../storeTypes';

export interface SupportMaterialSlice {
  materials: SupportMaterial[];
  addMaterial: (material: SupportMaterial) => void;
  updateMaterial: (id: string, updatedMaterial: SupportMaterial) => void;
  removeMaterial: (id: string) => void;
  setMaterials: (materials: SupportMaterial[]) => void;
}

export const createSupportMaterialSlice: SliceCreator<SupportMaterialSlice> = set => ({
  materials: [],

  addMaterial: material => {
    set(
      produce((state: CreationState) => {
        state.materials.push(material);
      }),
    );
  },

  updateMaterial: (id, updatedMaterial) => {
    set(
      produce((state: CreationState) => {
        const index = state.materials.findIndex(m => m.id === id);
        if (index !== -1) {
          state.materials[index] = updatedMaterial;
        }
      }),
    );
  },

  removeMaterial: id => {
    set(
      produce((state: CreationState) => {
        state.materials = state.materials.filter(m => m.id !== id);
      }),
    );
  },

  setMaterials: materials => {
    set(
      produce((state: CreationState) => {
        state.materials = materials;
      }),
    );
  },
});
