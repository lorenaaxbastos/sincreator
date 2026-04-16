import type { BlockSlice } from './slices/blockSlice';
import type { SummarySlice } from './slices/summarySlice';
import type { SupportMaterialSlice } from './slices/supportMaterialSlice';
import type { StoreApi } from 'zustand';

export type CreationState = BlockSlice & SummarySlice & SupportMaterialSlice;

export type SliceCreator<T> = (
  set: StoreApi<CreationState>['setState'],
  get: StoreApi<CreationState>['getState'],
  api: StoreApi<CreationState>,
) => T;
