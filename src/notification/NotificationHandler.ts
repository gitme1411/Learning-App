import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {setDevicesToken} from '../store/authSlice';
import notifee from '@notifee/react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationHandler = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkPermission = async () => {
      const authStatus = await messaging().hasPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (!enabled) {
        requestUserPermission();
      }
    };
    checkPermission();
    getFCMToken();
  }, [dispatch]);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
      onDisplayNotification(remoteMessage);
    });

    return unsubscribe;
  }, []);

  const requestUserPermission = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const pushNotification = 'true';
      await AsyncStorage.setItem('notificationSwitchState', pushNotification);
    }
  };

  const getFCMToken = async () => {
    try {
      if (Platform.OS === 'ios') {
        const token = await messaging().getAPNSToken();
        dispatch(setDevicesToken(token));
        console.log('FCM Token:', token);
      } else {
        const token = await messaging().getToken();
        dispatch(setDevicesToken(token));
        console.log('FCM Token:', token);
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const onDisplayNotification = async (remoteMessage: any) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage?.notification?.title,
      body: remoteMessage?.notification?.body,
      android: {
        channelId,
        smallIcon: 'ic_notification', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  };

  return null;
};

export default NotificationHandler;
