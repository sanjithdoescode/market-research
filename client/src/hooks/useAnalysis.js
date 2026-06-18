import { useCallback, useContext } from 'react';

import { deleteHistoryItem, fetchHistory, fetchHistoryItem, submitAnalysis } from '../api/analysisApi.js';
import { AnalysisContext } from '../context/AnalysisContext.jsx';

export function useAnalysis() {
  const { state, dispatch } = useContext(AnalysisContext);

  const createAnalysis = useCallback(
    async (input) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        const analysis = await submitAnalysis(input);
        dispatch({ type: 'SET_ANALYSIS', payload: analysis });
        return analysis;
      } catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', payload: error.message });
        throw error;
      }
    },
    [dispatch]
  );

  const loadAnalysis = useCallback(
    async (id) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        const analysis = await fetchHistoryItem(id);
        dispatch({ type: 'SET_ANALYSIS', payload: analysis });
        return analysis;
      } catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', payload: error.message });
        throw error;
      }
    },
    [dispatch]
  );

  const loadHistory = useCallback(
    async (limit = 25) => {
      dispatch({ type: 'REQUEST_START' });
      try {
        const history = await fetchHistory(limit);
        dispatch({ type: 'SET_HISTORY', payload: history });
        return history;
      } catch (error) {
        dispatch({ type: 'REQUEST_FAILURE', payload: error.message });
        throw error;
      }
    },
    [dispatch]
  );

  const removeHistoryItem = useCallback(
    async (id) => {
      await deleteHistoryItem(id);
      dispatch({ type: 'REMOVE_HISTORY_ITEM', payload: id });
    },
    [dispatch]
  );

  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [dispatch]);

  return {
    state,
    createAnalysis,
    loadAnalysis,
    loadHistory,
    removeHistoryItem,
    clearError
  };
}
