import { combineReducers } from 'redux';

export type GlobalState = Record<string, never>;

const rootReducer = combineReducers({
  // Add your reducers here
  // For now, just a placeholder to keep the structure
  app: (state = {}) => state,
});

export default rootReducer;
