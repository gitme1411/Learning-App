import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradientView from '../../../components/LinerGradient';
import {Colors, fullWidth, shadow, spacing} from '../../../theme';
import {Icon} from '../../../utils/icon';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Subtitles from '../../../components/Subtitles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {like, postRateQuiz, unlike} from '../../../services/api/api';
import HeaderSubmit from '../../../components/HeaderSubmit';
import {setLanguage} from '../../../store/user';
import RenderHtml from 'react-native-render-html';
import ModalConfirm from '../../../components/Modal/ModalConfirm';
import ToastSimple from 'react-native-simple-toast';
import {setPendingRating} from '../../../store/questions';
import ModalRateQuiz from '../../../components/Modal/ModalRateQuiz';
import ModalConfirmSubmit from '../../../components/Modal/ModalConfirmSubmit';
import ModalSubmit from '../../../components/Modal/ModalSubmit';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../../components/Text';
import {setDataLocalPractice} from '@/store/practice';
import ReviewQuestionModal from '@/components/Modal/ModalReviewQuestion';
import {useObject, useQuery, useRealm} from '@realm/react';
import Practice from '@/model/practice';
import Favorite from '@/model/favorite';
import {setNumberPracticeTodayPlan} from '@/store/config';

const QuestionPractice = ({route, navigation}: any) => {
  const {itemPractice, reset} = route.params;
  const realm = useRealm();
  const practiceCurrent = useObject(Practice, itemPractice.id);
  const {width} = useWindowDimensions();
  const listFavoriteQuestion = useQuery(Favorite);
  const numberPracticeTodayPlan = useSelector(
    (state: RootState) => state.config.numberPracticeTodayPlan,
  );
  const numberFailPracticeTodayPlan = useSelector(
    (state: RootState) => state.config.numberFailPracticeTodayPlan,
  );
  const idLeng = useSelector((state: RootState) => state.user.language);
  const token = useSelector((state: RootState) => state.auth.token);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rating, setRate] = useState<number>(1);
  const [value, setValue] = useState('');
  const [showRate, setShowRate] = useState(false);
  const dataPractice = useSelector(
    (state: RootState) => state.practice.dataPractice,
  );
  const newData = itemPractice.random_questions.map(e => {
    return {
      ...e,
      checked: false,
      user_answers: -1,
    };
  });
  const [dataQuestions, setDataQuestions] = useState(newData);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  // const getDataQuestions = async () => {
  //     const res = await getQuestions(itemLevel.id)
  //     console.log(res, "res ===")
  //     if (res && res.res && res.res.questions) {
  //         console.log(res.res.questions, "res.res.questions")
  //         setDataQuestions(res.res.questions)
  //     }
  // }

  const dispatch = useDispatch();
  // const dataQuestions = useSelector((state: RootState) => state.questions.dataQuestions)

  // let index = 0

  const flatlistRef = useRef<FlatList>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [isModalConfirmVisibleCancel, setModalConfirmVisibleCancel] =
    useState(false);
  const [isModalSubmit, setModalSubmit] = useState(false);

  const [indexFZ, setIndexFZ] = useState(1);
  const [txtFZ, setTxtFZ] = useState('Nhỏ');
  const [size, setSize] = useState(14);
  const [numAns, setNumAns] = useState(0);
  const [choice, setChoice] = useState(0);
  const [isModalShow, setModalShow] = useState(false);

  const handleSelectQuestion = (id: number) => {
    setModalVisible(false); // Close the modal when a question is selected
  };

  const scrollToIndex = (index: number) => {
    flatlistRef?.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (reset) {
        flatlistRef.current?.scrollToOffset({offset: 0, animated: false});
        setChoice(0);
        setCurrentIndex(0);
        setDataQuestions(newData);
      }
    });
    return unsubscribe;
  }, [navigation, reset]);

  const onPreQues = (item, index) => {
    if (index - 1 < 0) return;
    scrollToIndex(index - 1);
    setChoice(0);
  };

  const onNextQues = (item, index) => {
    if (index > dataQuestions.length - 2) return;
    scrollToIndex(index + 1);
    setChoice(0);
  };

  const onSubmitData = () => {
    setModalSubmit(false);
    const dataCheck = dataQuestions.filter(item => item.user_answers > 0);
    let correct = 0;
    dataCheck.map(e => {
      let id = e.user_answers;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = correct + 1;
          }
        }
      });
    });

    let dataQuestionsNew = dataQuestions.map(e => {
      let id = e.user_answers;
      let check = checkAnswer(id, e);
      return {
        ...e,
        isPass: check,
        criticalSentenceFail: e.critical_sentence == 1 && !check,
      };
    });
    let numberPass = dataQuestionsNew.filter((item: any) => item.isPass).length;
    let percentPass = Math.round((numberPass / dataQuestionsNew.length) * 100);
    let checkCriticalSentence = dataQuestionsNew.filter(
      (item: any) => item.criticalSentenceFail,
    ).length;

    let itemPracticeNew = {
      ...itemPractice,
      random_questions: dataQuestionsNew,
    };
    let dataPracticeNew = [...dataPractice];
    const practiceId = dataPracticeNew.findIndex(
      (dPractice: any) => dPractice.id === itemPracticeNew.id,
    );
    let is_passed = percentPass >= 75 && checkCriticalSentence == 0;
    let practice: any = {};
    if (
      dataPracticeNew[practiceId].dateAnswer === new Date().toLocaleDateString()
    ) {
      practice = {
        ...dataPracticeNew[practiceId],
        random_questions: dataQuestionsNew,
        is_passed,
        numberPass,
        percentPass,
        numberFail: 20 - numberPass,
        dateAnswer: dataPracticeNew[practiceId].dateAnswer
          ? dataPracticeNew[practiceId].dateAnswer
          : new Date().toLocaleDateString(),
        oldNumberPass: dataPracticeNew[practiceId].numberPass,
      };
    } else {
      practice = {
        ...dataPracticeNew[practiceId],
        random_questions: dataQuestionsNew,
        is_passed,
        numberPass,
        percentPass,
        numberFail: 20 - numberPass,
        dateAnswer: dataPracticeNew[practiceId].dateAnswer
          ? dataPracticeNew[practiceId].dateAnswer
          : new Date().toLocaleDateString(),
      };
    }
    // const practice = {
    //   ...dataPracticeNew[practiceId],
    //   is_passed,
    //   numberPass,
    //   percentPass,
    //   numberFail: 20 - numberPass,
    // };

    dataPracticeNew[practiceId] = practice;
    if (!token) {
      if (practiceCurrent) {
        realm.write(() => {
          practiceCurrent.random_questions = dataQuestionsNew;
          practiceCurrent.is_passed = is_passed;
          practiceCurrent.numberPass = numberPass;
          practiceCurrent.percentPass = percentPass;
          practiceCurrent.numberFail = 20 - numberPass;
          practiceCurrent.dateAnswer = practice.dateAnswer;
        });
      }
      if (practice.dateAnswer === new Date().toLocaleDateString()) {
        let numberPassTodayPlan = numberPracticeTodayPlan + numberPass;
        let numberFailTodayPlan = numberFailPracticeTodayPlan + 20 - numberPass;
        if (dataPracticeNew[practiceId].oldNumberPass) {
          dispatch(
            setNumberPracticeTodayPlan({
              numberPracticeTodayPlan:
                numberPassTodayPlan - dataPracticeNew[practiceId].oldNumberPass,
              numberFailPracticeTodayPlan:
                numberFailTodayPlan -
                (20 - dataPracticeNew[practiceId].oldNumberPass),
            }),
          );
        } else {
          dispatch(
            setNumberPracticeTodayPlan({
              numberPracticeTodayPlan: numberPassTodayPlan,
              numberFailPracticeTodayPlan: numberFailTodayPlan,
            }),
          );
        }
      }
      dispatch(setDataLocalPractice(dataPracticeNew));
    }
    navigation.navigate('PassingPractice', {
      dataQuestions: dataQuestionsNew,
      itemPractice: practice,
      save: true,
      checkCriticalSentence: checkCriticalSentence,
      title: itemPractice.name,
    });
  };

  const checkAnswer = (id, question) => {
    let result = question.answers_random.find((answer: any) => answer.is_true);
    if (result.id === id) {
      return true;
    } else {
      return false;
    }
  };

  const onSubmit = () => {
    const dataCheck = dataQuestions.filter(item => item.user_answers > 0);

    if (dataCheck.length < dataQuestions.length) {
      setNumAns(dataCheck.length);
      setModalConfirmVisible(true);
    }

    if (dataCheck.length == dataQuestions.length) {
      setModalSubmit(true);
      // onSubmitData();
    }
  };

  const onSubmitNoSave = () => {
    setModalConfirmVisible(false);
    const dataCheck = dataQuestions.filter(item => item.user_answers > 0);
    let correct = 0;
    dataCheck.map(e => {
      let id = e.user_answers;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = correct + 1;
          }
        }
      });
    });

    let dataQuestionsNew = dataQuestions.map(e => {
      let id = e.user_answers;
      let check = checkAnswer(id, e);
      return {
        ...e,
        isPass: check,
        criticalSentenceFail: e.critical_sentence == 1 && !check,
      };
    });
    let numberPass = dataQuestionsNew.filter((item: any) => item.isPass).length;
    let percentPass = Math.round((numberPass / dataQuestionsNew.length) * 100);
    let checkCriticalSentence = dataQuestionsNew.filter(
      (item: any) => item.criticalSentenceFail,
    ).length;

    let itemPracticeNew = {
      ...itemPractice,
      random_questions: dataQuestionsNew,
    };
    let dataPracticeNew = [...dataPractice];
    const practiceId = dataPracticeNew.findIndex(
      (dPractice: any) => dPractice.id === itemPracticeNew.id,
    );
    let is_passed = percentPass >= 75 && checkCriticalSentence == 0;
    const practice = {
      ...dataPracticeNew[practiceId],
      is_passed,
      numberPass,
      percentPass,
    };

    dataPracticeNew[practiceId] = practice;

    navigation.navigate('PassingPractice', {
      dataQuestions: dataQuestionsNew,
      itemPractice: practice,
      save: true,
      checkCriticalSentence: checkCriticalSentence,
      title: itemPractice.name,
    });
  };

  const onClose = () => {
    setModalConfirmVisible(false);
    setModalShow(true);
  };

  const addFavorite = async (questionId: any) => {
    let indexQuestion = listFavoriteQuestion.find(
      (item: any) => item.id === questionId.id,
    );
    if (indexQuestion === undefined) {
      try {
        if (token && isAuthenticated) {
          await like([questionId?.id]);
        } else {
          realm.write(() => {
            realm.create('Favorite', questionId);
          });
        }
        Toast.show({
          type: 'success',
          text1: 'Added to favorites',
        });
      } catch (error) {
        console.error('Error liking the question:', error);
      }
    } else {
      try {
        if (token && isAuthenticated) {
          await unlike([questionId?.id]);
        } else {
          realm.write(() => {
            realm.delete(indexQuestion);
          });
        }
        Toast.show({
          type: 'success',
          text1: 'Undo favorites',
        });
      } catch (error) {
        console.error('Error unliking the question:', error);
      }
    }
  };

  const addFlag = () => {
    setShowRate(true);
  };

  const onSendRate = async () => {
    const questionId = dataQuestions[currentIndex]?.id;
    const ratingData = {
      question_id: questionId,
      rate: rating,
      comment: value,
    };

    setLoading(true);
    const response = await postRateQuiz(
      ratingData.question_id,
      ratingData.rate,
      ratingData.comment,
    );
    if (response?.error === 0) {
      setValue('');
      setShowRate(false);
      ToastSimple.showWithGravity(
        'Successful evaluation.',
        ToastSimple.LONG,
        ToastSimple.BOTTOM,
      );
    } else {
      dispatch(setPendingRating(ratingData));
      setShowRate(false);
      ToastSimple.showWithGravity(
        'Evaluation saved successfully.',
        ToastSimple.LONG,
        ToastSimple.BOTTOM,
      );
    }
    setLoading(false);
  };

  const onSelect = (selectedItem, indexDrop) => {
    dispatch(setLanguage(indexDrop));
  };

  const onSelectAns = item => {
    let newData = dataQuestions.map(ques => {
      if (ques.id == item.m_question_id) {
        return {
          ...ques,
          user_answers: item.id,
        };
      }
      return {
        ...ques,
      };
    });

    setDataQuestions(newData);
  };

  const renderItemAns = (item, itemAns) => {
    return (
      <TouchableOpacity
        style={[
          styles.wrapAns,
          {
            borderColor:
              itemAns.user_answers == item.id ? Colors.primaryMain : '#fff',
            borderWidth: 2,
          },
        ]}
        onPress={() => {
          onSelectAns(item);
        }}>
        {idLeng == 0 && (
          <RenderHtml
            contentWidth={width}
            source={{
              html: `${item.answer_en}`,
            }}
          />
        )}

        {idLeng == 1 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_vi}`,
              }}
            />
          </View>
        )}
        {idLeng == 2 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_cn}`,
              }}
            />
          </View>
        )}
        {idLeng == 3 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_ja}`,
              }}
            />
          </View>
        )}
        {idLeng == 4 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_kr}`,
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItemUserAns = (item, user_answers) => {
    if (user_answers == item.id && item.is_true == 1) {
      return (
        <TouchableOpacity
          style={[styles.wrapAns, {borderColor: '#34C759', borderWidth: 2}]}
          onPress={() => {}}
          disabled>
          <Image
            source={Icon.icCheckTrue}
            style={{position: 'absolute', right: 0, top: -8}}
          />
          {idLeng == 0 && (
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
          )}

          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
              />
            </View>
          )}
          {idLeng == 2 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
              />
            </View>
          )}
          {idLeng == 3 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
              />
            </View>
          )}
          {idLeng == 4 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    }
    if (user_answers == item.id && item.is_true == 0) {
      return (
        <TouchableOpacity
          style={[styles.wrapAns, {borderColor: '#F5574E', borderWidth: 2}]}
          onPress={() => {}}
          disabled>
          <Image
            source={Icon.icDelete}
            style={{position: 'absolute', right: 0, top: -8}}
          />
          {idLeng == 0 && (
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
          )}

          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
              />
            </View>
          )}
          {idLeng == 2 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
              />
            </View>
          )}
          {idLeng == 3 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
              />
            </View>
          )}
          {idLeng == 4 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
              />
            </View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.wrapAns, {borderColor: '#fff', borderWidth: 2}]}
        disabled>
        {idLeng == 0 && (
          <RenderHtml
            contentWidth={width}
            source={{
              html: `${item.answer_en}`,
            }}
          />
        )}

        {idLeng == 1 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_vi}`,
              }}
            />
          </View>
        )}
        {idLeng == 2 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_cn}`,
              }}
            />
          </View>
        )}
        {idLeng == 3 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_ja}`,
              }}
            />
          </View>
        )}
        {idLeng == 4 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_kr}`,
              }}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAnswer = itemAns => {
    return (
      <FlatList
        data={itemAns.answers_random}
        renderItem={({item}) => renderItemAns(item, itemAns)}
        keyExtractor={item => item.id}
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        ListFooterComponent={() => (
          <View style={{width: '100%', height: 12}}></View>
        )}
      />
    );
  };

  const renderItem = (item, index) => {
    return (
      <View
        style={{
          width: fullWidth - 32,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 16,
        }}>
        <ScrollView
          style={{flex: 1, width: fullWidth - 25}}
          contentContainerStyle={{alignItems: 'center'}}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}>
          <View style={styles.wrapQues}>
            <View style={styles.viewSubTitle}>
              <Subtitles onSelect={onSelect} />
              <View style={styles.viewTextNumber}>
                <TextNormal fontSize={14} style={styles.textNumber}>
                  {index + 1}/{dataQuestions.length}
                </TextNormal>
              </View>
              <View style={{flexDirection: 'row', paddingStart: 12}}>
                <TouchableOpacity onPress={() => addFavorite(item)}>
                  <Image
                    source={
                      listFavoriteQuestion.findIndex(
                        (question: any) => question.id === item.id,
                      ) > -1
                        ? Icon.icHeartBold
                        : Icon.icHeart
                    }
                    style={{marginRight: 8}}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={addFlag}>
                  <Image source={Icon.icFlag} style={{marginHorizontal: 8}} />
                </TouchableOpacity>
              </View>
            </View>
            {idLeng == 0 && (
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.content_en}`,
                }}
              />
            )}

            {idLeng == 1 && (
              <View>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_en}`,
                  }}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_vi}`,
                  }}
                />
              </View>
            )}
            {idLeng == 2 && (
              <View>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_en}`,
                  }}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_cn}`,
                  }}
                />
              </View>
            )}
            {idLeng == 3 && (
              <View>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_en}`,
                  }}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_ja}`,
                  }}
                />
              </View>
            )}
            {idLeng == 4 && (
              <View>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_en}`,
                  }}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_kr}`,
                  }}
                />
              </View>
            )}
          </View>
          {/* {item.user_answer < 0 ? renderAnswer(item, index) : renderUserAns(item, index)} */}
          {renderAnswer(item, index)}

          {/* <View style={styles.wrapQues}>
            <TextNormal fontSize={} style={{ color: '#FFAD33', fontWeight: '600' }}>
              Explanation
                </TextNormal>
            <View style={{ marginTop: 12 }}>
              {idLeng == 0 && (
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.explanation_en}`,
                  }}
                />
              )}

              {idLeng == 1 && (
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_en}`,
                    }}
                  />
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_vi}`,
                    }}
                  />
                </View>
              )}
              {idLeng == 2 && (
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_en}`,
                    }}
                  />
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_cn}`,
                    }}
                  />
                </View>
              )}
              {idLeng == 3 && (
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_en}`,
                    }}
                  />
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_ja}`,
                    }}
                  />
                </View>
              )}
              {idLeng == 4 && (
                <View>
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_en}`,
                    }}
                  />
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_kr}`,
                    }}
                  />
                </View>
              )}
            </View>
          </View> */}
          <View style={{width: '100%', height: 120}}></View>
        </ScrollView>
        {/* paddingBottom: 10 */}
        <View style={{position: 'absolute', bottom: moderateScale(30)}}>
          {renderBottom(item, index)}
        </View>
      </View>
    );
  };

  const renderBottom = (item, index) => {
    return (
      <View style={styles.wrapBtn}>
        <TouchableOpacity
          onPress={() => onPreQues(item, index)}
          disabled={index == 0}>
          {index == 0 ? (
            <View
              style={{
                width: fullWidth * 0.4,
                height: 44,
                backgroundColor: '#D8D6DD',
                borderRadius: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={Icon.icPre} />
            </View>
          ) : (
            <LinearGradient
              colors={['#00C2FF', '#0F90EB']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.wrapPre}>
              <Image source={Icon.icPre} />
            </LinearGradient>
          )}
          {/* <LinearGradient
            colors={['#00C2FF', '#0F90EB']}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
            style={styles.wrapPre}>
            <Image source={Icon.icPre} />
          </LinearGradient> */}
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => onCheck(item, index)} disabled={item.user_answer > 0}>
                    {item.user_answer < 0 ? <LinearGradient colors={['#00C2FF', '#0F90EB']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={styles.wrapCheck}>
                        {index + 1 != dataQuestions.length ? <TextNormal fontSize={} style={{ fontSize: moderateScale(14), fontWeight: "600", color: "#fff" }}>Check    </TextNormal> : <TextNormal fontSize={} style={{ fontSize: moderateScale(14), fontWeight: "600", color: "#fff" }}>Finish    </TextNormal>}
                    </LinearGradient> :
                        <View style={[styles.wrapCheck, { backgroundColor: "#D8D6DD" }]}>
                            {index + 1 != dataQuestions.length ? <TextNormal fontSize={} style={{ fontSize: moderateScale(14), fontWeight: "600", color: "#fff" }}>Check    </TextNormal> : <TextNormal fontSize={} style={{ fontSize: moderateScale(14), fontWeight: "600", color: "#fff" }}>Finish    </TextNormal>}
                        </View>}
                </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() =>
            index == dataQuestions.length - 1
              ? onSubmit()
              : onNextQues(item, index)
          }>
          {index == dataQuestions.length - 1 ? (
            <View
              style={{
                width: fullWidth * 0.4,
                height: 44,
                backgroundColor: '#FFD265',
                borderRadius: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextNormal
                fontSize={14}
                style={{
                  fontWeight: 'bold',
                  color: '#fff',
                }}>
                Finish
              </TextNormal>
            </View>
          ) : (
            <LinearGradient
              colors={['#00C2FF', '#0F90EB']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.wrapPre}>
              <Image source={Icon.icNext} />
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <LinearGradientView>
      <HeaderSubmit
        title={itemPractice.name}
        showBtnRight={false}
        onBtnRight={() => setModalVisible(true)}
        goBack={() => setModalConfirmVisibleCancel(true)}
        onBtnSubmit={() => onSubmit()}
      />
      <View style={styles.wrapList}>
        <FlatList
          style={{marginTop: 16}}
          data={dataQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => renderItem(item, index)}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={flatlistRef}
          scrollEnabled={false}
        />
        {/* {renderBottom()} */}
      </View>

      {/* <ModalConfirm
        modalVisible={isModalConfirmVisible}
        onClose={() => onClose()}
        onSubmit={() => onSubmitNoSave()}
      /> */}

      <ModalConfirm
        modalVisible={isModalConfirmVisibleCancel}
        onClose={() => setModalConfirmVisibleCancel(false)}
        onSubmit={() => {
          setModalConfirmVisibleCancel(false);
          navigation.goBack();
        }}
      />
      <ModalSubmit
        modalVisible={isModalSubmit}
        onClose={() => setModalSubmit(false)}
        onSubmit={() => onSubmitData()}
      />
      <ModalConfirmSubmit
        modalVisible={isModalConfirmVisible}
        onClose={() => onClose()}
        onSubmit={() => onSubmitNoSave()}
        numAns={numAns}
        numQues={dataQuestions.length}
      />
      <ReviewQuestionModal
        isVisible={isModalShow}
        onClose={() => setModalShow(false)}
        questions={dataQuestions}
        onSelectQuestion={handleSelectQuestion}
        scrollToIndex={scrollToIndex}
      />

      <ModalRateQuiz
        isVisible={showRate}
        visibleLoading={loading}
        note={value}
        onChangeText={text => {
          setValue(text);
        }}
        onSendRate={onSendRate}
        onSwipeComplete={() => setShowRate(false)}
        onRatingSelected={rating => {
          setRate(rating);
        }}
      />
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
  wrapList: {
    marginTop: 16,
    flex: 1,
    backgroundColor: '#F0F0F4',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // paddingHorizontal: 16
  },
  wrapBtn: {
    width: '100%',
    paddingHorizontal: moderateScale(spacing.mainSpacing),
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  wrapPre: {
    width: fullWidth * 0.4,
    height: 44,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapCheck: {
    width: fullWidth - 136,
    height: 44,
    borderRadius: 333,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  wrapQues: {
    backgroundColor: '#fff',
    padding: 16,
    ...shadow,
    width: fullWidth - 32,
    borderRadius: 16,
    marginTop: 4,
  },
  wrapAns: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    ...shadow,
    width: fullWidth - 32,
    // maxHeight: 70,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  textNumber: {
    fontWeight: '600',
    color: Colors.primaryMain,
    flex: 1,
    textAlign: 'center',
  },
  viewTextNumber: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 2,
    bottom: 0,
  },
  viewSubTitle: {
    flexDirection: 'row',
    height: 24,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default QuestionPractice;
