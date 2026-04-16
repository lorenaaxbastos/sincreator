import { produce } from 'immer';
import type { CreationState, SliceCreator } from '../storeTypes';

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

export interface SummarySlice {
  summary: CreationSummary;
  setSummary: (summary: Partial<CreationSummary>) => void;
}

export const createSummarySlice: SliceCreator<SummarySlice> = set => ({
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

  setSummary: newSummary => {
    set(
      produce((state: CreationState) => {
        Object.assign(state.summary, newSummary);
      }),
    );
  },
});
