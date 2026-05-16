import { StoreSlice, ValidationSlice } from '../types';
import { validationApi } from '@/api/validationApi';
import { SystemNode, SystemEdge } from '@/types/graph.types';

export const createValidationSlice: StoreSlice<ValidationSlice> = (set, get) => ({
  issues: [],
  isValidating: false,
  
  runValidation: async () => {
    const { nodes, edges } = get();
    set((state) => { state.isValidating = true; });
    try {
      const report = await validationApi.analyzeArchitecture(nodes as SystemNode[], edges as SystemEdge[]);
      set((state) => {
        state.issues = report.issues;
      });
    } catch (error) {
      console.error("Failed to run architecture validation", error);
    } finally {
      set((state) => { state.isValidating = false; });
    }
  },

  clearValidation: () => {
    set((state) => {
      state.issues = [];
    });
  }
});
