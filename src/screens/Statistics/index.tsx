import {View, Image, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
// import { styles } from "./styles"
import LinearGradient from 'react-native-linear-gradient';
import {fullWidth} from '../../theme';
// import LottieView from 'lottie-react-native';
import LinearGradientView from '../../components/LinerGradient';
import DeviceInfo from 'react-native-device-info';
import {styles} from './styles';
import {
  getPlanAllReport,
  getHome,
  getTopicProgress,
} from '../../services/api/api';
import HeaderWithSignUp from '../../components/Header/HeaderWithSignUp';
import LoadingModal from '../../components/Loading';
import ProgressAllTopic from '../../components/ProgressStatistics/ProgressAllTopic';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {moderateScale} from 'react-native-size-matters';
import {Icon} from '../../utils/icon';
import CountdownToMidnight from '../../components/TimeCountDown/CountdownToMidnight';
import {useIsFocused} from '@react-navigation/native';
import TextNormal from '../../components/Text';
import LottieView from 'lottie-react-native';

interface PlanAllReport {
  res?: any;
}

const Statistics = ({navigation}: any) => {
  let hasNotch = DeviceInfo.hasNotch();
  const token = useSelector((state: RootState) => state.auth.token);
  const [ratePassion, setRatePass] = useState<any>(0);
  const [isShowSignUp, setModalSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataReportTopic, setDataReportTopic] = useState<any[]>([]);
  const [dataReportFinalTest, setDataReportFinalTest] = useState<any>({});
  const [dataReportPractice, setDataReportPractice] = useState<any>({});
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const dataPractice = useSelector(
    (state: RootState) => state.practice.dataPractice,
  );
  const dataFinalTest = useSelector(
    (state: RootState) => state.finalTest.dataFinalTest,
  );
  const daysCountDown = useSelector(
    (state: RootState) => state.createStepPlan.daysCountDownt,
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (token && isFocused) {
      fetchMasterData();
    }
  }, [isAuthenticated, isFocused]);
  const getProgressTopic = async () => {
    const [responseTopic1, responseTopic2, responseTopic3, responseTopic4] =
      await Promise.all([
        getTopicProgress(dataTopics[0].id),
        getTopicProgress(dataTopics[1].id),
        getTopicProgress(dataTopics[2].id),
        getTopicProgress(dataTopics[3].id),
      ]);
    let listTopic = [];
    if (responseTopic1 && responseTopic1.res) {
      listTopic.push({
        name: dataTopics[0].name,
        question: {
          wrong: responseTopic1.res.q_wrong,
          correct: responseTopic1.res.q_correct,
        },
        total_questions: responseTopic1.res.target_questions,
      });
    } else {
      listTopic.push({
        name: dataTopics[0].name,
        question: {wrong: 0, correct: 0},
        total_questions: 160,
      });
    }
    if (responseTopic2 && responseTopic2.res) {
      listTopic.push({
        name: dataTopics[1].name,
        question: {
          wrong: responseTopic2.res.q_wrong,
          correct: responseTopic2.res.q_correct,
        },
        total_questions: responseTopic2.res.target_questions,
      });
    } else {
      listTopic.push({
        name: dataTopics[0].name,
        question: {wrong: 0, correct: 0},
        total_questions: 160,
      });
    }
    if (responseTopic3 && responseTopic3.res) {
      listTopic.push({
        name: dataTopics[2].name,
        question: {
          wrong: responseTopic3.res.q_wrong,
          correct: responseTopic3.res.q_correct,
        },
        total_questions: responseTopic3.res.target_questions,
      });
    } else {
      listTopic.push({
        name: dataTopics[0].name,
        question: {wrong: 0, correct: 0},
        total_questions: 220,
      });
    }
    if (responseTopic4 && responseTopic4.res) {
      listTopic.push({
        name: dataTopics[3].name,
        question: {
          wrong: responseTopic4.res.q_wrong,
          correct: responseTopic4.res.q_correct,
        },
        total_questions: responseTopic4.res.target_questions,
      });
    } else {
      listTopic.push({
        name: dataTopics[0].name,
        question: {wrong: 0, correct: 0},
        total_questions: 180,
      });
    }
    setDataReportTopic(listTopic);
  };
  const fetchMasterData = async () => {
    setLoading(true);
    try {
      if (dataTopics && dataTopics.length) {
        getProgressTopic();
      }

      // const responseTopic = await getTopicDetailReport();
      // if (responseTopic && responseTopic.res) {
      //   console.log(
      //     'responseTopic.res.report',
      //     responseTopic.res.report,
      //     dataTopics,
      //   );
      //   let listTopic = [];
      //   if (responseTopic.res.report[1]) {
      //     listTopic.push({
      //       ...responseTopic.res.report[1],
      //       total_questions: 160,
      //     });
      //   } else {
      //     listTopic.push({
      //       name: dataTopics[0].name,
      //       question: {wrong: 0, correct: 0},
      //       total_questions: 160,
      //     });
      //   }
      //   if (responseTopic.res.report[2]) {
      //     listTopic.push({
      //       ...responseTopic.res.report[2],
      //       total_questions: 160,
      //     });
      //   } else {
      //     listTopic.push({
      //       name: dataTopics[1].name,
      //       question: {wrong: 0, correct: 0},
      //       total_questions: 160,
      //     });
      //   }
      //   if (responseTopic.res.report[3]) {
      //     listTopic.push({
      //       ...responseTopic.res.report[3],
      //       total_questions: 220,
      //     });
      //   } else {
      //     listTopic.push({
      //       name: dataTopics[2].name,
      //       question: {wrong: 0, correct: 0},
      //       total_questions: 220,
      //     });
      //   }
      //   if (responseTopic.res.report[4]) {
      //     listTopic.push({
      //       ...responseTopic.res.report[4],
      //       total_questions: 180,
      //     });
      //   } else {
      //     listTopic.push({
      //       name: dataTopics[3].name,
      //       question: {wrong: 0, correct: 0},
      //       total_questions: 180,
      //     });
      //   }
      //   setDataReportTopic(listTopic);
      // }

      const response = await getPlanAllReport();
      if (response && response.res) {
        setDataReportFinalTest(response.res.report.final_test);
        setDataReportPractice(response.res.report.practice);
      }
      const rateTopic = await getHome();
      if (rateTopic && rateTopic.res) {
        setRatePass(rateTopic.res.passing_rate);
      }
      if (!rateTopic || !response) {
        Alert.alert('Error', 'Failed to load data. Please try again later.');
      }
      // if (isAuthenticated) {
      //   if (response?.error === 0 && rateTopic?.error === 0) {
      //     setPlanAllReport(response);
      //     setRatePass(rateTopic);
      //   } else {
      //     Alert.alert('Error', 'Failed to load data. Please try again later.');
      //   }
      // } else {
      //   // setLoading(false);
      //   Alert.alert('Login Required', 'You need to login to access this data.', [
      //     {
      //       text: 'Login',
      //       onPress: () => setModalSignUp(true),
      //     },
      //     {
      //       text: 'Cancel',
      //       onPress: () => navigation.navigate('Home'),
      //     },
      //   ]);
      // }
      setLoading(false);
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Error', 'Failed to load data. Please try again later.');
    }
  };

  const renderTime = () => {
    return (
      <View style={styles.wrapTime}>
        <LinearGradient
          colors={['#FFD265', '#FFB400']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={styles.wrapTimeDown}>
          <View style={styles.viewWrapTime}>
            <View style={{width: fullWidth - 132}}>
              <CountdownToMidnight />
            </View>
            <View style={styles.wraplotte}>
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
      </View>
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
          <TextNormal fontSize={20} style={styles.rate}>
            {/* {ratePassion?.res?.passing_rate === undefined
              ? */}
            {token ? ratePassion + ' %' : returnResultPassRate() + ' %'}
            {/* : ratePassion?.res?.passing_rate + ' %'} */}
          </TextNormal>
        </View>
      </View>
    );
  };

  const renderAllTopic = () => {
    return token
      ? dataReportTopic.map((item: any, index: number) => {
          return (
            <View key={item.id || index} style={styles.wrapItemContent}>
              <ProgressAllTopic
                valueWrong={item.question.wrong || 0}
                valueCorrect={item.question.correct || 0}
                total={item.total_questions}
                valueTotal={
                  item.total_questions -
                  item.question.wrong -
                  item.question.correct
                }
                title={item.name}
              />
            </View>
          );
        })
      : dataTopics.map((item: any, index: number) => {
          return (
            <View key={item.id || index} style={styles.wrapItemContent}>
              <ProgressAllTopic
                valueWrong={item.numberFail || 0}
                valueCorrect={item.numberPass || 0}
                total={item.total_questions || 0}
                valueTotal={
                  item.total_questions - item.numberFail - item.numberPass
                }
                title={item.name}
              />
            </View>
          );
        });
  };

  const renderPractice = () => {
    let valueCorrect = 0;
    let valueWrong = 0;
    let valueTotal = 0;
    dataPractice.map((item: any, index: number) => {
      if (item.numberPass) valueCorrect = valueCorrect + item.numberPass;
      if (item.numberFail) valueWrong = valueWrong + item.numberFail;
      valueTotal = valueTotal + item.total_questions;
    });
    return token ? (
      <View style={styles.wrapItemContent}>
        <ProgressAllTopic
          valueWrong={dataReportPractice.wrong || 0}
          valueCorrect={dataReportPractice.correct || 0}
          total={valueTotal || 0}
          valueTotal={
            valueTotal - dataReportPractice.wrong - dataReportPractice.correct
          }
          title={'Standard practice'}
        />
      </View>
    ) : (
      <View style={styles.wrapItemContent}>
        <ProgressAllTopic
          valueWrong={valueWrong || 0}
          valueCorrect={valueCorrect || 0}
          total={valueTotal || 0}
          valueTotal={valueTotal - valueCorrect - valueWrong}
          title={'Standard practice'}
        />
      </View>
    );
  };

  const returnResultPassRate = () => {
    let totalAllTopics = 0;
    dataTopics.map((item: any) => {
      if (item.percentPass) {
        totalAllTopics = totalAllTopics + parseFloat(item.percentPass);
      }
    });
    let totalPractice = 0;
    dataPractice.map((item: any) => {
      if (item.percentPass) totalPractice = totalPractice + item.percentPass;
    });
    let totalFinalTest = 0;
    dataFinalTest.map((item: any) => {
      if (item.percentPass) totalFinalTest = totalFinalTest + item.percentPass;
    });
    return (
      (totalAllTopics / dataTopics.length +
        totalPractice / dataPractice.length +
        totalFinalTest / dataFinalTest.length) /
      3
    ).toFixed(1);
  };

  const renderFinalTest = () => {
    let valueCorrect = 0;
    let valueWrong = 0;
    let valueTotal = 0;
    dataFinalTest.map((item: any) => {
      if (item.numberPass) valueCorrect = valueCorrect + item.numberPass;
      if (item.numberFail) valueWrong = valueWrong + item.numberFail;
      valueTotal = valueTotal + item.total_questions;
    });
    return token ? (
      <View style={styles.wrapItemContent}>
        <ProgressAllTopic
          valueWrong={dataReportFinalTest.wrong || 0}
          valueCorrect={dataReportFinalTest.correct || 0}
          total={valueTotal || 0}
          valueTotal={
            valueTotal - dataReportFinalTest.wrong - dataReportFinalTest.correct
          }
          title={'Final Test'}
        />
      </View>
    ) : (
      <View style={styles.wrapItemContent}>
        <ProgressAllTopic
          valueWrong={valueWrong || 0}
          valueCorrect={valueCorrect || 0}
          total={valueTotal || 0}
          valueTotal={valueTotal - valueCorrect - valueWrong}
          title={'Final Test'}
        />
      </View>
    );
  };

  const renderContent = () => {
    // dataTopics.map((item: any) => {
    //   if (item.numberPass) valueCorrect = valueCorrect + item.numberPass;
    //   if (item.numberFail) valueWrong = valueWrong + item.numberFail;
    //   valueTotal = valueTotal + item.total_questions;
    //   if (item.percentPass) {
    //     total = total + parseFloat(item.percentPass);
    //   }
    // });
    // console.log('total', total);
    return (
      <ScrollView
        style={styles.wrapContent}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: 20,
        }}>
        {renderPassingRate()}
        {/* All topics */}
        {renderAllTopic()}
        {renderPractice()}
        {renderFinalTest()}
        {/* <View style={styles.wrapItemContent}> */}
        {/* Pass rate */}
        {/* <View style={styles.viewCircularProgress}>
            <View style={styles.wrapItem}>
              <CircularProgress
                value={parseFloat((total / 4).toString()) || 0}
                radius={moderateScale(24)}
                activeStrokeWidth={10}
                progressValueColor={Colors.primaryMain}
                inActiveStrokeColor="#E6F6FF"
                activeStrokeColor={Colors.primaryMain}
                valueSuffix={'%'}
                progressFormatter={(value: number) => {
                  'worklet';
                  let number = value.toFixed(1);
                  let index = number.toString().indexOf('.0');
                  if (index > 0) {
                    return parseInt(number).toString();
                  }
                  return number;
                }}
              />
              <TextNormal fontSize={12} style={styles.txtAVGPass}>
                Pass rate
              </TextNormal>
            </View>
            <View style={styles.lineBorder} />
            Community AVG pass
            <View style={styles.wrapItem}>
              <CircularProgress
                value={topicReport?.statistics?.community_avg_pass || 0}
                radius={moderateScale(24)}
                activeStrokeWidth={10}
                progressValueColor={Colors.primaryMain}
                inActiveStrokeColor="#E6F6FF"
                activeStrokeColor={Colors.primaryMain}
                valueSuffix={'%'}
              />
              <TextNormal fontSize={12} style={styles.txtAVGPass}>
                Community AVG pass
              </TextNormal>
            </View>
          </View> */}

        {/* Your time question */}
        {/* <View style={styles.viewCircularProgress}> */}
        {/* <View style={styles.wrapItem}>
              <TextNormal fontSize={16} style={styles.stylesTimeQuestion}>
                {topicReport?.statistics?.time || '0ms'}
              </TextNormal>
              <TextNormal fontSize={12} style={{color: '#6D6B7A'}}>
                /question
              </TextNormal>
              <TextNormal fontSize={12} style={styles.txtAVGPass}>
                Your time
              </TextNormal>
            </View>
            <View style={styles.lineBorder} /> */}

        {/* Community AVG pass */}
        {/* <View style={styles.wrapItem}>
              <TextNormal fontSize={16} style={styles.stylesTimeQuestion}>
                {topicReport?.statistics?.community_avg_time || '0ms'}
              </TextNormal>
              <TextNormal fontSize={12} style={{color: '#6D6B7A'}}>
                /question
              </TextNormal>
              <TextNormal fontSize={12} style={styles.txtAVGPass}>
                Community AVG pass
              </TextNormal>
            </View>
          </View> */}

        {/* <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <ButtonCustom
              styleButton={[styles.btnDetail]}
              styleText={styles.txtDetail}
              text="Detail Topic"
              onPressNext={() => {
                navigation.navigate('DetailTopic');
              }}
              fontSize={14}
            />
            <ButtonCustom
              styleButton={styles.btnDetail}
              styleText={styles.txtDetail}
              text="Detail Day"
              onPressNext={() => {
                navigation.navigate('DetailDays', {key: 'DaysTopic'});
              }}
              fontSize={14}
            />
         
        </View> */}
        {/* </View> */}

        {/* <View style={styles.wrapItemContent}>
          <ProgressAllTopic
            valueWrong={item.numberPass || 0}
            valueCorrect={item.numberFail || 0}
            total={item.total_questions || 0}
            valueTotal={
              item.total_questions - item.numberFail - item.numberPass
            }
            title="Standard practice"
          />
          <ProgressAllTopic
            total={practice?.progress?.skipped || 0}
            correct={practice?.progress?.correct || 0}
            wrong={practice?.progress?.wrong || 0}
            valueCorrect={practice?.correct}
            valueWrong={practice?.wrong}
            valueTotal={practice?.skipped}
            isShowTotal
          />
          <ButtonCustom
            styleButton={[styles.btnDetail, styles.with100]}
            styleText={styles.txtDetail}
            text="Detail Day"
            onPressNext={() => {
              navigation.navigate('DetailDays', {key: 'DaysStandard'});
            }}
            fontSize={14}
          />
        </View> */}
        {/* <View style={[styles.wrapItemContent, {marginBottom: 20}]}>
          <ProgressAllTopic
            total={finalTest?.progress?.skipped || 0}
            correct={finalTest?.progress?.correct || 0}
            wrong={finalTest?.progress?.wrong || 0}
            valueCorrect={finalTest?.correct}
            valueWrong={finalTest?.wrong}
            valueTotal={finalTest?.skipped}
            title="Final test"
            isShowTotal
          />

          <ButtonCustom
            styleButton={[styles.btnDetail, styles.with100]}
            styleText={styles.txtDetail}
            text="Detail Day"
            onPressNext={() => {
              navigation.navigate('DetailDays', {key: 'DaysFinal'});
            }}
            fontSize={14}
          />
        </View> */}
      </ScrollView>
    );
  };
  return (
    <LinearGradientView>
      <LoadingModal visible={loading} />
      {hasNotch ? (
        <View
          style={{
            height: 36,
            width: '100%',
            paddingTop: moderateScale(30),
          }}
        />
      ) : (
        <View
          style={{
            height: 16,
            width: '100%',
            paddingTop: moderateScale(30),
          }}
        />
      )}
      <HeaderWithSignUp
        isShowSignUp={isShowSignUp}
        setModalSignUp={setModalSignUp}
      />

      {/* {renderHeader()} */}
      {renderTime()}
      {renderContent()}
    </LinearGradientView>
  );
};

export default Statistics;
