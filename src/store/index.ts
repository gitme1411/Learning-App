import {combineReducers, configureStore} from '@reduxjs/toolkit';
import topicsSlice from './topics';
import questionsSlice from './questions';
import finalTestSlice from './finalTest';
import practiceSlice from './practice';
import userSlice from './user';
import quesStatisSlice from './quesStatis';
import createStepPlanSlice from './stepPlan';
import authSlice from './authSlice';
import configSlice from './config';
import likedQuestionsSlice from './likedQuestionsSlice';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const reducers = combineReducers({
  topics: topicsSlice,
  questions: questionsSlice,
  finalTest: finalTestSlice,
  createStepPlan: createStepPlanSlice,
  practice: practiceSlice,
  user: userSlice,
  quesStatis: quesStatisSlice,
  auth: authSlice,
  config: configSlice,
  listFavorite: likedQuestionsSlice,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Make sure this is correctly set up
  blacklist: ['topics', 'practice', 'finalTest', 'quesStatis'],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

const persistor = persistStore(store);

export {store, persistor};

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
