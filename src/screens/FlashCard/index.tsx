import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, fullWidth, shadow, spacing} from '../../theme';
import {Icon} from '../../utils/icon';
import Subtitles from '../../components/Subtitles';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {setLanguage} from '../../store/user';
import RenderHtml from 'react-native-render-html';
import ModalConfirmApp from '../../components/Modal/Modal';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';

const FlashCard = ({route, navigation}: any) => {
  const {itemLevel, title} = route.params;
  const {width} = useWindowDimensions();

  const idLeng = useSelector((state: RootState) => state.user.language);

  const [show, setShow] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [indexQues, setIndexQus] = useState(-1);

  const dispatch = useDispatch();

  const flatlistRef = useRef();

  const scrollToIndex = (index: number) => {
    flatlistRef?.current?.scrollToIndex({
      animated: true,
      index: index,
    });
  };

  const onPreQues = (item, index) => {
    setShow(false);
    if (index - 1 < 0) return;
    scrollToIndex(index - 1);
  };

  const onNextQues = (item, index) => {
    setShow(false);
    if (index == itemLevel.questions_flash.length - 1) {
      setShowModal(true);
      return;
    }
    scrollToIndex(index + 1);
  };

  const showAnser = index => {
    setShow(!show);
    setIndexQus(index);
  };

  const onSelect = (selectedItem, indexDrop) => {
    dispatch(setLanguage(indexDrop));
  };

  const onSubmit = () => {
    navigation.navigate('Questions', {itemLevel: itemLevel, title: title});
    setShowModal(false);
  };

  const renderAns = item => {
    return (
      <>
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
      </>
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
          nestedScrollEnabled>
          <View style={styles.wrapQues}>
            <View
              style={{
                flexDirection: 'row',
                height: 24,
                width: '100%',
                justifyContent: 'space-between',
              }}>
              <Subtitles onSelect={onSelect} />
              <View>
                <TextNormal
                  fontSize={14}
                  style={{
                    fontWeight: '600',
                    color: Colors.primaryMain,
                  }}>
                  {index + 1}/{itemLevel.questions_flash.length}
                </TextNormal>
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
          <View style={styles.wrapAns}>
            {show && indexQues == index && (
              <>
                <TextNormal fontSize={14} style={{fontWeight: '600'}}>
                  Answer
                </TextNormal>
                {/* <TextNormal fontSize={} style={{ fontWeight: "400", marginTop: 8, marginBottom: 12 }}>{item.flash_card_answers[0].answer_en}    </TextNormal> */}

                <FlatList
                  data={item.flash_card_answers}
                  contentContainerStyle={{
                    alignItems: 'flex-start',
                  }}
                  renderItem={({item, index}) => renderAns(item)}
                />
              </>
            )}
            <TouchableOpacity onPress={() => showAnser(index)}>
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
                  {show && indexQues == index ? 'Hide Answer' : 'Show Answer'}
                </TextNormal>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{width: '100%', height: 125}}></View>
        </ScrollView>
        {/* , paddingBottom: 15 */}
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
              style={[
                styles.wrapPre,
                {backgroundColor: '#D8D6DD', borderRadius: 1000},
              ]}>
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
        <TouchableOpacity onPress={() => onNextQues(item, index)}>
          {index == itemLevel.questions_flash.length - 1 ? (
            <LinearGradient
              colors={['#00C2FF', '#0F90EB']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={styles.wrapPre}>
              <TextNormal fontSize={16} style={{color: '#fff'}}>
                Questions
              </TextNormal>
            </LinearGradient>
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
      <Header
        title={title + ' FlashCard'}
        showBtnRight={true}
        onBtnRight={() => {}}
        goBack={() => navigation.goBack()}
      />
      <View style={styles.wrapList}>
        <FlatList
          style={{marginTop: 16}}
          data={itemLevel.questions_flash}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => renderItem(item, index)}
          horizontal
          ref={flatlistRef}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <ModalConfirmApp
        onClose={() => setShowModal(false)}
        onSubmit={onSubmit}
        title="Would you like to practice questions?"
        modalVisible={showModal}
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
    width: (fullWidth - 80) * 0.5,
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
    borderRadius: 16,
    marginHorizontal: 4,
    marginBottom: 10,
  },
});

export default FlashCard;
