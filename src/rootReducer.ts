import { routerReducer, RouterState } from 'react-router-redux';
import { combineReducers } from 'redux';

export interface GlobalState {
  router: RouterState;
}

export default combineReducers<GlobalState>({
  router: routerReducer,
});
