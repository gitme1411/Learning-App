import {
  FlatList,
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import {Colors, fullWidth, shadow} from '../../theme';
import {Icon} from '../../utils/icon';
import LinearGradient from 'react-native-linear-gradient';
import Subtitles from '../../components/Subtitles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {like, postRateQuiz, unlike} from '../../services/api/api';
import {setLanguage} from '../../store/user';
import ModalRateQuiz from '../../components/Modal/ModalRateQuiz';
import RenderHtml from 'react-native-render-html';
import {setPendingRating} from '../../store/questions';
import ToastSimple from 'react-native-simple-toast';
import ModalConfirm from '../../components/Modal/ModalConfirm';
import HeaderSubmit from '../../components/HeaderSubmit';
import ModalConfirmSubmit from '../../components/Modal/ModalConfirmSubmit';
import Toast from 'react-native-toast-message';
import ModalSubmit from '../../components/Modal/ModalSubmit';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';
import ReviewQuestionModal from '@/components/Modal/ModalReviewQuestion';
import {useQuery, useRealm} from '@realm/react';
import Favorite from '@/model/favorite';

const Questions = ({route, navigation}: any) => {
  const {itemLevel, title, reset} = route.params;
  const realm = useRealm();
  const listFavoriteQuestion = useQuery(Favorite);
  const {width} = useWindowDimensions();
  const [value, setValue] = useState('');
  const [rating, setRate] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [numAns, setNumAns] = useState(0);
  const [isModalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const idLeng = useSelector((state: RootState) => state.user.language);

  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const newData = useMemo(() => {
    return itemLevel.random_questions.map((e: any) => {
      return {
        ...e,
        checked: false,
        user_answers: -1,
      };
    });
  }, [itemLevel]);
  const [dataQuestions, setDataQuestions] = useState(newData);
  const [dataQuestionsReset, setDataQuestionsReset] = useState(newData);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (reset) {
        flatlistRef.current?.scrollToOffset({offset: 0, animated: false});
        setCurrentIndex(0);
        setShowExplan(false);
        setDataQuestions(dataQuestionsReset);
      }
    });
    return unsubscribe;
  }, [navigation, reset]);
  const dispatch = useDispatch();

  const flatlistRef = useRef<FlatList>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [isModalConfirmVisibleCancel, setModalConfirmVisibleCancel] =
    useState(false);
  const [isModalSubmit, setModalSubmit] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [showExplan, setShowExplan] = useState(false);

  const scrollToIndex = (index: number) => {
    flatlistRef?.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  const onPreQues = (item, index) => {
    if (index - 1 < 0) return;
    setShowExplan(false);
    scrollToIndex(index - 1);
    //  get question_id
    if (currentIndex < dataQuestions.length + 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onNextQues = (item, index) => {
    if (index > dataQuestions.length - 2) return;
    setShowExplan(false);
    scrollToIndex(index + 1);
    //  get question_id
    if (currentIndex < dataQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
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

  const onClose = () => {
    setModalConfirmVisible(false);
    setModalShow(true);
  };

  const goBack = () => {
    setModalConfirmVisibleCancel(true);
  };

  const onSubmitNoSave = () => {
    setModalConfirmVisible(false);
    navigation.navigate('PassingTopicScreen', {
      dataQuestions: dataQuestions,
      itemLevel: itemLevel,
      save: false,
      title: title,
    });
  };

  const tagsStyles = {
    p: {
      fontSize: 14,
    },
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

  const onCheck = item => {
    setShowExplan(true);
    let newData = dataQuestions.map(ques => {
      if (ques.id == item.id) {
        return {
          ...ques,
          checked: true,
        };
      }
      return {
        ...ques,
      };
    });

    setDataQuestions(newData);
  };

  const onSubmitData = () => {
    setModalSubmit(false);
    // let dataQuestionsNew = dataQuestions.map(e => {
    //   let id = e.user_answers;
    //   let check = checkAnswer(id, e);
    //   return {
    //     ...e,
    //     isPass: check,
    //   };
    // });
    // let numberPass = dataQuestionsNew.filter((item: any) => item.isPass).length;
    // let percentPass = Math.round((numberPass / dataQuestionsNew.length) * 100);

    // let itemLevelNew = {...itemLevel, random_questions: dataQuestionsNew};
    // const dataTopicsNew = dataTopics.map((item: any) => ({...item}));
    // const topicId = dataTopicsNew.findIndex(
    //   (dTopic: any) => dTopic.id === itemLevelNew.topic_info.id,
    // );
    // // console.log('dataQuestionssss topic 123', topicId);
    // const levelId = dataTopicsNew[topicId].data_level.findIndex(
    //   (dLevel: any) => dLevel.id === itemLevelNew.id,
    // );
    // let dataLevel = [...dataTopicsNew[topicId].data_level];

    // let is_passed = false;
    // if (dataTopicsNew[topicId].id === 4) {
    //   is_passed = percentPass === 100;
    // } else {
    //   is_passed = percentPass >= 80;
    // }
    // const level = {
    //   ...dataLevel[levelId],
    //   is_passed,
    //   numberPass,
    //   percentPass,
    // };

    // dataLevel[levelId] = level;
    // dataTopicsNew[topicId].data_level = dataLevel;
    // let total = 0;
    // dataTopicsNew[topicId].data_level.map((item: any) => {
    //   // console.log('itemitem', item);
    //   if (item.numberPass) total = total + item.numberPass;
    // });
    // dataTopicsNew[topicId].numberPass = total;
    // dataTopicsNew[topicId].percentPass = (
    //   (dataTopicsNew[topicId].numberPass /
    //     dataTopicsNew[topicId].total_questions) *
    //   100
    // ).toFixed(1);

    // dispatch(setDataLocalTopic(dataTopicsNew));
    navigation.navigate('PassingTopicScreen', {
      dataQuestions: dataQuestions,
      itemLevel: itemLevel,
      // dataTopics: dataTopicsNew[topicId],
      save: true,
      title: title,
    });
  };

  const onSubmit = () => {
    const dataCheck = dataQuestions.filter(item => item.user_answers > 0);

    if (dataCheck.length < dataQuestions.length) {
      setNumAns(dataCheck.length);
      setModalConfirmVisible(true);
    }

    if (dataCheck.length == dataQuestions.length) {
      setModalSubmit(true);
    }
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

  const onSelect = (selectedItem, indexDrop) => {
    // setIdLeng(indexDrop)
    dispatch(setLanguage(indexDrop));
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
            tagsStyles={tagsStyles}
          />
        )}

        {idLeng == 1 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_vi}`,
              }}
              tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_cn}`,
              }}
              tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_ja}`,
              }}
              tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_kr}`,
              }}
              tagsStyles={tagsStyles}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItemUserAns = (item, user_answers) => {
    if (item.is_true == 1) {
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
              tagsStyles={tagsStyles}
            />
          )}
          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
                tagsStyles={tagsStyles}
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
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
                tagsStyles={tagsStyles}
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
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
                tagsStyles={tagsStyles}
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
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
                tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
          )}
          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
                tagsStyles={tagsStyles}
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
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
                tagsStyles={tagsStyles}
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
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
                tagsStyles={tagsStyles}
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
                tagsStyles={tagsStyles}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
                tagsStyles={tagsStyles}
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
            tagsStyles={tagsStyles}
          />
        )}
        {idLeng == 1 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_vi}`,
              }}
              tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_cn}`,
              }}
              tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_ja}`,
              }}
              tagsStyles={tagsStyles}
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
              tagsStyles={tagsStyles}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_kr}`,
              }}
              tagsStyles={tagsStyles}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderAnswer = itemAns => {
    return (
      <FlatList
        contentContainerStyle={{alignItems: 'center', justifyContent: 'center'}}
        data={itemAns.answers_random}
        renderItem={({item}) => renderItemAns(item, itemAns)}
        keyExtractor={item => item.id}
        ListFooterComponent={() => (
          <View style={{width: '100%', height: 12}}></View>
        )}
      />
    );
  };

  const handleSelectQuestion = (id: number) => {
    setModalVisible(false); // Close the modal when a question is selected
  };

  const renderUserAns = item => {
    const user_answers = item.user_answers;
    return (
      <FlatList
        data={item.answers_random}
        renderItem={({item}) => renderItemUserAns(item, user_answers)}
        keyExtractor={item => item.id}
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
          style={{
            flex: 1,
            width: fullWidth - 25,
          }}
          nestedScrollEnabled
          contentContainerStyle={{alignItems: 'center'}}
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
                tagsStyles={tagsStyles}
              />
            )}

            {idLeng == 1 && (
              <View>
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_en}`,
                  }}
                  tagsStyles={tagsStyles}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_vi}`,
                  }}
                  tagsStyles={tagsStyles}
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
                  tagsStyles={tagsStyles}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_cn}`,
                  }}
                  tagsStyles={tagsStyles}
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
                  tagsStyles={tagsStyles}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_ja}`,
                  }}
                  tagsStyles={tagsStyles}
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
                  tagsStyles={tagsStyles}
                />
                <RenderHtml
                  contentWidth={width}
                  source={{
                    html: `${item.content_kr}`,
                  }}
                  tagsStyles={tagsStyles}
                />
              </View>
            )}
          </View>
          {item.checked == false
            ? renderAnswer(item, index)
            : renderUserAns(item, index)}

          {/* {renderAnswer(item, index)} */}

          {showExplan && (
            <View style={styles.wrapQues}>
              <TextNormal
                fontSize={16}
                style={{color: '#FFAD33', fontWeight: '600'}}>
                Explanation
              </TextNormal>
              <View style={{marginTop: 12}}>
                {idLeng == 0 && (
                  <RenderHtml
                    contentWidth={width}
                    source={{
                      html: `${item.explanation_en}`,
                    }}
                    tagsStyles={tagsStyles}
                  />
                )}

                {idLeng == 1 && (
                  <View>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: `${item.explanation_en}`,
                      }}
                      tagsStyles={tagsStyles}
                    />
                    <View style={styles.space}></View>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: `${item.explanation_vi}`,
                      }}
                      tagsStyles={tagsStyles}
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
                      tagsStyles={tagsStyles}
                    />
                    <View style={styles.space}></View>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: `${item.explanation_cn}`,
                      }}
                      tagsStyles={tagsStyles}
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
                      tagsStyles={tagsStyles}
                    />
                    <View style={styles.space}></View>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: `${item.explanation_ja}`,
                      }}
                      tagsStyles={tagsStyles}
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
                      tagsStyles={tagsStyles}
                    />
                    <View style={styles.space}></View>
                    <RenderHtml
                      contentWidth={width}
                      source={{
                        html: `${item.explanation_kr}`,
                      }}
                      tagsStyles={tagsStyles}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
          <View style={{width: '100%', height: 120}}></View>
        </ScrollView>
        {/* paddingBottom: 15 */}
        <View
          style={{
            position: 'absolute',
            bottom: moderateScale(30),
            left: 0,
            right: 0,
            height: 50,
          }}>
          {renderBottom(item, index)}
        </View>
      </View>
    );
  };

  const renderBottom = (item, index) => {
    // console.log('item.check ', item);
    return (
      <View style={styles.wrapBtn}>
        <TouchableOpacity
          onPress={() => onPreQues(item, index)}
          disabled={index == 0}
          style={styles.buttonBottom}>
          {index == 0 ? (
            <View
              style={{
                backgroundColor: '#D8D6DD',
                flex: 1,
                height: 44,
                borderRadius: 100,
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
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonBottom}
          onPress={() => onCheck(item, index)}
          disabled={!(item.user_answers > -1 && !item.checked)}>
          {item.user_answers > -1 && !item.checked ? (
            <LinearGradient
              colors={['#00C2FF', '#0F90EB']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.wrapCheck}>
              <TextNormal
                fontSize={14}
                style={{
                  fontWeight: '600',
                  color: '#fff',
                }}>
                Check
              </TextNormal>
            </LinearGradient>
          ) : (
            <View style={[styles.wrapCheck, {backgroundColor: '#D8D6DD'}]}>
              <TextNormal
                fontSize={14}
                style={{
                  fontWeight: '600',
                  color: '#fff',
                }}>
                Check
              </TextNormal>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonBottom}
          onPress={() =>
            index == dataQuestions.length - 1
              ? onSubmit()
              : onNextQues(item, index)
          }>
          {index == dataQuestions.length - 1 ? (
            <View
              style={{
                backgroundColor: '#FFD265',
                flex: 1,
                height: 44,
                borderRadius: 100,
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
        title={title}
        showBtnRight={false}
        onBtnRight={() => setModalVisible(true)}
        goBack={() => goBack()}
        onBtnSubmit={() => onSubmit()}
      />
      <View style={styles.wrapList}>
        <FlatList
          style={{paddingTop: 16}}
          data={dataQuestions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => renderItem(item, index)}
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={flatlistRef}
          scrollEnabled={false}
        />
        {/* {renderBottom()} */}

        <ReviewQuestionModal
          isVisible={isModalShow}
          onClose={() => setModalShow(false)}
          questions={dataQuestions}
          onSelectQuestion={handleSelectQuestion}
          scrollToIndex={scrollToIndex}
        />
      </View>
      <ModalConfirm
        modalVisible={isModalConfirmVisibleCancel}
        onClose={() => setModalConfirmVisibleCancel(false)}
        onSubmit={() => navigation.goBack()}
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
    // backgroundColor: "#fff",
    flexDirection: 'row',
    paddingTop: 8,
    flex: 1,
  },
  wrapPre: {
    flex: 1,
    height: 44,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapCheck: {
    height: 44,
    borderRadius: 333,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
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

  space: {
    height: 16,
    width: '100%',
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
  buttonBottom: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default Questions;
