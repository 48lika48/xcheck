import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './rootReducer';
import thunk from "redux-thunk";
import { logger } from "redux-logger";

const store =  configureStore({
  reducer: rootReducer,
  middleware: [thunk, logger],
});

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default
    store.replaceReducer(newRootReducer)
  })
}

export default store;
