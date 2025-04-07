import {
  View,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  StyleSheet,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import TextNormal from '../../Text';
import Icon from 'react-native-vector-icons/AntDesign';
import {logOutUser} from '@/services/api/api';
import {logout} from '@/store/authSlice';
import {resetLikedQuestions} from '@/store/likedQuestionsSlice';
import {
  setDataStudyPlan,
  setIsWaitRemoveAccount,
  setResetTodayPlan,
} from '@/store/config';
import ModalNormal from '../ModalNormal';
import {useQuery, useRealm} from '@realm/react';
import WrongQuestion from '@/model/wrong_question';
import {setDataWrong} from '@/store/quesStatis';
import {setDataLocalTopic} from '@/store/topics';
import {setDataLocalPractice} from '@/store/practice';
import {setDataLocalFinalTest} from '@/store/finalTest';
import {eachDayOfInterval, format} from 'date-fns';
import Topic from '@/model/topic';
import Practice from '@/model/practice';
import FinalTest from '@/model/final_test';

type Props = {
  isShow: boolean;
  setModalSignOut: (isShow: boolean) => void;
  navigation: any;
};

const ModalSignOut = ({isShow, setModalSignOut, navigation}: Props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const dataUser = useSelector((state: RootState) => state.config.userInfo);

  const listTopic = useQuery(Topic);
  const listPractice = useQuery(Practice);
  const listFinalTest = useQuery(FinalTest);

  const dataStepPlanLocal = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );

  const dataStudyPlan = useSelector(
    (state: RootState) => state.config.dataStudyPlan,
  );

  const listWrongQuestion = useQuery(WrongQuestion);
  const realm = useRealm();

  const onClose = () => {
    setIsModalSubmit(false);
  };

  const onOpen = () => {
    setIsModalSubmit(true);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const callLogout = await logOutUser();
      if (callLogout?.error === 0) {
        setLoading(false);
        setModalSignOut(false);
        setIsModalSubmit(false);
        dispatch(logout());
        dispatch(resetLikedQuestions());
        dispatch(setResetTodayPlan());
        dispatch(setIsWaitRemoveAccount(false));
        setDataStudy();
        clearData();
      } else {
        setLoading(false);
        Alert.alert('Error', 'Failed to log out. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  const clearData = () => {
    let newDataTopic: any[] = [];
    let newDataPractice: any[] = [];
    let newDataFinalTest: any[] = [];
    let listTopics = listTopic.toJSON();
    let listPractices = listPractice.toJSON();
    let listFinalTests = listFinalTest.toJSON();
    dispatch(setDataWrong([]));
    realm.write(() => {
      realm.deleteAll();
      realm.delete(listWrongQuestion);
    });
    if (listTopics) {
      realm.write(() => {
        listTopics?.forEach((obj: any) => {
          newDataTopic.push({
            ...obj,
            progress: 0,
            numberPass: null,
            numberFail: null,
            percentPass: null,
            data_level: obj.data_level.map((item: any) => ({
              ...item,
              numberPass: null,
              percentPass: null,
              progress: null,
              dateAnswer: null,
              oldNumberPass: null,
            })),
          });
          realm.create('Topic', {
            ...obj,
            progress: 0,
            numberPass: null,
            numberFail: null,
            percentPass: null,
            data_level: obj.data_level.map((item: any) => ({
              ...item,
              numberPass: null,
              percentPass: null,
              progress: null,
              dateAnswer: null,
              oldNumberPass: null,
            })),
          });
        });
      });
      dispatch(setDataLocalTopic(newDataTopic));
    }

    if (listPractices) {
      realm.write(() => {
        listPractices?.forEach((obj: any) => {
          newDataPractice.push({
            ...obj,
            progress: 0,
            numberPass: null,
            numberFail: null,
            percentPass: null,
            dateAnswer: null,
            oldNumberPass: null,
          });
          realm.create('Practice', {
            ...obj,
            progress: 0,
            numberPass: null,
            numberFail: null,
            percentPass: null,
            dateAnswer: null,
            oldNumberPass: null,
          });
        });
      });
      dispatch(setDataLocalPractice(newDataPractice));
    }

    if (listFinalTests) {
      realm.write(() => {
        listFinalTests?.forEach((obj: any) => {
          newDataFinalTest.push({
            ...obj,
            progress: 0,
            numberPass: null,
            numberFail: null,
            percentPass: null,
            dateAnswer: null,
            oldNumberPass: null,
          });
          realm.create('FinalTest', {
            ...obj,
            progress: 0,
            numberPass: null,
            numberFail: null,
            percentPass: null,
            dateAnswer: null,
            oldNumberPass: null,
          });
        });
      });
      dispatch(setDataLocalFinalTest(newDataFinalTest));
    }
  };

  const setDataStudy = () => {
    if (!dataStudyPlan) {
      const startDateLocal = new Date(dataStepPlanLocal.start_date);
      const endDateLocal = new Date(dataStepPlanLocal.end_date);
      const dates = eachDayOfInterval({
        start: startDateLocal,
        end: endDateLocal,
      });
      let data = dates.reduce((acc: any, date: any) => {
        acc[format(date, 'yyyy-MM-dd')] = 0;
        return acc;
      }, {});
      dispatch(setDataStudyPlan(data));
    }
  };

  const onDeleteAccount = () => {
    setModalSignOut(false);
    navigation.navigate('DeleteAccount');
  };
  return (
    <Modal
      swipeDirection={'down'}
      animationIn="slideInUp"
      animationOut="slideOutUp"
      isVisible={isShow}
      hideModalContentWhileAnimating={true}
      onSwipeComplete={() => setModalSignOut(false)}
      onBackdropPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.modalStyle}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, justifyContent: 'flex-end'}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewModalContainer}>
            <Image source={require('../../../assets/images/line.png')} />
            <View style={styles.container}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon name={'mail'} size={24} color="#000000" />
                <TextNormal fontSize={14} style={styles.txt}>
                  {dataUser?.email}
                </TextNormal>
              </View>
            </View>
            <TouchableOpacity style={styles.container} onPress={onOpen}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon name={'logout'} size={24} color="#000000" />
                <TextNormal fontSize={14} style={styles.txt}>
                  Logout
                </TextNormal>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.container}
              onPress={onDeleteAccount}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Icon name={'delete'} size={24} color="#000000" />
                <TextNormal fontSize={14} style={styles.txt}>
                  Delete Account
                </TextNormal>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <ModalNormal
          modalVisible={isModalSubmit}
          onClose={onClose}
          onSubmit={handleLogout}
          title="Confirm"
          textContent="Are you sure you want to logout?"
          textClose="No"
          textSubmit="Yes"
        />
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    // paddingBottom: 24,
  },
  txt: {
    fontSize: moderateScale(16),
    fontWeight: '400',
    marginLeft: 12,
  },
  icon: {
    tintColor: '#6D6B7A',
    width: 24,
    height: 24,
  },
  viewModalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 16,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});

export default ModalSignOut;
