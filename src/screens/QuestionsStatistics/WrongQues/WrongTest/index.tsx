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
import LinearGradientView from '../../../../components/LinerGradient';
import {Colors, fullWidth, shadow, spacing} from '../../../../theme';
import {Icon} from '../../../../utils/icon';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import Subtitles from '../../../../components/Subtitles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../../store';
import {like, postRateQuiz, unlike} from '../../../../services/api/api';
import HeaderSubmit from '../../../../components/HeaderSubmit';
import {setLanguage} from '../../../../store/user';
import CountdownTimer from '../../../../components/TimeCountDown/CountdownTimer';
import RenderHtml from 'react-native-render-html';
import {setPendingRating} from '../../../../store/questions';
import ToastSimple from 'react-native-simple-toast';
import ModalRateQuiz from '../../../../components/Modal/ModalRateQuiz';
import {moderateScale} from 'react-native-size-matters';
import {
  likeQuestion,
  unlikeQuestion,
} from '../../../../store/likedQuestionsSlice';
import ModalConfirm from '../../../../components/Modal/ModalConfirm';
import ModalConfirmSubmit from '../../../../components/Modal/ModalConfirmSubmit';
import TextNormal from '../../../../components/Text';
import ReviewQuestionModal from '@/components/Modal/ModalReviewQuestion';
import ModalNormal from '@/components/Modal/ModalNormal';
import {useQuery, useRealm} from '@realm/react';
import Favorite from '@/model/favorite';

const WrongTest = ({route, navigation}: any) => {
  const {dataQues, time, dataWrong} = route.params;
  const {width} = useWindowDimensions();
  const realm = useRealm();
  const listFavoriteQuestion = useQuery(Favorite);
  const dataWrQuestions = dataQues.map((question: any) => {
    return {
      ...question,
      checked: false,
      user_answers: -1,
    };
  });
  const dataProgress = useSelector(
    (state: RootState) => state.topics.dataProgress,
  );

  const idLeng = useSelector((state: RootState) => state.user.language);

  const [dataQuestions, setDataQuestions] = useState(dataWrQuestions);
  const [isModalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [isModalConfirmVisibleCancel, setModalConfirmVisibleCancel] =
    useState(false);
  const [numAns, setNumAns] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rating, setRate] = useState<number>(1);
  const [value, setValue] = useState('');
  const [showRate, setShowRate] = useState(false);
  const likedQuestions = useSelector(
    (state: RootState) => state.listFavorite.likedQuestions,
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const [isModalSubmit, setModalSubmit] = useState(false);

  // const getDataQuestions = async () => {
  //     const res = await getQuestions(itemLevel.id)
  //     console.log(res, "res ===")
  //     if (res && res.res && res.res.questions) {
  //         console.log(res.res.questions, "res.res.questions")
  //         setDataQuestions(res.res.questions)
  //     }
  // }

  useEffect(() => {
    // dispatch(setDataLocal({ dataTopics: dataTopicsLocal }))
    // getDataQuestions()
  }, []);

  const dispatch = useDispatch();
  // const dataQuestions = useSelector((state: RootState) => state.questions.dataQuestions)

  // let index = 0

  const flatlistRef = useRef();

  const [isModalVisible, setModalVisible] = useState(false);

  const [choice, setChoice] = useState(0);
  const [isModalShow, setModalShow] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleSelectQuestion = (id: number) => {
    setModalVisible(false); // Close the modal when a question is selected
  };

  const scrollToIndex = (index: number) => {
    flatlistRef?.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  };

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

  const onSubmitData = (dataCheck: any) => {
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

    let newDataProgess = dataProgress;

    // dispatch(setDataProgress({
    //     progress: newDataProgess.progress,
    //     q_correct: newDataProgess.q_correct + correct,
    //     q_not_answer: newDataProgess.q_not_answer,
    //     q_wrong: newDataProgess.q_wrong + (dataCheck.length - correct),
    // }))
    setModalConfirmVisible(false);
    navigation.navigate('WrongResult', {
      dataQuestions: dataQuestions,
      // itemTest: itemTest,
      save: true,
    });
  };

  const onSubmit = () => {
    navigation.navigate('WrongResult', {
      dataQuestions: dataQuestions,
      dataWrong: dataWrong,
      // itemTest: itemTest,
      save: false,
    });

    // const dataCheck = dataQuestions.filter(item => item.user_answers > 0);

    // console.log(dataCheck, 'dataCheck ==');

    // if (dataCheck.length < dataQuestions.length) {
    //   setNumAns(dataCheck.length);
    //   setModalConfirmVisible(true);
    // }

    // if (dataCheck.length == dataQuestions.length) {
    //   onSubmitData(dataCheck);
    // }
  };

  const onSubmitNoSave = () => {
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

    let newDataProgess = dataProgress;

    // dispatch(setDataProgress({
    //     progress: newDataProgess.progress,
    //     q_correct: newDataProgess.q_correct + correct,
    //     q_not_answer: newDataProgess.q_not_answer,
    //     q_wrong: newDataProgess.q_wrong + (dataCheck.length - correct),
    // }))
    setModalConfirmVisible(false);
    navigation.navigate('WrongResult', {
      dataQuestions: dataQuestions,
      // itemTest: itemTest,
      save: false,
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

  const renderAnswer = (itemAns, index) => {
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

  const renderUserAns = (item, index) => {
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
        {/* paddingBottom: 25 */}
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
          onPress={() => onNextQues(item, index)}
          disabled={index == dataQuestions.length - 1}>
          {index == dataQuestions.length - 1 ? (
            <View
              style={{
                width: fullWidth * 0.4,
                height: 44,
                backgroundColor: '#D8D6DD',
                borderRadius: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image source={Icon.icNext} />
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
        title={'Wrong Question'}
        showBtnRight={true}
        onBtnRight={() => setModalVisible(true)}
        goBack={() => setModalSubmit(true)}
        onBtnSubmit={() => onSubmit()}
      />
      <CountdownTimer initialTime={time} onFinish={() => onSubmit()} />
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
      <ModalConfirm
        modalVisible={isModalConfirmVisibleCancel}
        onClose={() => setModalConfirmVisibleCancel(false)}
        onSubmit={() => {
          setModalConfirmVisibleCancel(false);
          navigation.goBack();
        }}
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
      <ModalNormal
        modalVisible={isModalSubmit}
        onClose={() => setModalSubmit(false)}
        onSubmit={() => navigation.goBack()}
        title="Confirm"
        textContent={'Are you sure to exit this test'}
        textClose="No"
        textSubmit="Yes"
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
    // backgroundColor: "#fff",
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

export default WrongTest;
