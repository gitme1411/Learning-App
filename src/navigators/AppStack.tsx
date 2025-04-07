import React, {Component, useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import AllTopics from '../screens/AllTopics';
import MainTab from './MainTab';
import Topic from '../screens/Topic';
import Level from '../screens/Level';
import Questions from '../screens/Questions';
import FlashCard from '../screens/FlashCard';
import Detail from '../screens/Detail';
import DPractice from '../screens/Practice/DPractice';
import DSQues from '../screens/StatisticcQues/DSQues';
import DetailTopic from '../screens/Statistics/DetailTopic';
import DetailDays from '../screens/Statistics/DetailDays';
import PassingTopicScreen from '../screens/PassTopic';
import FinalTest from '../screens/FinalTest';
import QuestionTest from '../screens/FinalTest/QuestionTest';
import PassingTest from '../screens/PassTest';
import Standard from '../screens/Practice/Standard';
import QuestionPractice from '../screens/Practice/QuestionPractice';
import PassingPractice from '../screens/PassPractice';
import QuestionsStatistics from '../screens/QuestionsStatistics';
import FavoriteQuestions from '../screens/QuestionsStatistics/FavoriteQues';
import WrongQuestions from '../screens/QuestionsStatistics/WrongQues';
import WrongSetup from '../screens/QuestionsStatistics/WrongQues/WrongSetup';
import WrongTest from '../screens/QuestionsStatistics/WrongQues/WrongTest';
import FavoriteSetup from '../screens/QuestionsStatistics/FavoriteQues/FavoriteSetup';
import FavoriteTest from '../screens/QuestionsStatistics/FavoriteQues/FavoriteTest';
import SetupTest from '../screens/Practice/CustomPractice';
import QuestionCustomP from '../screens/Practice/CustomPractice/Questions';
import WeakQuestions from '../screens/QuestionsStatistics/WeakQues';
import HardestQuestions from '../screens/QuestionsStatistics/HardestQues';
import PassingFinalTest from '../screens/PassFinalTest';
import PassingCustomPractice from '../screens/Practice/CustomPractice/PassingCustomPractice';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logout, restoreToken} from '../store/authSlice';
import StepPlanFirst from '../screens/SetUpPlanStudy/StepPlanFirst';
import StepPlanSecond from '../screens/SetUpPlanStudy/StepPlanSecond';
import StepPlanThree from '../screens/SetUpPlanStudy/StepPlanThree';
import CreateStudyPlan from '../screens/SetUpPlanStudy/CreateStudyPlan';
import ChartStudyPlanScreen from '../screens/SetUpPlanStudy/CreateStudyPlan/chartSetUpScreen';
import LogOutScreen from '../screens/LogOutScreen';
import Splash from '../screens/Splash';
import WrongResult from '../screens/QuestionsStatistics/WrongQues/WrongResult';
import PushNotificationScreen from '../notification/PushNotificationScreen';
import DeleteAccount from '@/screens/DeleteAccount';
import {EVENT_REGISTER} from '@/utils/constant';
import EventRegister from '@/utils/eventRegister';
import {resetLikedQuestions} from '@/store/likedQuestionsSlice';
import {
  setDataStudyPlan,
  setIsWaitRemoveAccount,
  setResetTodayPlan,
} from '@/store/config';
import {useNavigation} from '@react-navigation/native';
import ToastSimple from 'react-native-simple-toast';
const Stack = createNativeStackNavigator();

const AppStack = () => {
  const hasOnboarded = useSelector(
    (state: RootState) => state.auth.hasOnboarded,
  );

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const listenerShowLogout = () => {
    EventRegister.on(EVENT_REGISTER.EVENT_LOG_OUT, async isLogout => {
      if (isLogout) {
        dispatch(logout());
        dispatch(resetLikedQuestions());
        dispatch(setResetTodayPlan());
        dispatch(setIsWaitRemoveAccount(false));
        dispatch(setDataStudyPlan(null));
        ToastSimple.showWithGravity(
          'Your account has been deleted',
          ToastSimple.LONG,
          ToastSimple.BOTTOM,
        );
        navigation.navigate('Home');
      }
    });
  };

  useEffect(() => {
    listenerShowLogout();
    // callListCountry()
    return () => {
      EventRegister.removeEventListener(EVENT_REGISTER.EVENT_LOG_OUT);
    };
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={
        hasOnboarded === 'MainTab' ? 'MainTab' : 'StepPlanFirst'
      }>
      <Stack.Screen name="MainTab" component={MainTab} />
      <Stack.Screen name="AllTopics" component={AllTopics} />
      <Stack.Screen name="Topic" component={Topic} />
      <Stack.Screen name="Level" component={Level} />
      <Stack.Screen name="Questions" component={Questions} />
      <Stack.Screen name="FlashCard" component={FlashCard} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="SetupTest" component={SetupTest} />
      <Stack.Screen name="DPractice" component={DPractice} />
      <Stack.Screen name="DSQues" component={DSQues} />
      <Stack.Screen name="DetailTopic" component={DetailTopic} />
      <Stack.Screen name="DetailDays" component={DetailDays} />
      <Stack.Screen name="FinalTest" component={FinalTest} />
      <Stack.Screen name="QuestionTest" component={QuestionTest} />
      <Stack.Screen name="PassingTest" component={PassingTest} />
      <Stack.Screen name="PassingTopicScreen" component={PassingTopicScreen} />
      <Stack.Screen name="Standard" component={Standard} />
      <Stack.Screen name="QuestionPractice" component={QuestionPractice} />
      <Stack.Screen name="PassingPractice" component={PassingPractice} />

      <Stack.Screen
        name="QuestionsStatistics"
        component={QuestionsStatistics}
      />
      <Stack.Screen name="FavoriteQuestions" component={FavoriteQuestions} />
      <Stack.Screen name="WrongQuestions" component={WrongQuestions} />
      <Stack.Screen name="WrongSetup" component={WrongSetup} />
      <Stack.Screen name="FavoriteSetup" component={FavoriteSetup} />

      <Stack.Screen name="WrongTest" component={WrongTest} />
      <Stack.Screen name="WrongResult" component={WrongResult} />

      <Stack.Screen name="FavoriteTest" component={FavoriteTest} />
      <Stack.Screen name="HardestQuestions" component={HardestQuestions} />
      <Stack.Screen name="WeakQuestions" component={WeakQuestions} />
      <Stack.Screen name="QuestionCustomP" component={QuestionCustomP} />
      <Stack.Screen name="PassingFinalTest" component={PassingFinalTest} />
      <Stack.Screen
        name="PassingCustomPractice"
        component={PassingCustomPractice}
      />
      <Stack.Screen name="StepPlanFirst" component={StepPlanFirst} />
      <Stack.Screen name="StepPlanSecond" component={StepPlanSecond} />
      <Stack.Screen name="StepPlanThree" component={StepPlanThree} />
      <Stack.Screen name="CreateStudyPlan" component={CreateStudyPlan} />
      <Stack.Screen
        name="ChartStudyPlanScreen"
        component={ChartStudyPlanScreen}
      />
      <Stack.Screen name="LogOutScreen" component={LogOutScreen} />
      <Stack.Screen name="PassTopic" component={PassingTopicScreen} />
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen
        name="PushNotificationScreen"
        component={PushNotificationScreen}
      />
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
    </Stack.Navigator>
  );
};

export default AppStack;
