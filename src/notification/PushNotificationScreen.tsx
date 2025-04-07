import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBackSkip from '../components/HeaderBackSkip';
import Header from '../components/Header';
import LinearGradientView from '../components/LinerGradient';
import {moderateVerticalScale} from 'react-native-size-matters';
import {Colors} from '../theme';
import {useDispatch} from 'react-redux';
import {setDevicesToken} from '../store/authSlice';
import {useSelector} from 'react-redux';
import {RootState} from '../store';
import TextNormal from '../components/Text';

const PushNotificationScreen = ({navigation}: any) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const dispatch = useDispatch();

  // Load the switch state from AsyncStorage when the component mounts
  useEffect(() => {
    const loadSwitchState = async () => {
      try {
        const savedState = await AsyncStorage.getItem(
          'notificationSwitchState',
        );
        if (savedState !== null) {
          setIsEnabled(JSON.parse(savedState));
        }
      } catch (error) {
        console.error('Failed to load switch state', error);
      }
    };

    loadSwitchState();
  }, []);

  // Toggle the switch and save the state to AsyncStorage
  const toggleSwitch = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);

    try {
      await AsyncStorage.setItem(
        'notificationSwitchState',
        JSON.stringify(newState),
      );
      const log = await AsyncStorage.getItem('notificationSwitchState');
      if (newState) {
        // Enable notifications
        await requestNotificationPermission();
        // Alert.alert('Push Notifications Enabled');
      } else {
        // Disable notifications and delete FCM token
        await deleteFCMToken();
        await messaging().unregisterDeviceForRemoteMessages();
        // Alert.alert('Push Notifications Disabled and FCM Token Deleted');
      }
    } catch (error) {
      console.error('Failed to save switch state', error);
    }
  };

  // Function to request notification permission and get token
  const requestNotificationPermission = async () => {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permissions granted.');
        getFCMToken();
      } else {
        Alert.alert('Notification permissions denied.');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };

  // Function to get FCM Token
  const getFCMToken = async () => {
    try {
      if (Platform.OS === 'ios') {
        const token = await messaging().getAPNSToken();
        dispatch(setDevicesToken(token));
        console.log('FCM Token:', token);
      } else if (Platform.OS === 'android') {
        const token = await messaging().getToken();
        dispatch(setDevicesToken(token));
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  // Function to delete FCM Token when notifications are disabled
  const deleteFCMToken = async () => {
    try {
      await messaging().deleteToken();
      console.log('FCM Token deleted successfully');
    } catch (error) {
      console.error('Error deleting FCM token:', error);
    }
  };

  return (
    <LinearGradientView>
      <Header
        goBack={() => navigation.goBack()}
        title="Push Notification"
        showBtnRight={false}
      />

      <View style={styles.viewPush}>
        <TextNormal fontSize={18} style={styles.text}>
          Push Notification
        </TextNormal>
        <Switch
          trackColor={{false: '#d9d9d9', true: '#34C759'}}
          thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
          ios_backgroundColor="#d9d9d9"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
  container: {},
  viewPush: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: moderateVerticalScale(18),
    color: Colors.black_text,
  },
});

export default PushNotificationScreen;
