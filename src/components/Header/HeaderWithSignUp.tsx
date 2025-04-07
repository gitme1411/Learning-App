import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {useDispatch, useSelector} from 'react-redux';
import {
  createStudyPlan,
  getFavorites,
  getUserInfo,
  like,
  loginEmail,
  submitAsyncFinalTest,
  submitAsyncPractice,
  submitAsyncTopic,
  verifyOtp,
} from '../../services/api/api';
import {useForm, SubmitHandler} from 'react-hook-form';
import ModalSignUp from '../Modal/ModalSignUp/ModalSignUp';
import {RootState} from '../../store';
import {Icon} from '../../utils/icon';
import {moderateScale} from 'react-native-size-matters';
import {likeQuestion} from '../../store/likedQuestionsSlice';
import TextNormal from '../Text';
import ModalSync from '../Modal/ModalSync';
import {setDataStudyPlan, setDataUser, setResetTodayPlan} from '@/store/config';
import {useQuery, useRealm} from '@realm/react';
import Favorite from '@/model/favorite';
import ModalSignOut from '../Modal/ModalSignOut/ModalSignOut';
import {eachDayOfInterval, format} from 'date-fns';
import {setDataWrong} from '@/store/quesStatis';
import {setDataLocalTopic} from '@/store/topics';
import WrongQuestion from '@/model/wrong_question';
import {setDataLocalPractice} from '@/store/practice';
import {setDataLocalFinalTest} from '@/store/finalTest';
import Topic from '@/model/topic';
import Practice from '@/model/practice';
import FinalTest from '@/model/final_test';

interface HeaderWithSignUpProps {
  isShowSignUp: boolean;
  setModalSignUp: (show: boolean) => void;
}

interface SignUpFormInputs {
  email: string;
  verifyCode: string;
}

const HeaderWithSignUp: React.FC<HeaderWithSignUpProps> = ({
  isShowSignUp,
  setModalSignUp,
}) => {
  const [isShowOtpCode, setModalOtpCode] = useState(false);
  const [validation, setValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalSync, setModalSync] = useState(false);
  const [isModalSignOut, setModalSignOut] = useState(false);

  const listTopic = useQuery(Topic);
  const listPractice = useQuery(Practice);
  const listFinalTest = useQuery(FinalTest);

  const listWrongQuestion = useQuery(WrongQuestion);
  const realm = useRealm();

  const [email, setEmail] = useState('');
  // const [userInfo, setUserInfo] = useState<UserInfo>();
  const navigation = useNavigation();
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const likedQuestions = useSelector(
    (state: RootState) => state.listFavorite.likedQuestions,
  );
  const dataUser = useSelector((state: RootState) => state.config.userInfo);
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const dataPractice = useSelector(
    (state: RootState) => state.practice.dataPractice,
  );
  const dataFinalTest = useSelector(
    (state: RootState) => state.finalTest.dataFinalTest,
  );
  const dataStepPlan = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan,
  );

  const dataStepPlanLocal = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );

  const dataStudyPlan = useSelector(
    (state: RootState) => state.config.dataStudyPlan,
  );
  const listFavoriteQuestion = useQuery(Favorite);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<SignUpFormInputs>();

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const deviceToken = useSelector(
    (state: RootState) => state.auth.devicesToken,
  );

  useEffect(() => {
    const fetchInfo = async () => {
      const userInfo = await getUserInfo();
      dispatch(setDataUser(userInfo.res));
    };
    if (isAuthenticated && dataUser == null) {
      fetchInfo();
    }
    // onSyncData();
  }, [isAuthenticated, dataTopics]);

  const requestFavorite = async () => {
    await like(likedQuestions);
    const getListFavorite = await getFavorites();
    getListFavorite.res.forEach((item: any) => {
      dispatch(likeQuestion(item.id));
    });
  };

  const onSignUp: SubmitHandler<SignUpFormInputs> = async data => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    Keyboard.dismiss();

    if (data.email.length === 0 || reg.test(data.email) === false) {
      setValidation(true);
      return;
    }
    setLoading(true);
    try {
      const userData = await loginEmail(data.email, deviceToken);
      if (userData === undefined) {
        setLoading(false);
        Alert.alert('Error', 'Network Error', [
          {
            text: 'OK',
            onPress: () => setModalSignUp(false),
          },
        ]);
      } else if (reg.test(data.email) === true || userData?.error === 0) {
        setTimeout(async () => {
          setModalOtpCode(true);
          setValidation(false);
          setEmail(data.email);
          Toast.showWithGravity(userData.message, Toast.LONG, Toast.BOTTOM);
          setLoading(false);
          return data.email;
        }, 1000);
      } else {
        setLoading(false);
        Toast.showWithGravity(
          userData.message || 'Error logging in',
          Toast.LONG,
          Toast.BOTTOM,
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to login');
    }
  };

  const onVerifyCode: SubmitHandler<SignUpFormInputs> = async data => {
    Keyboard.dismiss();

    const params = {
      email: data.email,
      otp: data.verifyCode,
      device_token: deviceToken || 'abc',
    };

    if (data.verifyCode.length !== 6) {
      Alert.alert('', 'You need to enter complete information to continue');
      return;
    }

    setLoading(true);

    try {
      const verify = await verifyOtp(
        params.email,
        params.otp,
        params.device_token,
      );
      if (verify?.error === 0) {
        setTimeout(async () => {
          setLoading(false);
          const userInfo = await getUserInfo();
          await onSyncData();
          setModalOtpCode(false);
          setModalSignUp(false);
          dispatch(setDataUser(userInfo.res));
          setDataStudy();
          setModalSignUp(false);
          Toast.showWithGravity(verify?.message, Toast.LONG, Toast.CENTER);
          reset();
          // requestFavorite();
          dispatch(setResetTodayPlan());
          clearData();
        }, 500);
      } else {
        setLoading(false);
        Alert.alert(
          '',
          'Check your OTP again and make sure you entered it correctly!',
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to verify OTP');
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

  const handleResendCode = async () => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      const userData = await loginEmail(email, deviceToken);
      if (userData?.error === 0) {
        Toast.showWithGravity(userData?.message, Toast.LONG, Toast.BOTTOM);
        await setLoading(false);
      } else {
        throw new Error('Failed to resend verification code');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAvatarPress = () => {
    if (isAuthenticated) {
      setModalSignOut(true);
    } else {
      setModalSignUp(true);
    }
  };
  const getInitial = () => {
    return dataUser?.email ? dataUser?.email.charAt(0).toUpperCase() : '';
  };

  const onSyncData = async () => {
    const dataAllTopic: any[] = [];
    dataTopics.map((topic: any) => {
      topic.data_level.map((level: any) => {
        // console.log('dataAllTopic level', level);
        if (level.percentPass !== null && level.percentPass !== undefined) {
          // console.log('dataAllTopic level', level);
          dataAllTopic.push({
            test_id: level.id,
            is_over_time_submit: 0,
            total_time_do: 0,
            answer: level.random_questions.map((question: any) => ({
              question_id: question.id,
              answer_id: [question.user_answers],
            })),
          });
        }
      });
    });
    const dataSyncPractice: any[] = [];
    dataPractice.map((practice: any) => {
      // console.log('dataAllTopic level', level);
      if (practice.percentPass !== null && practice.percentPass !== undefined) {
        // console.log('dataAllTopic level', level);
        dataSyncPractice.push({
          test_id: practice.id,
          is_over_time_submit: 0,
          total_time_do: 0,
          answer: practice.random_questions.map((question: any) => ({
            question_id: question.id,
            answer_id: [question.user_answers],
          })),
        });
      }
    });
    const dataSyncFinalTest: any[] = [];
    dataFinalTest.map((finalTest: any) => {
      // console.log('dataAllTopic level', level);
      if (
        finalTest.percentPass !== null &&
        finalTest.percentPass !== undefined
      ) {
        // console.log('dataAllTopic level', level);
        dataSyncFinalTest.push({
          test_id: finalTest.id,
          is_over_time_submit: 0,
          total_time_do: 0,
          answer: finalTest.random_questions.map((question: any) => ({
            question_id: question.id,
            answer_id: [question.user_answers],
          })),
        });
      }
    });
    const dataSyncFavorite: any[] = [];
    listFavoriteQuestion.map((favorite: any) => {
      dataSyncFavorite.push(favorite.id);
    });
    await Promise.all([
      createStudyPlan(
        dataStepPlan?.param?.device_token,
        dataStepPlan?.param?.time_in_date,
        dataStepPlan?.param?.minutes,
        dataStepPlan?.param?.day_in_week,
        dataStepPlan?.param?.start_date,
        dataStepPlan?.param?.end_date,
      ),
      dataAllTopic.length > 0 && submitAsyncTopic(dataAllTopic),
      dataSyncPractice.length > 0 && submitAsyncPractice(dataSyncPractice),
      dataSyncFinalTest.length > 0 && submitAsyncFinalTest(dataSyncFinalTest),
      dataSyncFavorite.length > 0 && like(dataSyncFavorite),
    ]);
  };

  return (
    <>
      <View style={styles.wrapHeader}>
        <View style={styles.wrapMenu}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Image
              source={require('../../assets/images/ic_menu.png')}
              style={styles.icMenu}
            />
          </TouchableOpacity>
        </View>
        <View>
          <TextNormal fontSize={20} style={styles.appName}>
            AU Test 2024
          </TextNormal>
        </View>
        {isAuthenticated ? (
          <>
            <TouchableOpacity
              onPress={handleAvatarPress}
              style={styles.wrapMenu}>
              <TextNormal fontSize={20} style={styles.appName}>
                {getInitial()}
              </TextNormal>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={handleAvatarPress}>
              <Image style={styles.icProfile} source={Icon.icProfile} />
            </TouchableOpacity>
          </>
        )}
      </View>

      <ModalSignUp
        isShowSignUp={isShowSignUp}
        isShowOptCode={isShowOtpCode}
        loading={loading}
        control={control}
        errors={errors}
        validation={validation}
        nameEmail={'email'}
        nameVeryCode="verifyCode"
        txtEmail={email}
        onSwipeCompleteOtpCode={() => {
          setModalSignUp(false);
          setModalOtpCode(false);
        }}
        onSwipeCompleteSignUp={() => {
          setModalSignUp(false);
        }}
        onSignUp={handleSubmit(onSignUp)}
        onVerifyCode={handleSubmit(onVerifyCode)}
        onReSendCode={handleResendCode}
        onBack={() => {
          setModalSignUp(true);
          setModalOtpCode(false);
        }}
        onKeyDismiss={() => {
          Keyboard.dismiss();
        }}
      />
      <ModalSignOut
        isShow={isModalSignOut}
        setModalSignOut={setModalSignOut}
        navigation={navigation}
      />
      <ModalSync isVisible={isModalSync} onClose={() => {}} />
    </>
  );
};

const styles = StyleSheet.create({
  wrapHeader: {
    height: moderateScale(45),
    paddingHorizontal: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: 333,
    backgroundColor: '#00000040',
  },
  icMenu: {
    width: moderateScale(24),
    height: moderateScale(24),
  },
  appName: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  icProfile: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: 333,
    resizeMode: 'cover',
  },
});

export default HeaderWithSignUp;
