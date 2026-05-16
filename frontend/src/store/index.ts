import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { StoreState } from './types';
import { createGraphSlice } from './slices/graphSlice';
import { createUiSlice } from './slices/uiSlice';
import { createWorkflowSlice } from './slices/workflowSlice';
import { createValidationSlice } from './slices/validationSlice';
import { createCollaborationSlice } from './slices/collaborationSlice';

export const useStore = create<StoreState>()(
  immer((...a) => ({
    ...createGraphSlice(...a),
    ...createUiSlice(...a),
    ...createWorkflowSlice(...a),
    ...createValidationSlice(...a),
    ...createCollaborationSlice(...a),
  }))
);
