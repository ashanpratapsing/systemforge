import { StoreSlice, WorkflowSlice } from '../types';

export const createWorkflowSlice: StoreSlice<WorkflowSlice> = (set) => ({
  isSimulating: false,
  simulationStep: 0,
  
  startSimulation: () => {
    set((state) => {
      state.isSimulating = true;
      state.simulationStep = 0;
    });
  },
  
  stopSimulation: () => {
    set((state) => {
      state.isSimulating = false;
    });
  },
  
  nextSimulationStep: () => {
    set((state) => {
      state.simulationStep += 1;
    });
  },
});
