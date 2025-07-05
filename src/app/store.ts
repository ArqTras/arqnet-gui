import { configureStore } from '@reduxjs/toolkit';
import { appLogsSlice } from '../features/appLogsSlice';
import { statusSlice } from '../features/statusSlice';
import { uiSlice } from '../features/uiStatusSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    status: statusSlice.reducer,
    uiStatus: uiSlice.reducer,
    appLogsStatus: appLogsSlice.reducer
  },
  middleware: (getDefaultMiddleware) => 
    process.env.REDUX_LOGGER
      ? getDefaultMiddleware().concat(logger)
      : getDefaultMiddleware()
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
