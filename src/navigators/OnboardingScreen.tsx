import {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './drawer';
import StepPlanFirst from '../screens/SetUpPlanStudy/StepPlanFirst';
import StepPlanSecond from '../screens/SetUpPlanStudy/StepPlanSecond';
import StepPlanThree from '../screens/SetUpPlanStudy/StepPlanThree';
import CreateStudyPlan from '../screens/SetUpPlanStudy/CreateStudyPlan';
import ChartStudyPlanScreen from '../screens/SetUpPlanStudy/CreateStudyPlan/chartSetUpScreen';
import PassingTopicScreen from '../screens/PassTopic';
import LogoutScreen from '../screens/LogOutScreen';
import Splash from '../screens/Splash';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {restoreToken} from '../store/authSlice';
import AppStack from './AppStack';

const Stack = createNativeStackNavigator();

const OnboardingScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={'StepPlanFirst'}>
      <Stack.Screen name="StepPlanFirst" component={StepPlanFirst} />
      <Stack.Screen name="StepPlanSecond" component={StepPlanSecond} />
      <Stack.Screen name="StepPlanThree" component={StepPlanThree} />
      <Stack.Screen name="CreateStudyPlan" component={CreateStudyPlan} />
      <Stack.Screen
        name="ChartStudyPlanScreen"
        component={ChartStudyPlanScreen}
      />
      <Stack.Screen name="LogOutScreen" component={LogoutScreen} />
      <Stack.Screen name="PassTopic" component={PassingTopicScreen} />
      <Stack.Screen name="Splash" component={Splash} />
    </Stack.Navigator>
  );
};

export default OnboardingScreen;
