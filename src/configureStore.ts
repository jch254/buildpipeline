import { composeWithDevTools } from '@redux-devtools/extension';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

export const history = createBrowserHistory();

const dev = process.env.NODE_ENV !== 'production';
const sagaMiddleware = createSagaMiddleware();
let middleware = applyMiddleware(sagaMiddleware);

if (dev) {
  middleware = composeWithDevTools(middleware);
}

export default () => {
  const store = createStore(rootReducer, {}, middleware);

  sagaMiddleware.run(rootSaga);

  return store;
};
