  
import { configureStore, Action } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './rootReducer';
import thunk, { ThunkAction } from 'redux-thunk';
import { logger } from 'redux-logger';

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
});

if (process.env.NODE_ENV === 'development' && (module as any).hot) {
  (module as any).hot?.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}

export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>;
export default store;