import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import ButtonIcon from '../../components/Button/ButtonIcon';
import {Icon} from '../../utils/icon';
import {styles} from './styles';
import AnimateNumber from 'react-native-animate-number';
import ButtonLinearProps from '../../components/Button/ButtonLinearProps';
import Icons from '../../components/Icon';
import ModalRateQuiz from '../../components/Modal/ModalRateQuiz';
import {useDispatch, useSelector} from 'react-redux';
import {setDataWrong} from '@/store/quesStatis';
import {RootState} from '../../store';
import {setDataLocalTopic, setDataProgressTopic} from '../../store/topics';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';
import ModalNormal from '@/components/Modal/ModalNormal';
import {useObject, useQuery, useRealm} from '@realm/react';
import Topic from '@/model/topic';
import WrongQuestion from '@/model/wrong_question';
import {setDataStudyPlan, setNumberTopicTodayPlan} from '@/store/config';
import {format} from 'date-fns';
import {submitTopic} from '@/services/api/api';

type SelectedButtonType = 'tryAgain' | 'flashcards' | 'tryAnother' | null;
const PassingTopicScreen = ({route, navigation}: any) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const realm = useRealm();
  const listWrongQuestion = useQuery(WrongQuestion);
  const {dataQuestions, itemLevel, save, title} = route.params;
  const topicCurrent = useObject(Topic, itemLevel.topic_info.id);
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const numberTopicTodayPlan = useSelector(
    (state: RootState) => state.config.numberTopicTodayPlan,
  );
  const numberFailTopicTodayPlan = useSelector(
    (state: RootState) => state.config.numberFailTopicTodayPlan,
  );
  const dataStudyPlan = useSelector(
    (state: RootState) => state.config.dataStudyPlan,
  );
  const [dataTopic, setDataTopic] = useState<any>({});
  const [dataTopicIndex, setDataTopicIndex] = useState(0);
  const [dataItemLevel, setDataItemLevel] = useState(itemLevel);
  const [isModalSubmit, setModalSubmit] = useState(false);
  const [selectedButton, setSelectedButton] =
    useState<SelectedButtonType>(null);

  const dataProgressTopic = useSelector(
    (state: RootState) => state.topics.dataProgressTopic,
  );

  const dispatch = useDispatch();

  const [modalRateQuiz, setRateQuiz] = useState(false);
  const {width, height} = Dimensions.get('window');
  useEffect(() => {
    if (save) {
      submit();
      if (!token) {
        saveWrongQues();
      }
    }
  }, []);

  const submit = async () => {
    if (token) {
      let answer = dataQuestions.map(e => {
        return {
          question_id: e.id,
          answer_id: [e.user_answers],
        };
      });
      let dataAnswers = {
        test_id: dataQuestions[0].pivot.m_test_id,
        time: 1000,
        answer: answer,
      };
      await submitTopic(dataAnswers.test_id, dataAnswers.time, answer);
    } else {
      saveResultTopics();
    }
  };

  useEffect(() => {
    let dataQuestionsNew = dataQuestions.map(e => {
      let id = e.user_answers;
      let check = checkAnswer(id, e);
      return {
        ...e,
        isPass: check,
      };
    });
    let numberPass = dataQuestionsNew.filter((item: any) => item.isPass).length;
    let percentPass = Math.round((numberPass / dataQuestionsNew.length) * 100);
    let itemLevelNew = {...itemLevel, random_questions: dataQuestionsNew};
    const dataTopicsNew = dataTopics.map((item: any) => ({...item}));
    const topicId = dataTopicsNew.findIndex(
      (dTopic: any) => dTopic.id === itemLevelNew.topic_info.id,
    );
    // console.log('dataQuestionssss topic 123', topicId);
    const levelId = dataTopicsNew[topicId].data_level.findIndex(
      (dLevel: any) => dLevel.id === itemLevelNew.id,
    );
    let dataLevel = [...dataTopicsNew[topicId].data_level];

    let is_passed = false;
    if (dataTopicsNew[topicId].id === 4) {
      is_passed = percentPass === 100;
    } else {
      is_passed = percentPass >= 80;
    }

    let level: any = {};
    if (
      save &&
      dataLevel[levelId].dateAnswer === new Date().toLocaleDateString()
    ) {
      level = {
        ...dataLevel[levelId],
        random_questions: dataQuestionsNew,
        is_passed,
        numberPass,
        percentPass,
        oldNumberPass: dataLevel[levelId].numberPass,
      };
    } else {
      level = {
        ...dataLevel[levelId],
        is_passed,
        random_questions: dataQuestionsNew,
        numberPass,
        percentPass,
        dateAnswer:
          dataLevel[levelId].dateAnswer != null &&
          dataLevel[levelId].dateAnswer != undefined &&
          dataLevel[levelId].dateAnswer != ''
            ? dataLevel[levelId].dateAnswer
            : new Date().toLocaleDateString(),
      };
    }

    dataLevel[levelId] = level;
    dataTopicsNew[topicId].data_level = dataLevel;
    let total = 0;
    let totalFail = 0;
    dataTopicsNew[topicId].data_level.map((item: any) => {
      if (item.numberPass != null && item.numberPass >= 0) {
        totalFail = totalFail + (10 - item.numberPass);
        total = total + item.numberPass;
      }
    });
    dataTopicsNew[topicId].numberPass = total;
    dataTopicsNew[topicId].numberFail = totalFail;
    dataTopicsNew[topicId].percentPass = (
      (dataTopicsNew[topicId].numberPass /
        dataTopicsNew[topicId].total_questions) *
      100
    ).toFixed(1);
    setDataItemLevel(level);

    if (save) {
      if (token) {
        setDataTopic(dataTopicsNew[topicId]);
        setDataTopicIndex(topicId);
      } else {
        dispatch(setDataLocalTopic(dataTopicsNew));
        setDataTopic(dataTopicsNew[topicId]);
        setDataTopicIndex(topicId);
        if (level.dateAnswer === new Date().toLocaleDateString()) {
          let numberPassTodayPlan = numberTopicTodayPlan + numberPass;
          let numberFailTodayPlan = numberFailTopicTodayPlan + 10 - numberPass;
          if (dataLevel[levelId].oldNumberPass) {
            let numberPass =
              numberPassTodayPlan - dataLevel[levelId].oldNumberPass;
            let numberFail =
              numberFailTodayPlan - (10 - dataLevel[levelId].oldNumberPass);
            dispatch(
              setNumberTopicTodayPlan({
                numberTopicTodayPlan: numberPass,
                numberFailTopicTodayPlan: numberFail,
              }),
            );
            setListDataStudyPlan(numberPass, numberFail);
          } else {
            dispatch(
              setNumberTopicTodayPlan({
                numberTopicTodayPlan: numberPassTodayPlan,
                numberFailTopicTodayPlan: numberFailTodayPlan,
              }),
            );
            setListDataStudyPlan(numberPassTodayPlan, numberFailTodayPlan);
          }
        }

        if (topicCurrent) {
          realm.write(() => {
            // realm.create('Topic', dataTopicsNew[topicId], 'modified');
            // topicCurrent.data_level = dataLevel;
            topicCurrent.data_level[levelId].random_questions =
              dataQuestionsNew;
            topicCurrent.data_level[levelId].is_passed = is_passed;
            topicCurrent.data_level[levelId].numberPass = numberPass;
            topicCurrent.data_level[levelId].percentPass = percentPass;
            topicCurrent.data_level[levelId].dateAnswer = level.dateAnswer;
            topicCurrent.numberPass = total;
            topicCurrent.numberFail = totalFail;
            topicCurrent.percentPass = (
              (dataTopicsNew[topicId].numberPass /
                dataTopicsNew[topicId].total_questions) *
              100
            ).toFixed(1);
          });
        }
      }
    } else {
      setDataTopic(dataTopics[topicId]);
      setDataTopicIndex(topicId);
    }
  }, []);

  const setListDataStudyPlan = (numberPass: any, numberFail: any) => {
    let listStudyPlan = {...dataStudyPlan};
    let date = new Date();
    let dateCurrent = format(date, 'yyyy-MM-dd');
    listStudyPlan[dateCurrent] = numberPass + numberFail;
    dispatch(setDataStudyPlan(listStudyPlan));
  };

  const checkAnswer = (id, question) => {
    let result = question.answers_random.find((answer: any) => answer.is_true);
    if (result.id === id) {
      return true;
    } else {
      return false;
    }
  };

  const saveWrongQues = () => {
    let data = dataQuestions.map(e => {
      let id = e.user_answers;
      let correct = false;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = true;
          }
        }
      });

      return {
        ques: e,
        correct: correct,
      };
    });
    realm.write(() => {
      data.map((e: any) => {
        let indexQuestion = listWrongQuestion.findIndex(
          (item: WrongQuestion) => item.id === e.ques.id,
        );
        if (!e.correct) {
          if (indexQuestion === -1) {
            // console.log('vao day');
            realm.create('WrongQuestion', {
              id: e.ques.id,
              ques: e.ques,
              correct: e.correct,
            });
          }
        } else {
          if (indexQuestion > -1) {
            realm.delete(listWrongQuestion[indexQuestion]);
          }
        }
      });
    });
    dispatch(setDataWrong(listWrongQuestion));
  };

  const saveResultTopics = () => {
    let data = dataQuestions.map(e => {
      let id = e.user_answers;
      let correct = false;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = true;
          }
        }
      });
      return {
        id: e.id,
        topic_id: e.m_topic_id,
        correct: correct,
      };
    });

    if (dataProgressTopic.length == 0) {
      dispatch(setDataProgressTopic(data));
    } else {
      let newData = dataProgressTopic;

      let add = true;
      data.map(e => {
        newData = newData.map(item => {
          if (e.id == item.id) {
            add = false;
            return e;
          } else {
            return item;
          }
        });
      });
      if (add == true) {
        newData.push(...data);
      }
      dispatch(setDataProgressTopic(newData));
    }
  };

  const onClose = () => {
    setModalSubmit(false);
  };
  const onConfirm = () => {
    setModalSubmit(false);
    setTimeout(() => {
      const levelId = dataTopic.data_level.findIndex(
        (dLevel: any) => dLevel.id === itemLevel.id,
      );
      navigation.navigate('Level', {
        itemLevel: dataTopic.data_level[levelId],
        itemTopic: dataTopic,
      });
      navigation.navigate('FlashCard', {
        itemLevel: itemLevel,
        title: title,
      });
    }, 1000);
  };

  // useEffect(() => {
  //   let correct = 0;
  //   dataQuestions.map(e => {
  //     let id = e.user_answers;
  //     e.answers_random.forEach(e => {
  //       if (e.is_true == 1) {
  //         if (e.id == id) {
  //           correct = correct + 1;
  //         }
  //       }
  //     });
  //   });
  //   setCorrect(correct);
  //   const result = Math.round((correct / dataQuestions.length) * 100);
  //   if (save == false) {
  //     return;
  //   }
  //   const itemResult = {
  //     result: result,
  //     level_id: itemLevel.id,
  //     topic_id: itemLevel.m_topic_id,
  //     is_lock: false,
  //   };
  //   let newData = [];
  //   if (dataResult.length < 1) {
  //     if (result > 80) {
  //       if (result < 100 && itemResult.topic_id == 4) {
  //         newData.push({...itemResult, is_lock: false});
  //       }
  //       newData.push({...itemResult, is_lock: true});
  //     } else {
  //       newData.push(itemResult);
  //     }
  //   }
  //   if (dataResult.length > 0) {
  //     let add: boolean = false;
  //     newData = dataResult.map(e => {
  //       if (e.level_id == itemResult.level_id) {
  //         if (itemResult.result > 80 && e.is_lock == false) {
  //           if (result < 100 && itemResult.topic_id == 4) {
  //             return {
  //               ...itemResult,
  //               is_lock: false,
  //             };
  //           }
  //           return {
  //             ...itemResult,
  //             is_lock: true,
  //           };
  //         } else {
  //           return {
  //             ...itemResult,
  //             is_lock: e.is_lock,
  //           };
  //         }
  //       } else {
  //         add = true;
  //         return e;
  //       }
  //     });

  //     if (add) {
  //       newData.push(itemResult);
  //     }
  //   }

  //   dispatch(setDataResult(newData));
  // }, []);

  const _renderPassing = () => {
    return (
      <View style={styles.viewImageScore}>
        <Image
          source={require('../../assets/images/img-group-chart.png')}
          style={[
            styles.img,
            {width: width * 0.8, height: height * 0.4, resizeMode: 'contain'},
          ]}
        />
        <View style={styles.viewAnimateNumber}>
          <AnimateNumber
            value={dataItemLevel.percentPass}
            interval={15}
            countBy={1}
            style={[
              styles.stylesNumberLoad,
              dataItemLevel.is_passed ? {color: '#2CC86F'} : {color: 'red'},
            ]}
            // onFinish={() => {
            //   navigate('ChartStudyPlanScreen');
            // }}
            formatter={(val: any) => {
              return parseInt(val) + '%';
            }}
          />
          <TextNormal
            fontSize={14}
            style={[
              styles.txtLoading,
              dataItemLevel.is_passed ? {color: '#2CC86F'} : {color: 'red'},
            ]}>
            {'Your final score'}
          </TextNormal>
        </View>
      </View>
    );
  };
  return (
    <LinearGradientView>
      <SafeAreaView style={styles.container}>
        <View
          style={{
            width: '100%',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
          <ButtonIcon
            icon={Icon.icClose}
            title=""
            onPress={() => {
              // console.log('dataQuestionssss topic 123', topicId);
              const levelId = dataTopic.data_level.findIndex(
                (dLevel: any) => dLevel.id === itemLevel.id,
              );
              navigation.navigate('Level', {
                itemLevel: dataTopic.data_level[levelId],
                itemTopic: dataTopic,
              });
              // navigation.navigate('Topic', {itemTopic: dataTopic});
            }}
            style={styles.btnClose}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <TextNormal
              fontSize={18}
              numberOfLines={2}
              style={{
                textAlign: 'center',
                fontWeight: '600',
                color: '#ffffff',
              }}>
              {title}
            </TextNormal>
          </View>
          <View style={styles.btnClose} />
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          {dataItemLevel.is_passed ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 8,
              }}>
              <TextNormal
                fontSize={24}
                style={{
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#2CC86F',
                  paddingHorizontal: 16,
                }}>
                Pass
              </TextNormal>
              <Image
                source={Icon.icHappy}
                style={{width: 24, height: 24, tintColor: '#FFB400'}}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 8,
              }}>
              <TextNormal
                fontSize={22}
                style={{
                  fontWeight: '600',
                  textAlign: 'center',
                  color: '#F5574E',
                  paddingHorizontal: 16,
                }}>
                Fail
              </TextNormal>
              <Image
                source={Icon.icConfuse}
                style={{width: 24, height: 24, tintColor: '#FFB400'}}
              />
            </View>
          )}
          <TextNormal fontSize={19} style={styles.txtTitle}>
            {dataItemLevel.is_passed
              ? ' Congratulations, you have passed \n the topic'
              : "You haven't passed the topic yet. \nTry harder!"}
          </TextNormal>
          {_renderPassing()}
          <View style={styles.viewRightAnswer}>
            <TouchableOpacity
              style={styles.btnRightAnswer}
              onPress={() => {
                navigation.navigate('Detail', {
                  dataQuestions: dataQuestions,
                  title: title,
                });
                // setRateQuiz(true);
              }}>
              <TextNormal fontSize={20} style={styles.txtNumberPass}>
                {dataItemLevel.numberPass}/{dataQuestions.length}
              </TextNormal>
              <TextNormal fontSize={14} style={styles.txtRightAnswer}>
                {'RightAnswer'}
              </TextNormal>
              <Icons icon={Icon.icCircleArrow} size={moderateScale(24)} />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {dataItemLevel.is_passed ? (
          <View style={styles.viewButtonTryAnother}>
            <ButtonLinearProps
              label="Try another"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.navigate('Topic', {indexTopic: dataTopicIndex});
              }}
            />
          </View>
        ) : (
          <View style={styles.viewButtonBottom}>
            <ButtonLinearProps
              label="Try again"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                const levelId = dataTopic.data_level.findIndex(
                  (dLevel: any) => dLevel.id === itemLevel.id,
                );
                navigation.navigate('Level', {
                  itemLevel: dataTopic.data_level[levelId],
                  itemTopic: dataTopic,
                });
                navigation.navigate('Questions', {
                  itemLevel: itemLevel,
                  reset: true,
                  title: title,
                });
                setSelectedButton('tryAgain');
              }}
            />
            <ButtonLinearProps
              label="Practice Flashcards"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                setModalSubmit(true);
                setSelectedButton('flashcards');
              }}
              // onPress={() =>
              //   navigation.navigate('FlashCard', {itemLevel: itemLevel})
              // }
            />
          </View>
        )}

        <ModalNormal
          modalVisible={isModalSubmit}
          onClose={onClose}
          onSubmit={onConfirm}
          title="Confirm"
          textContent="Would you like to practice flashcards?"
          textClose="No"
          textSubmit="Yes"
        />

        <ModalRateQuiz
          isVisible={modalRateQuiz}
          onSwipeComplete={() => {
            setRateQuiz(false);
          }}
        />
      </SafeAreaView>
    </LinearGradientView>
  );
};

export default PassingTopicScreen;
