import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';

export interface GlobalState {
  router: RouterState;
}

const rootReducer = (history: History) => combineReducers({
  router: connectRouter(history),
});

export default rootReducer;
