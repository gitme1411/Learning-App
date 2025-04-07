// src/screens/LogoutScreen.tsx

import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Alert} from 'react-native';
import {styles} from './styles';
import {useDispatch} from 'react-redux';
import {logout} from '../../store/authSlice';
import {logOutUser} from '../../services/api/api';
import {Icon} from '../../utils/icon';
import Header from '../../components/Header';
import LoadingModal from '../../components/Loading';
import {resetLikedQuestions} from '../../store/likedQuestionsSlice';
import TextNormal from '../../components/Text';
import {setDataConfig, setResetTodayPlan} from '@/store/config';

type ItemProps = {
  route: any;
  navigation: any;
};

const LogOutScreen: React.FC<ItemProps> = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      const callLogout = await logOutUser();
      setLoading(false);
      if (callLogout?.error === 0) {
        dispatch(logout());
        dispatch(resetLikedQuestions());
        dispatch(setResetTodayPlan());
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const handleBack = () => {
    navigation.navigate('MainTab');
  };
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <LoadingModal visible={loading} />
      <Image
        source={Icon.imgBackGroudStudyPlan}
        style={[styles.backgroundImage]}
      />
      <View style={styles.overlay}>
        <Header showBtnRight={false} title="" goBack={handleBack} />
        {/* <TextNormal fontSize={} style={styles.textTitel}>{'AU Citizenship \nTest 2024'}  </TextNormal> */}
        <TextNormal fontSize={35} style={styles.textTitel}>
          {'AU Test 2024'}
        </TextNormal>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
            <TextNormal fontSize={17} style={styles.textLogout}>
              {'Yes, LogOut'}
            </TextNormal>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LogOutScreen;
