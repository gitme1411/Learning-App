import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, fullWidth, shadow} from '../../theme';
import ItemHome from '../../components/ItemHome';
import {moderateScale, scale} from 'react-native-size-matters';
import {useSelector, useDispatch} from 'react-redux';
import DeviceInfo from 'react-native-device-info';
import {RootState} from '../../store';
import {
  getMasterDataTopic,
  getMasterDataFinalTest,
  getMasterDataPractice,
  getHome,
  getVersionData,
} from '../../services/api/api';
import {setDataLocalTopic} from '../../store/topics';
import {setDataLocalPractice} from '../../store/practice';
import {setDataLocalFinalTest} from '../../store/finalTest';
import HeaderWithSignUp from '../../components/Header/HeaderWithSignUp';
import LoadingModal from '../../components/Loading';
import {
  setDataConfig,
  setDataStudyPlan,
  setDateTodayPlan,
  setDaySys,
  setNumberFinalTestTodayPlan,
  setNumberPracticeTodayPlan,
  setNumberTopicTodayPlan,
} from '../../store/config';
import CountdownToMidnight from '../../components/TimeCountDown/CountdownToMidnight';
import TextNormal from '../../components/Text';
import Topic from '@/model/topic';
import {useQuery, useRealm} from '@realm/react';
import Practice from '@/model/practice';
import FinalTest from '@/model/final_test';
import WrongQuestion from '@/model/wrong_question';
import {setDataWrong} from '@/store/quesStatis';
import {verticalScale} from 'react-native-size-matters';
import LottieView from 'lottie-react-native';
import {eachDayOfInterval, format} from 'date-fns';
import {useFocusEffect} from '@react-navigation/native';

const Home = ({navigation}: any) => {
  const realm = useRealm();
  const listTopic = useQuery(Topic);
  const listPractice = useQuery(Practice);
  const listFinalTest = useQuery(FinalTest);
  const listWrongQuestion = useQuery(WrongQuestion);
  const [isShowSignUp, setModalSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isChangeDate, setChangeDate] = useState(false);
  const [dataHome, setDataHome] = useState({
    practice: 0,
    final_test: 0,
    all_topic: 0,
    passing_rate: 0,
  });

  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const timeSysDay = useSelector((state: RootState) => state.config.timeSysDay);
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const dataWrong = useSelector(
    (state: RootState) => state.quesStatis.dataWrong,
  );
  const dateTodayPlan = useSelector(
    (state: RootState) => state.config.dateTodayPlan,
  );
  const dataPractice = useSelector(
    (state: RootState) => state.practice.dataPractice,
  );
  const daysCountDown = useSelector(
    (state: RootState) => state.createStepPlan.daysCountDownt,
  );

  const dataFinalTest = useSelector(
    (state: RootState) => state.finalTest.dataFinalTest,
  );

  const dataStepPlanLocal = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );

  const dataStudyPlan = useSelector(
    (state: RootState) => state.config.dataStudyPlan,
  );

  const [valuePractice, setValuePractice] = useState(0);
  const [valueFinalTest, setValueFinalTest] = useState(0);
  const [valueTopics, setValueTopics] = useState(0);
  const [valuePassRate, setValuePassRate] = useState(0);

  let hasNotch = DeviceInfo.hasNotch();

  useEffect(() => {
    checkDate();
    let today = new Date();
    if (today.toLocaleDateString() !== dateTodayPlan) {
      dispatch(
        setNumberTopicTodayPlan({
          numberTopicTodayPlan: 0,
          numberFailTopicTodayPlan: 0,
        }),
      );
      dispatch(
        setNumberPracticeTodayPlan({
          numberPracticeTodayPlan: 0,
          numberFailPracticeTodayPlan: 0,
        }),
      );
      dispatch(
        setNumberFinalTestTodayPlan({
          numberFinalTestTodayPlan: 0,
          numberFailFinalTestTodayPlan: 0,
        }),
      );
      dispatch(setDateTodayPlan(today.toLocaleDateString()));
    }
  }, []);

  useEffect(() => {
    getDataVersion();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getDataHome();
      }
    }, [token]),
  );

  useEffect(() => {
    checkResultAllTopics();
    sumResultPractice();
    sumResultFinalTest();
  }, [dataTopics, dataPractice, dataFinalTest]);

  useEffect(() => {
    setValuePassRate((valueTopics + valuePractice + valueFinalTest) / 3);
  }, [valueTopics, valuePractice, valueFinalTest]);

  const getDataVersion = async () => {
    if (
      !listTopic ||
      listTopic?.length == 0 ||
      !listPractice ||
      listPractice?.length == 0 ||
      !listFinalTest ||
      listFinalTest?.length == 0
    ) {
      fetchMasterDataAll();
    } else {
      if (dataTopics.length == 0) {
        dispatch(setDataLocalTopic(listTopic.toJSON()));
      }
      if (dataPractice.length == 0) {
        dispatch(setDataLocalPractice(listPractice.toJSON()));
      }
      if (dataFinalTest.length == 0) {
        dispatch(setDataLocalFinalTest(listFinalTest.toJSON()));
      }
      if (
        dataWrong.length == 0 &&
        listWrongQuestion &&
        listWrongQuestion.length != 0
      ) {
        dispatch(setDataWrong(listWrongQuestion.toJSON()));
      }
    }
    // if (dataConfig.practice_test_version != res.practice_test_version) {
    //   fetchMasterDataPractice();
    // }
    // if (dataConfig.final_test_version != res.final_test_version) {
    //   fetchMasterDataFinalTest();
    // }
    // setLoading(false)
  };

  useEffect(() => {
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
  }, []);

  const getDataHome = async () => {
    const res = await getHome();
    setDataHome(res.res);
    // if (res.status) {
    //   dispatch(setDataLocalTopic(listTopic || []));
    //   dispatch(setDataLocalPractice(listPractice || []));
    //   dispatch(setDataLocalFinalTest(listFinalTest || []));
    //   dispatch(setDataWrong(listWrongQuestion || []));
    // } else {

    // }
  };

  const checkDate = () => {
    let today = new Date();
    if (today.getDate() == timeSysDay) {
      return;
    } else {
      dispatch(setDaySys(today.getDate()));
    }
  };

  const checkResultAllTopics = () => {
    if (dataTopics && dataTopics.length > 0) {
      let total = 0;
      dataTopics?.map((item: any) => {
        if (item.percentPass) {
          total = total + parseFloat(item.percentPass);
        }
      });
      setValueTopics(total / dataTopics?.length);
    } else {
      setValueTopics(0);
    }
  };

  const sumResultPractice = () => {
    let total = 0;
    dataPractice.map((item: any) => {
      if (item.percentPass) total = total + item.percentPass;
    });
    setValuePractice(total / dataPractice.length);
  };

  const sumResultFinalTest = () => {
    let total = 0;
    dataFinalTest.map((item: any) => {
      if (item.percentPass) total = total + item.percentPass;
    });
    setValueFinalTest(total / dataFinalTest.length);
  };

  const fetchMasterDataAll = async () => {
    console.log('fetchMasterDataAll', 'fetchMasterDataAll');
    setLoading(true);
    const [resDataTopic, resDataPractice, resDataFinalTest] = await Promise.all(
      [getMasterDataTopic(), getMasterDataPractice(), getMasterDataFinalTest()],
    );
    try {
      realm.write(() => {
        realm.deleteAll();
        realm.delete(listWrongQuestion);
      });
      dispatch(setDataWrong([]));
      if (resDataTopic && resDataTopic.res && resDataTopic.res.data) {
        realm.write(() => {
          resDataTopic.res.data.forEach((obj: any) => {
            realm.create('Topic', obj);
          });
        });
        dispatch(setDataLocalTopic(resDataTopic.res.data));
      }

      if (resDataPractice && resDataPractice.res && resDataPractice.res.data) {
        realm.write(() => {
          resDataPractice.res.data.forEach((obj: any) => {
            realm.create('Practice', obj);
          });
        });
        dispatch(setDataLocalPractice(resDataPractice.res.data));
      }

      if (
        resDataFinalTest &&
        resDataFinalTest.res &&
        resDataFinalTest.res.data
      ) {
        realm.write(() => {
          resDataFinalTest.res.data.forEach((obj: any) => {
            realm.create('FinalTest', obj);
          });
        });
        dispatch(setDataLocalFinalTest(resDataFinalTest.res.data));
      }
    } finally {
      setLoading(false);
    }
  };

  // const fetchMasterData = async () => {
  //   try {
  //     setLoading(true);

  //     if (token && pendingRating) {
  //       await postRateQuiz(
  //         pendingRating.question_id,
  //         pendingRating.rate,
  //         pendingRating.comment,
  //       );
  //       dispatch(clearPendingRating());
  //       Toast.showWithGravity(
  //         'The Push Review was successfully archived.',
  //         Toast.LONG,
  //         Toast.BOTTOM,
  //       );
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const renderTime = () => {
    return (
      <TouchableOpacity
        disabled={daysCountDown > 0}
        onPress={() => {
          setChangeDate(true);
        }}
        style={styles.wrapTime}>
        <LinearGradient
          colors={['#FFD265', '#FFB400']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.wrapTimeDown}>
          <View style={styles.viewWrapTime}>
            <View style={{width: fullWidth - 132}}>
              <CountdownToMidnight
                isChangeDate={isChangeDate}
                setChangeDate={setChangeDate}
              />
            </View>
            <View style={styles.wraplotte}>
              {/* <Image source={Icon.icTime} /> */}
              <LottieView
                style={{width: '100%', height: '100%'}}
                source={
                  daysCountDown <= 0
                    ? require('../../assets/animation/date_picker.json')
                    : require('../../assets/animation/time.json')
                }
                autoPlay
                loop
              />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderPassingRate = () => {
    return (
      <View style={styles.wrapPsRate}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../assets/images/ic_pie_chart.png')} />
          <TextNormal fontSize={16} style={styles.txtPassRate}>
            Passing rate
          </TextNormal>
        </View>
        <View>
          {token && dataHome && dataHome?.passing_rate ? (
            <TextNormal fontSize={20} style={styles.rate}>
              {dataHome?.passing_rate}%
            </TextNormal>
          ) : (
            <TextNormal fontSize={20} style={styles.rate}>
              {valuePassRate ? valuePassRate.toFixed(1) : 0}%
            </TextNormal>
          )}
        </View>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.wrapContent}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            paddingBottom: '50%',
          }}>
          {renderPassingRate()}
          <View style={styles.wrapItemContent}>
            {token && dataHome && dataHome.all_topic >= 0 ? (
              <ItemHome
                value={dataHome.all_topic}
                title="All topics"
                onPress={() => navigation.navigate('AllTopics')}
                radius={42}
              />
            ) : (
              <ItemHome
                value={valueTopics}
                title="All topics"
                onPress={() => navigation.navigate('AllTopics')}
                radius={42}
              />
            )}

            {token && dataHome && dataHome.practice >= 0 ? (
              <ItemHome
                value={dataHome.practice}
                title="Practice"
                onPress={() => navigation.navigate('DPractice')}
                radius={42}
              />
            ) : (
              <ItemHome
                value={valuePractice}
                title="Practice"
                onPress={() => navigation.navigate('DPractice')}
                radius={42}
              />
            )}
          </View>
          <View style={styles.wrapItemContent}>
            {token && dataHome && dataHome.final_test >= 0 ? (
              <ItemHome
                value={dataHome.final_test}
                title="Final test"
                onPress={() => navigation.navigate('FinalTest')}
                radius={42}
              />
            ) : (
              <ItemHome
                value={valueFinalTest}
                title="Final test"
                onPress={() => navigation.navigate('FinalTest')}
                radius={42}
              />
            )}

            <TouchableOpacity
              style={styles.wrapItem}
              onPress={() => navigation.navigate('QuestionsStatistics')}>
              <View style={styles.wrapIcon}>
                <Image
                  style={{tintColor: Colors.primaryMain}}
                  source={require('../../assets/images/ic_message_question.png')}
                />
              </View>
              <TextNormal fontSize={14} style={styles.title}>
                Question statistics
              </TextNormal>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#00C2FF', '#0F90EB']}
      start={{x: 1, y: 0}}
      end={{x: 0, y: 0}}
      style={{flex: 1}}>
      {hasNotch ? (
        <View
          style={{height: 36, width: '100%', paddingTop: verticalScale(36)}}
        />
      ) : (
        <View
          style={{height: 16, width: '100%', paddingTop: verticalScale(30)}}
        />
      )}
      <HeaderWithSignUp
        isShowSignUp={isShowSignUp}
        setModalSignUp={setModalSignUp}
      />
      {renderTime()}
      {renderContent()}
      <LoadingModal visible={loading} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  flexEnd: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  txtTitleSignUp: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.mainText,
  },
  txtContentSignUp: {
    fontSize: moderateScale(14),
    color: '#6D6B7A',
    fontWeight: '400',
    textAlign: 'center',
  },
  txtParamEmail: {
    height: 20,
    fontSize: moderateScale(14),
    color: Colors.mainText,
    fontWeight: '600',
    textAlign: 'center',
  },
  txtError: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 16,
  },
  viewTextBottom: {
    flexDirection: 'row',
    marginTop: 24,
    paddingBottom: 16,
  },
  txtUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: Colors.primaryMain,
    color: Colors.primaryMain,
    paddingLeft: 5,
  },
  viewHeaderVerifyCode: {
    width: '100%',
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginVertical: 12,
  },
  viewModalContainer: {
    width: '100%',
    height: 400,
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  textinput: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: scale(10),
    height: 52,
    paddingHorizontal: scale(16),
    paddingVertical: 17,
    borderRadius: 333,
    borderWidth: 1,
    borderColor: Colors.colorBorder,
  },
  inputStyle: {fontSize: moderateScale(16)},
  labelStyle: {fontSize: moderateScale(14)},
  placeholderStyle: {fontSize: moderateScale(16)},
  textErrorStyle: {fontSize: moderateScale(14), marginBottom: 10},

  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: 45,
    height: 60,
    lineHeight: 38,
    fontSize: moderateScale(24),
    borderWidth: 1,
    borderColor: Colors.colorBorder,
    textAlign: 'center',
    borderRadius: 22,
    paddingVertical: 7,
    margin: 5,
    color: 'black',
  },
  focusCell: {
    width: 45,
    height: 60,
    lineHeight: 38,
    fontSize: moderateScale(24),
    borderWidth: 1,
    borderColor: 'red',
    textAlign: 'center',
    borderRadius: 22,
    paddingVertical: 7,
    margin: 5,
    color: 'black',
  },
  wrapTime: {
    height: 52,
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 12,
  },

  wrapItem: {
    width: (fullWidth - 72) * 0.5,
    height: 154,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blurMain,
    borderRadius: 16,
    ...shadow,
  },
  wrapIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.primaryMain,
    borderWidth: 8,
  },
  title: {
    color: Colors.mainText,
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginTop: 12,
  },
  wrapTimeDown: {
    flex: 1,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  viewWrapTime: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeCountDown: {
    color: '#723000',
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  wraplotte: {
    width: 36,
    height: 36,
  },
  wrapContent: {
    backgroundColor: '#fff',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    height: '100%',
  },
  wrapPsRate: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: moderateScale(56),
    borderRadius: 16,
    width: fullWidth - 48,
    backgroundColor: '#D8FBFF',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  txtPassRate: {
    color: Colors.mainText,
    fontWeight: '500',
    fontSize: moderateScale(16),
    marginLeft: 16,
  },
  rate: {
    fontWeight: '700',
    fontSize: moderateScale(20),
    color: '#34C759',
  },
  wrapItemContent: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
});

export default Home;
