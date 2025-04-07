import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '../../../components/LinerGradient';
import Header from '../../../components/Header';
import {Colors, fullWidth, shadow, spacing} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '../../../utils/icon';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import Subtitles from '../../../components/Subtitles';
import {
  getWrongQues,
  like,
  postRateQuiz,
  unlike,
} from '../../../services/api/api';
import RenderHtml from 'react-native-render-html';
import {moderateScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {setPendingRating} from '../../../store/questions';
import ToastSimple from 'react-native-simple-toast';
import ModalRateQuiz from '../../../components/Modal/ModalRateQuiz';
import LoadingModal from '../../../components/Loading';
import {setLanguage} from '../../../store/user';
import TextNormal from '../../../components/Text';
import {useQuery, useRealm} from '@realm/react';
import Favorite from '@/model/favorite';

const WrongQuestions = ({route, navigation}: any) => {
  const realm = useRealm();
  const listFavoriteQuestion = useQuery(Favorite);
  const [dataQuestions, setDataQuestions] = useState<any[]>([]);
  const idLeng = useSelector((state: RootState) => state.user.language);
  const [rating, setRate] = useState<number>(1);
  const [value, setValue] = useState('');
  const [showRate, setShowRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dataWrong = useSelector(
    (state: RootState) => state.quesStatis.dataWrong,
  );
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const {width} = useWindowDimensions();

  const dispatch = useDispatch();
  const getQuesWrong = async () => {
    setLoading(true);
    try {
      const res = await getWrongQues();
      setDataQuestions(res.res);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const getWrongLocal = () => {
    let dataWrongQues: any[] = [];
    dataWrong.map(e => {
      if (e.correct == false) {
        dataWrongQues.push(e.ques);
      }
    });
    setDataQuestions(dataWrongQues);
  };

  useEffect(() => {
    if (token && isAuthenticated) {
      getQuesWrong();
    } else {
      getWrongLocal();
    }
  }, []);

  const [show, setShow] = useState(false);

  const showAnser = () => {
    setShow(!show);
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

  const addFlag = () => {
    setShowRate(true);
  };

  const onSelect = (selectedItem, indexDrop) => {
    dispatch(setLanguage(indexDrop));
  };

  const renderItemAnsQuestion = (item, index) => {
    let textNull = '<p></p>';
    return (
      <View>
        {idLeng == 0 && (
          <View style={styles.viewAns}>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 1 && (
          <View style={styles.viewAns}>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
            <View style={styles.space}></View>
            <RenderHtml
              source={{
                html: `${item.answer_vi === null ? textNull : item.answer_vi}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 2 && (
          <View style={styles.viewAns}>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
            <View style={styles.space}></View>
            <RenderHtml
              source={{
                html: `${item.answer_cn === null ? textNull : item.answer_cn}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 3 && (
          <View style={styles.viewAns}>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
            <View style={styles.space}></View>
            <RenderHtml
              source={{
                html: `${item.answer_ja === null ? textNull : item.answer_ja}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 4 && (
          <View style={styles.viewAns}>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
            <View style={styles.space}></View>
            <RenderHtml
              source={{
                html: `${item.answer_kr === null ? textNull : item.answer_kr}`,
              }}
              tagsStyles={tagsStyles4}
              contentWidth={width}
            />
          </View>
        )}
      </View>
    );
  };

  const renderItemUserAns = (item, itemAns) => {
    // if (item.id == itemAns.user_answer && item.is_true == 1) {
    //     return (
    //         <View style={{ flexDirection: "row", alignItems: "center" }}>
    //             <Image source={Icon.icCheckTrue} style={{ width: 20, height: 20 }} />
    //             <TextNormal fontSize={} style={{ fontWeight: "400", color: "#34C759", marginLeft: 4 }}>{item.answer_en}    </TextNormal>
    //         </View>
    //     )
    // }
    // if (item.id == itemAns.user_answer && item.is_true == 0) {
    //     return (
    //         <View style={{ flexDirection: "row", alignItems: "center" }}>
    //             <Image source={Icon.icDelete} style={{ width: 20, height: 20 }} />
    //             <TextNormal fontSize={} style={{ fontWeight: "400", color: "#F5574E", marginLeft: 4 }}>{item.answer_en}    </TextNormal>
    //         </View>
    //     )
    // }
    // if (item.id != itemAns.user_answer && item.is_true == 1) {
    //     return (
    //         <View style={{ flexDirection: "row", alignItems: "center" }}>
    //             <Image source={Icon.icCheckTrue} style={{ width: 20, height: 20 }} />
    //             <TextNormal fontSize={} style={{ fontWeight: "400", color: "#34C759", marginLeft: 4 }}>{item.answer_en}    </TextNormal>
    //         </View>
    //     )
    // }
    return (
      <View style={{}}>
        {/* <TextNormal fontSize={} style={{ fontWeight: "400", color: "#6D6B7A", marginLeft: 24 }}>{item.answer_en}    </TextNormal> */}
        {idLeng == 0 && (
          <RenderHtml
            source={{
              html: `${item.answer_en}`,
            }}
            contentWidth={width}
          />
        )}
        {idLeng == 1 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              contentWidth={width}
            />
            <RenderHtml
              source={{
                html: `${item.answer_vi}`,
              }}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 2 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              contentWidth={width}
            />
            <RenderHtml
              source={{
                html: `${item.answer_cn}`,
              }}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 3 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              contentWidth={width}
            />
            <RenderHtml
              source={{
                html: `${item.answer_ja}`,
              }}
              contentWidth={width}
            />
          </View>
        )}
        {idLeng == 4 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
              contentWidth={width}
            />
            <RenderHtml
              source={{
                html: `${item.answer_kr}`,
              }}
              contentWidth={width}
            />
          </View>
        )}
      </View>
    );
  };

  const renderAnswerQuestion = itemAns => {
    return (
      <FlatList
        data={itemAns.answers_random}
        renderItem={({item, index}) => renderItemAnsQuestion(item, index)}
        ItemSeparatorComponent={() => {
          return <View style={{width: '100%', height: 8}} />;
        }}
      />
    );
  };

  const renderAns = (itemAns, index) => {
    return (
      <FlatList
        data={itemAns.answers}
        renderItem={({item, index}) => renderItemUserAns(item, itemAns)}
      />
    );
  };
  const renderItem = (item, index) => {
    return (
      <View
        style={{
          width: fullWidth - 32,
          ...shadow,
          backgroundColor: '#fff',
          borderRadius: 16,
        }}>
        <View
          style={{
            height: 24,
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: 24,
              width: 40,
              backgroundColor: Colors.primaryMain,
              justifyContent: 'center',
              alignItems: 'center',
              borderTopLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}>
            <TextNormal
              fontSize={14}
              style={{
                fontWeight: '600',

                color: '#fff',
              }}>
              {index + 1}
            </TextNormal>
          </View>
          <View style={{flexDirection: 'row', padding: 5}}>
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
        <View style={{paddingHorizontal: 16, marginTop: 8, paddingBottom: 12}}>
          {idLeng == 0 && (
            <RenderHtml
              source={{
                html: `${item.content_en}`,
              }}
              contentWidth={width}
            />
          )}

          {idLeng == 1 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
                contentWidth={width}
              />
              <RenderHtml
                source={{
                  html: `${item.content_vi}`,
                }}
                contentWidth={width}
              />
            </View>
          )}
          {idLeng == 2 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
                contentWidth={width}
              />
              <RenderHtml
                source={{
                  html: `${item.content_cn}`,
                }}
                contentWidth={width}
              />
            </View>
          )}
          {idLeng == 3 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
                contentWidth={width}
              />
              <RenderHtml
                source={{
                  html: `${item.content_ja}`,
                }}
                contentWidth={width}
              />
            </View>
          )}
          {idLeng == 4 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
                contentWidth={width}
              />
              <RenderHtml
                source={{
                  html: `${item.content_kr}`,
                }}
                contentWidth={width}
              />
            </View>
          )}
          <View style={{marginTop: 12}}>{renderAns(item, index)}</View>
          <View>{renderAnswerQuestion(item, index)}</View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradientView>
      <Header
        title="Wrong Questions"
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
      <LoadingModal visible={loading} />
      <View
        style={{
          height: 48,
          width: fullWidth - 32,
          marginLeft: 16,
          backgroundColor: '#fff',
          borderRadius: 16,
          marginVertical: 12,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          alignItems: 'center',
        }}>
        <View>
          <Subtitles onSelect={onSelect} />
        </View>
        <View style={{flexDirection: 'row'}}>
          <TextNormal fontSize={16}>Number: </TextNormal>
          <TextNormal fontSize={16} style={{color: Colors.primaryMain}}>
            {dataQuestions.length}
          </TextNormal>
        </View>
      </View>

      <View
        style={{
          backgroundColor: Colors.backgroundGray,
          flex: 1,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
        <FlatList
          data={dataQuestions}
          renderItem={({item, index}) => renderItem(item, index)}
          initialNumToRender={10}
          keyExtractor={(item, index) => item?.id}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          ListHeaderComponent={() => {
            return <View style={{width: '100%', height: 20}}></View>;
          }}
          ItemSeparatorComponent={() => {
            return (
              <View style={{width: '100%', height: spacing.mainSpacing}} />
            );
          }}
          ListFooterComponent={() => {
            return <View style={{width: '100%', height: 100}}></View>;
          }}
          removeClippedSubviews
        />
        {dataQuestions.length > 0 ? (
          <TouchableOpacity
            style={{position: 'absolute', bottom: moderateScale(22), left: 16}}
            onPress={() =>
              navigation.navigate('WrongSetup', {dataWrong: dataQuestions})
            }>
            <LinearGradient
              colors={['#00C2FF', '#0F90EB']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={{
                height: 44,
                width: fullWidth - 32,
                borderRadius: 333,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextNormal
                fontSize={14}
                style={{
                  color: '#fff',

                  fontWeight: '600',
                }}>
                Practice
              </TextNormal>
            </LinearGradient>
          </TouchableOpacity>
        ) : null}
      </View>
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

const tagsStyles4 = {
  p: {
    color: '#6D6B7A',
    paddingLeft: 2,
  },
};

const styles = StyleSheet.create({
  space: {
    width: '100%',
    marginBottom: moderateScale(-23),
  },
  viewAns: {
    width: '100%',
    marginBottom: moderateScale(-15),
  },
  txtAns: {
    color: Colors.mainText,
    fontWeight: '600',
    marginTop: moderateScale(-12),
    marginBottom: moderateScale(-8),
  },
  viewTextAnswer: {
    flexDirection: 'row',
  },
  textAnswer: {
    color: '#6D6B7A',
  },
});

export default WrongQuestions;
