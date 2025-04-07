import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
  StyleSheet,
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
  getFavorites,
  like,
  postRateQuiz,
  unlike,
} from '../../../services/api/api';
import RenderHtml from 'react-native-render-html';
import {moderateScale} from 'react-native-size-matters';
import Toast from 'react-native-toast-message';
import {likeQuestion, unlikeQuestion} from '../../../store/likedQuestionsSlice';
import {setPendingRating} from '../../../store/questions';
import ToastSimple from 'react-native-simple-toast';
import ModalRateQuiz from '../../../components/Modal/ModalRateQuiz';
import LoadingModal from '../../../components/Loading';
import {setLanguage} from '../../../store/user';
import TextNormal from '../../../components/Text';
import {useQuery, useRealm} from '@realm/react';
import Topic from '@/model/topic';
import Favorite from '@/model/favorite';

const FavoriteQuestions = ({route, navigation}: any) => {
  const idLeng = useSelector((state: RootState) => state.user.language);
  const realm = useRealm();
  const {width} = useWindowDimensions();
  const listFavoriteQuestion = useQuery(Favorite);
  const [dataQuestions, setDataQuestions] = useState<any[]>([]);
  const [rating, setRate] = useState<number>(1);
  const [value, setValue] = useState('');
  const [showRate, setShowRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const dispatch = useDispatch();
  const getQuesFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavorites();
      setDataQuestions(res.res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && isAuthenticated) {
      getQuesFavorites();
    } else {
      getDataFavoriteLocal();
    }
  }, []);

  const getDataFavoriteLocal = () => {
    const listP: any[] = [];
    listFavoriteQuestion.map(data => {
      dataTopics.map(item => {
        item.data_level.map(level => {
          let question = level.random_questions.find(rq => data.id === rq.id);
          if (question) listP.push(question);
        });
      });
    });
    setDataQuestions(listP);
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

  const renderAnswerQuestion = (itemAns, index) => {
    return (
      <FlatList
        data={token ? itemAns.answers_random : itemAns.answers_random}
        renderItem={({item, index}) => renderItemAnsQuestion(item, index)}
        ItemSeparatorComponent={() => {
          return <View style={{width: '100%', height: 8}} />;
        }}
      />
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

          {/* <View style={{marginTop: 12}}>{renderAns(item, index)}</View> */}
          <View>{renderAnswerQuestion(item, index)}</View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradientView>
      <Header
        title="Favorite Questions"
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
        />
        {dataQuestions.length > 0 ? (
          <TouchableOpacity
            style={{position: 'absolute', bottom: moderateScale(22), left: 16}}
            onPress={() =>
              navigation.navigate('FavoriteSetup', {
                dataFavorite: dataQuestions,
              })
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
});

export default FavoriteQuestions;
