import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import {Colors, fullWidth, shadow, spacing} from '../../theme';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from '../../utils/icon';
import RenderHtml from 'react-native-render-html';
import {useDispatch, useSelector} from 'react-redux';
import HeaderSub from '../../components/Header/HeaderSub';
import {RootState} from '../../store';
import {like, postRateQuiz, unlike} from '../../services/api/api';
import Toast from 'react-native-toast-message';
import {likeQuestion, unlikeQuestion} from '../../store/likedQuestionsSlice';
import ToastSimple from 'react-native-simple-toast';
import {setPendingRating} from '../../store/questions';
import ModalRateQuiz from '../../components/Modal/ModalRateQuiz';
import TextNormal from '@/components/Text';
import {useQuery, useRealm} from '@realm/react';
import Favorite from '@/model/favorite';
import {moderateScale} from 'react-native-size-matters';

const Detail = ({route, navigation}: any) => {
  const {dataQuestions, title} = route.params;
  const {width} = useWindowDimensions();
  const realm = useRealm();
  const listFavoriteQuestion = useQuery(Favorite);
  const idLeng = useSelector((state: RootState) => state.user.language);
  const [rating, setRate] = useState<number>(1);
  const [value, setValue] = useState('');
  const [showRate, setShowRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  const [indexShow, setIndexshow] = useState(
    dataQuestions.map(item => ({check: false})),
  );
  const dispatch = useDispatch();
  const showAnser = index => {
    let list = [...indexShow];
    list[index].check = !list[index].check;
    // setShow(!show);
    setIndexshow(list);
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

  const renderItemUserAns = (item, itemAns) => {
    if (item.id == itemAns.user_answers && item.is_true == 1) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Icon.icCheckTrue} style={{width: 20, height: 20}} />
          {idLeng == 0 && (
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles1}
            />
          )}
          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
                tagsStyles={tagsStyles1}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
                tagsStyles={tagsStyles1}
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
                tagsStyles={tagsStyles1}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
                tagsStyles={tagsStyles1}
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
                tagsStyles={tagsStyles1}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
                tagsStyles={tagsStyles1}
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
                tagsStyles={tagsStyles1}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
                tagsStyles={tagsStyles1}
              />
            </View>
          )}
        </View>
      );
    }
    if (item.id == itemAns.user_answers && item.is_true == 0) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Icon.icDelete} style={{width: 20, height: 20}} />
          {idLeng == 0 && (
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles2}
            />
          )}
          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
                tagsStyles={tagsStyles2}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
                tagsStyles={tagsStyles2}
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
                tagsStyles={tagsStyles2}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
                tagsStyles={tagsStyles2}
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
                tagsStyles={tagsStyles2}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
                tagsStyles={tagsStyles2}
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
                tagsStyles={tagsStyles2}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
                tagsStyles={tagsStyles2}
              />
            </View>
          )}
        </View>
      );
    }
    if (item.id != itemAns.user_answers && item.is_true == 1) {
      return (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={Icon.icCheckTrue} style={{width: 20, height: 20}} />
          {idLeng == 0 && (
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles3}
            />
          )}
          {idLeng == 1 && (
            <View>
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_en}`,
                }}
                tagsStyles={tagsStyles3}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_vi}`,
                }}
                tagsStyles={tagsStyles3}
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
                tagsStyles={tagsStyles3}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_cn}`,
                }}
                tagsStyles={tagsStyles3}
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
                tagsStyles={tagsStyles3}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_ja}`,
                }}
                tagsStyles={tagsStyles3}
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
                tagsStyles={tagsStyles3}
              />
              <View
                style={{
                  width: '100%',
                  marginBottom: moderateScale(-16),
                }}
              />
              <RenderHtml
                contentWidth={width}
                source={{
                  html: `${item.answer_kr}`,
                }}
                tagsStyles={tagsStyles3}
              />
            </View>
          )}
        </View>
      );
    }
    return (
      <View style={{}}>
        {idLeng == 0 && (
          <RenderHtml
            contentWidth={width}
            source={{
              html: `${item.answer_en}`,
            }}
            tagsStyles={tagsStyles4}
          />
        )}
        {idLeng == 1 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_vi}`,
              }}
              tagsStyles={tagsStyles4}
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
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_cn}`,
              }}
              tagsStyles={tagsStyles4}
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
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_ja}`,
              }}
              tagsStyles={tagsStyles4}
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
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_kr}`,
              }}
              tagsStyles={tagsStyles4}
            />
          </View>
        )}
      </View>
    );
  };

  const renderItemAns = (item, itemAns) => {
    return (
      <View style={{}}>
        {/* <RenderHtml
          contentWidth={width}
          source={{
            html: `${item.answer_en}`,
          }}
          tagsStyles={tagsStyles4}
        /> */}
        {idLeng == 0 && (
          <RenderHtml
            contentWidth={width}
            source={{
              html: `${item.answer_en}`,
            }}
            tagsStyles={tagsStyles4}
          />
        )}
        {idLeng == 1 && (
          <View>
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_en}`,
              }}
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_vi}`,
              }}
              tagsStyles={tagsStyles4}
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
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_cn}`,
              }}
              tagsStyles={tagsStyles4}
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
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_ja}`,
              }}
              tagsStyles={tagsStyles4}
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
              tagsStyles={tagsStyles4}
            />
            <View
              style={{
                width: '100%',
                marginBottom: moderateScale(-16),
              }}
            />
            <RenderHtml
              contentWidth={width}
              source={{
                html: `${item.answer_kr}`,
              }}
              tagsStyles={tagsStyles4}
            />
          </View>
        )}
      </View>
    );
  };

  const renderAns = (itemAns, index) => {
    if (!itemAns.user_answers || itemAns.user_answers === -1) {
      return (
        <FlatList
          data={itemAns.answers_random}
          renderItem={({item, index}) => renderItemAns(item, itemAns)}
          ItemSeparatorComponent={() => {
            return <View style={{width: '100%', height: 8}} />;
          }}
        />
      );
    }
    return (
      <FlatList
        data={itemAns.answers_random}
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
          {item.critical_sentence && item.critical_sentence == 1 ? (
            <View
              style={{
                height: 24,
                width: 40,
                backgroundColor: '#FFD265',
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
          ) : (
            <View
              style={{
                height: 24,
                width: 40,
                backgroundColor: Colors.primaryMain,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 16,
                borderBottomRightRadius: 16,
                flexDirection: 'row',
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
          )}
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
          <View style={{marginTop: 12}}>{renderAns(item, index)}</View>
          <View>
            {indexShow[index].check && (
              <View style={{marginTop: 12}}>
                <TextNormal
                  fontSize={16}
                  style={{
                    fontWeight: '400',
                    color: '#6D6B7A',
                    marginBottom: 8,
                  }}>
                  <TextNormal
                    fontSize={16}
                    style={{color: Colors.mainText, fontWeight: '600'}}>
                    Explanation:
                  </TextNormal>
                </TextNormal>
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
                    <View
                      style={{
                        width: '100%',
                        marginBottom: moderateScale(12),
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
                    <View
                      style={{
                        width: '100%',
                        marginBottom: moderateScale(12),
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
                    <View
                      style={{
                        width: '100%',
                        marginBottom: moderateScale(12),
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
                    <View
                      style={{
                        width: '100%',
                        marginBottom: moderateScale(12),
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
            )}

            <TouchableOpacity
              onPress={() => showAnser(index)}
              style={{marginTop: 12}}>
              <LinearGradient
                colors={['#00C2FF', '#0F90EB']}
                start={{x: 1, y: 0}}
                end={{x: 0, y: 0}}
                style={{
                  height: 40,
                  width: fullWidth - 64,
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
                  {indexShow[index].check
                    ? 'Hide Explanation'
                    : 'Show Explanation'}
                </TextNormal>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradientView>
      <HeaderSub
        title={title}
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
      <View
        style={{
          backgroundColor: Colors.backgroundGray,
          flex: 1,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}>
        <FlatList
          style={{width: '100%', paddingTop: 20}}
          data={dataQuestions}
          contentContainerStyle={{alignItems: 'center'}}
          renderItem={({item, index}) => renderItem(item, index)}
          ItemSeparatorComponent={() => {
            return (
              <View style={{width: '100%', height: spacing.mainSpacing}} />
            );
          }}
          ListFooterComponent={() => {
            return <View style={{width: '100%', height: 50}}></View>;
          }}
        />
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

const tagsStyles1 = {
  p: {
    color: '#34C759',
    marginLeft: 4,
  },
};

const tagsStyles2 = {
  p: {
    color: '#F5574E',
    marginLeft: 4,
  },
};

const tagsStyles3 = {
  p: {
    color: '#34C759',
    marginLeft: 4,
  },
};

const tagsStyles4 = {
  p: {
    color: '#6D6B7A',
    marginLeft: 24,
  },
};

export default Detail;
