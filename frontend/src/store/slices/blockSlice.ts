import { produce } from 'immer';
import type { SlideData } from '../../schemas/slideSchema';
import type { CreationState, SliceCreator } from '../storeTypes';

export interface Activity {
  id: string;
  name: string;
  duration: number;
  slides: SlideData[];
}

export interface Block {
  id: string;
  name: string;
  duration: number;
  activities: Activity[];
}

export interface BlockSlice {
  blocks: Block[];
  setBlocks: (blocks: Block[]) => void;
  addSlide: (blockId: string, activityId: string, slide: SlideData) => void;
  updateSlide: (
    blockId: string,
    activityId: string,
    slideId: string,
    updatedSlide: SlideData,
  ) => void;
  removeSlide: (blockId: string, activityId: string, slideId: string) => void;
}

export const createBlockSlice: SliceCreator<BlockSlice> = set => ({
  blocks: [],

  setBlocks: blocks => {
    set(
      produce((state: CreationState) => {
        state.blocks = blocks;
      }),
    );
  },

  addSlide: (blockId, activityId, slide) => {
    set(
      produce((state: CreationState) => {
        const block = state.blocks.find(b => b.id === blockId);
        const activity = block?.activities.find(a => a.id === activityId);
        if (activity) {
          activity.slides.push(slide);
        }
      }),
    );
  },

  updateSlide: (blockId, activityId, slideId, updatedSlide) => {
    set(
      produce((state: CreationState) => {
        const block = state.blocks.find(b => b.id === blockId);
        const activity = block?.activities.find(a => a.id === activityId);
        const slideIndex = activity?.slides.findIndex(s => s.id === slideId);

        if (activity && slideIndex !== undefined && slideIndex !== -1) {
          activity.slides[slideIndex] = updatedSlide;
        }
      }),
    );
  },

  removeSlide: (blockId, activityId, slideId) => {
    set(
      produce((state: CreationState) => {
        const block = state.blocks.find(b => b.id === blockId);
        const activity = block?.activities.find(a => a.id === activityId);
        if (activity) {
          activity.slides = activity.slides.filter(s => s.id !== slideId);
        }
      }),
    );
  },
});
