import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import Toast from 'react-native-toast-message';
import AppNavigator from './navigators';
import {persistor, store} from './store';
import NotificationHandler from './notification/NotificationHandler';
import messaging from '@react-native-firebase/messaging';
import {AppProvider, RealmProvider} from '@realm/react';
import Topic from './model/topic';
import {Level} from './model/level';
import {Question} from './model/question';
import {Answer} from './model/answer';
import Pivot from './model/pivot';
import TopicInfo from './model/topic_info';
import Practice from './model/practice';
import FinalTest from './model/final_test';
import WrongQuestion from './model/wrong_question';
import {Wrong} from './model/wrong';
import Favorite from './model/favorite';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const App = () => {
  return (
    <AppProvider id={'com.aucitizenshiptest2024'}>
      <RealmProvider
        schema={[
          TopicInfo,
          Pivot,
          Answer,
          Question,
          Level,
          Topic,
          Practice,
          FinalTest,
          Wrong,
          WrongQuestion,
          Favorite,
        ]}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <GestureHandlerRootView style={{flex: 1}}>
              <AppNavigator />
              <NotificationHandler />
              <Toast />
            </GestureHandlerRootView>
          </PersistGate>
        </Provider>
      </RealmProvider>
    </AppProvider>
  );
};

export default App;
