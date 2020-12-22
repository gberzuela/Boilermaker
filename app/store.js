import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './redux';

export default createStore(
	reducers,
	applyMiddleware(thunkMiddleware, createLogger())
);
