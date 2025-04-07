import {FlatList, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '../../../components/LinerGradient';
import Header from '../../../components/Header';
import {Colors, fullWidth, shadow, spacing} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import Subtitles from '../../../components/Subtitles';
import {getWeak} from '../../../services/api/api';
import RenderHtml from 'react-native-render-html';
import {moderateScale} from 'react-native-size-matters';
import {setLanguage} from '../../../store/user';
import TextNormal from '../../../components/Text';

const WeakQuestions = ({route, navigation}: any) => {
  // const { dataQuestions } = route.params;
  // const dataQuestions = useSelector((state: RootState) => state.quesStatis.dataFavorite)
  const idLeng = useSelector((state: RootState) => state.user.language);

  const [dataQuestions, setDataQuestions] = useState([]);

  const getQuesWeak = async () => {
    const res = await getWeak();
    setDataQuestions(res.res);
  };

  useEffect(() => {
    getQuesWeak();
  }, []);

  const [show, setShow] = useState(false);

  const showAnser = () => {
    setShow(!show);
  };

  const dispatch = useDispatch();

  const onSelect = (selectedItem, indexDrop) => {
    // setIdLeng(indexDrop)
    dispatch(setLanguage(indexDrop));
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
          />
        )}
        {idLeng == 1 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              source={{
                html: `${item.answer_vi}`,
              }}
            />
          </View>
        )}
        {idLeng == 2 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              source={{
                html: `${item.answer_cn}`,
              }}
            />
          </View>
        )}
        {idLeng == 3 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              source={{
                html: `${item.answer_ja}`,
              }}
            />
          </View>
        )}
        {idLeng == 4 && (
          <View>
            <RenderHtml
              source={{
                html: `${item.answer_en}`,
              }}
            />
            <RenderHtml
              source={{
                html: `${item.answer_kr}`,
              }}
            />
          </View>
        )}
      </View>
    );
  };

  // const renderItemAns = (item, itemAns) => {
  //     return (
  //         <View style={{}}>
  //             <Image />
  //             <TextNormal fontSize={} style={{ fontWeight: "400", color: "#6D6B7A", marginLeft: 24 }}>{item.answer_en}    </TextNormal>
  //         </View>
  //     )
  // }

  const renderAns = (itemAns, index) => {
    // if (itemAns.user_answer == -1) {
    //     return (
    //         <FlatList
    //             data={itemAns.answers_random}
    //             renderItem={({ item, index }) => renderItemAns(item, itemAns)}
    //             ItemSeparatorComponent={() => {
    //                 return (
    //                     <View style={{ width: "100%", height: 8 }} />
    //                 )
    //             }}
    //         />
    //     )
    // }
    return (
      <FlatList
        data={itemAns.answers}
        renderItem={({item, index}) => renderItemUserAns(item, itemAns)}
        // ItemSeparatorComponent={() => {
        //     return (
        //         <View style={{ width: "100%", height: 8 }} />
        //     )
        // }}
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
        <View style={{height: 24, width: '100%', flexDirection: 'row'}}>
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
                fontSize: moderateScale(14),
                color: '#fff',
              }}>
              {index + 1}
            </TextNormal>
          </View>
        </View>
        <View style={{paddingHorizontal: 16, marginTop: 8, paddingBottom: 12}}>
          {idLeng == 0 && (
            <RenderHtml
              source={{
                html: `${item.content_en}`,
              }}
            />
          )}

          {idLeng == 1 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
              />
              <RenderHtml
                source={{
                  html: `${item.content_vi}`,
                }}
              />
            </View>
          )}
          {idLeng == 2 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
              />
              <RenderHtml
                source={{
                  html: `${item.content_cn}`,
                }}
              />
            </View>
          )}
          {idLeng == 3 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
              />
              <RenderHtml
                source={{
                  html: `${item.content_ja}`,
                }}
              />
            </View>
          )}
          {idLeng == 4 && (
            <View>
              <RenderHtml
                source={{
                  html: `${item.content_en}`,
                }}
              />
              <RenderHtml
                source={{
                  html: `${item.content_kr}`,
                }}
              />
            </View>
          )}
          <View style={{marginTop: 12}}>{renderAns(item, index)}</View>
          {/* <View>
                        {show && <View style={{ marginTop: 12 }}>
                            <TextNormal fontSize={} style={{ fontWeight: "400", color: "#6D6B7A" }}><TextNormal fontSize={} style={{ color: Colors.mainText, fontWeight: "600" }}>Explanation:    </TextNormal> It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or    </TextNormal>
                        </View>}

                        <TouchableOpacity onPress={showAnser} style={{ marginTop: 12 }}>
                            <LinearGradient colors={['#00C2FF', '#0F90EB']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={{ height: 40, width: fullWidth - 64, borderRadius: 333, justifyContent: "center", alignItems: "center" }}>
                                <TextNormal fontSize={} style={{ color: "#fff", fontSize: moderateScale(14), fontWeight: "600" }}>{show ? "Hide Answer" : "Show Answer"}    </TextNormal>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> */}
        </View>
      </View>
    );
  };

  return (
    <LinearGradientView>
      <Header
        title="Favorites Questions"
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
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
          padding: spacing.mainSpacing,
        }}>
        <FlatList
          data={dataQuestions}
          renderItem={({item, index}) => renderItem(item, index)}
          ItemSeparatorComponent={() => {
            return (
              <View style={{width: '100%', height: spacing.mainSpacing}} />
            );
          }}
          ListFooterComponent={() => {
            return <View style={{width: '100%', height: 60}}></View>;
          }}
        />
        <TouchableOpacity
          style={{position: 'absolute', bottom: 24, left: 16}}
          onPress={() => navigation.navigate('FavoriteSetup')}>
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
                fontSize: moderateScale(14),
                fontWeight: '600',
              }}>
              Practice
            </TextNormal>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View></View>
    </LinearGradientView>
  );
};

export default WeakQuestions;
