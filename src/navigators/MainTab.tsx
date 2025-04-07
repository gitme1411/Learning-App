import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Home from '../screens/Home';
import Profiles from '../screens/Profiles';
import Statistics from '../screens/Statistics';
import TabBarCustom from '../components/TabBar';
import StudyPlan from '../screens/StudyPlan';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {restoreToken} from '../store/authSlice';
import {useDispatch} from 'react-redux';

const Tab = createBottomTabNavigator();

const MainTab = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          dispatch(restoreToken(token));
        }
      } catch (e) {
        console.error('Failed to load token or onboarding status:', e);
      }
    };

    bootstrapAsync();
  }, []);
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false, unmountOnBlur: true}}
      tabBar={props => <TabBarCustom {...props} />}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Study plan" component={StudyPlan} />
      <Tab.Screen name="Statistics" component={Statistics} />
    </Tab.Navigator>
  );
};

export default MainTab;
