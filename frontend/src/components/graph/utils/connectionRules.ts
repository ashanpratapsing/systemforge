import { Connection } from '@xyflow/react';

/**
 * Evaluates whether a requested connection is valid based on business rules.
 * 
 * Future extensibility: 
 * This can be expanded to check actual node types (e.g., prevent database -> frontend connections)
 * by passing the full nodes array and doing semantic checks.
 */
export const isValidSystemConnection = (connection: Connection): boolean => {
  // 1. Prevent connecting a node to itself
  if (connection.source === connection.target) {
    return false;
  }

  // Add more complex rules here later as we integrate the AI Validation Engine
  return true;
};
