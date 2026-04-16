import { create } from 'zustand';
import { createSummarySlice } from './slices/summarySlice';
import { createSupportMaterialSlice } from './slices/supportMaterialSlice';
import type { CreationState } from './storeTypes';

export const useCreationStore = create<CreationState>()((set, get, api) => ({
  ...createSummarySlice(set, get, api),
  ...createSupportMaterialSlice(set, get, api),
}));
