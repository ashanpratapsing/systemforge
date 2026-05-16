import { StoreSlice, UiSlice } from '../types';

export const createUiSlice: StoreSlice<UiSlice> = (set) => ({
  selectedNodeId: null,
  isSidebarOpen: true,
  isSaving: false,
  isLoading: false,
  
  setSelectedNodeId: (id) => {
    set((state) => {
      state.selectedNodeId = id;
    });
  },
  
  toggleSidebar: () => {
    set((state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    });
  },
  
  setSaving: (saving) => {
    set((state) => {
      state.isSaving = saving;
    });
  },
  
  setLoading: (loading) => {
    set((state) => {
      state.isLoading = loading;
    });
  },
});
