import { createContext, useReducer } from 'react';

const initialState = {
  currentAnalysis: null,
  history: [],
  loading: false,
  error: null
};

export const AnalysisContext = createContext({
  state: initialState,
  dispatch: () => undefined
});

function reducer(state, action) {
  switch (action.type) {
    case 'REQUEST_START':
      return { ...state, loading: true, error: null };
    case 'REQUEST_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'SET_ANALYSIS':
      return { ...state, loading: false, error: null, currentAnalysis: action.payload };
    case 'SET_HISTORY':
      return { ...state, loading: false, error: null, history: action.payload };
    case 'REMOVE_HISTORY_ITEM':
      return {
        ...state,
        history: state.history.filter((item) => item.id !== action.payload),
        currentAnalysis: state.currentAnalysis?.id === action.payload ? null : state.currentAnalysis
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AnalysisProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AnalysisContext.Provider value={{ state, dispatch }}>{children}</AnalysisContext.Provider>;
}
