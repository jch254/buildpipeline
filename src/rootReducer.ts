import { combineReducers } from 'redux';

export interface GlobalState {
  // Add your app-specific state here
}

const rootReducer = combineReducers({
  // Add your reducers here
  // For now, just a placeholder to keep the structure
  app: (state = {}, action: any) => state,
});

export default rootReducer;
