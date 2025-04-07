import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '../../../../components/LinerGradient';
import ButtonIcon from '../../../../components/Button/ButtonIcon';
import {Icon} from '../../../../utils/icon';
import {styles} from './styles';
import AnimateNumber from 'react-native-animate-number';
import ButtonLinearProps from '../../../../components/Button/ButtonLinearProps';
import Icons from '../../../../components/Icon';
import ModalRateQuiz from '../../../../components/Modal/ModalRateQuiz';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../../../components/Text';

const WrongResult = ({route, navigation}: any) => {
  const {dataQuestions, dataWrong} = route.params;

  // const valueEllip = 80;
  const [modalRateQuiz, setRateQuiz] = useState(false);
  const [valueEllip, setValueEllip] = useState(0);
  const [correct, setCorrect] = useState(0);

  const [test, setTest] = useState(true);

  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    let correct = 0;
    let dataQuesFalse = dataQuestions.map(e => {
      let isCorrect = false;
      let id = e.user_answers;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            isCorrect = true;
          }
        }
      });
      if (isCorrect) {
        return;
      } else {
        return e;
      }
    });

    dataQuesFalse.map(e => {
      if (e) {
        if (e.critical_sentence == 1) {
          setTest(false);
        }
      }
    });

    dataQuestions.map(e => {
      let id = e.user_answers;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = correct + 1;
          }
        }
      });
    });
    setCorrect(correct);
    let result = Math.round((correct / dataQuestions.length) * 100);
    setValueEllip(result);
  }, []);

  const _renderPassing = () => {
    return (
      <View style={styles.viewImageScore}>
        <Image
          source={require('../../../../assets/images/img-group-chart.png')}
          style={[
            styles.img,
            {
              width: width * 0.8,
              height: height * 0.4,
              resizeMode: 'contain',
            },
          ]}
        />
        <View style={styles.viewAnimateNumber}>
          <AnimateNumber
            value={valueEllip}
            interval={15}
            countBy={1}
            style={[
              styles.stylesNumberLoad,
              valueEllip >= 80 ? {color: '#2CC86F'} : {color: 'red'},
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
              valueEllip >= 80 ? {color: '#2CC86F'} : {color: 'red'},
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
        <ButtonIcon
          icon={Icon.icClose}
          title=""
          onPress={() => {
            navigation.navigate('WrongSetup', {dataWrong: dataWrong});
          }}
          style={styles.btnClose}
        />
        {/* {valueEllip >= 80 && test ? (
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingBottom: 8,
                        }}>
                        <TextNormal fontSize={}
                            style={{
                                fontSize: 24,
                                fontWeight: '600',
                                textAlign: 'center',
                                color: '#2CC86F',
                                paddingHorizontal: 16,
                            }}>
                            Pass
                            </TextNormal>
                        <Image
                            source={Icon.icHappy}
                            style={{ width: 24, height: 24, tintColor: '#FFB400' }}
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
                        <TextNormal fontSize={}
                            style={{
                                fontSize: moderateScale(22),
                                fontWeight: '600',
                                textAlign: 'center',
                                color: '#F5574E',
                                paddingHorizontal: 16,
                            }}>
                            Fail
                            </TextNormal>
                        <Image
                            source={Icon.icConfuse}
                            style={{ width: 24, height: 24, tintColor: '#FFB400' }}
                        />
                    </View>
                )}
                <TextNormal fontSize={} style={styles.txtTitle}>
                    {valueEllip >= 80 && test
                        ? ' Congratulations, you have passed \n the Final Test'
                        : "You haven't passed the Final Test yet. \nTry harder!"}
                    </TextNormal> */}
        {_renderPassing()}
        <View style={styles.viewRightAnswer}>
          <TouchableOpacity
            style={styles.btnRightAnswer}
            onPress={() => {
              navigation.navigate('Detail', {dataQuestions: dataQuestions});
              // setRateQuiz(true);
            }}>
            <TextNormal fontSize={20} style={styles.txtNumberPass}>
              {correct}/{dataQuestions.length}
            </TextNormal>
            <TextNormal fontSize={14} style={styles.txtRightAnswer}>
              {'RightAnswer'}
            </TextNormal>
            <Icons icon={Icon.icCircleArrow} size={moderateScale(24)} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewButtonBottom}>
          {valueEllip >= 80 && test ? (
            <ButtonLinearProps
              label="Try another"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.navigate('WrongSetup', {dataWrong: dataWrong});
              }}
            />
          ) : (
            <ButtonLinearProps
              label="Try again"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.navigate('WrongSetup', {dataWrong: dataWrong});
              }}
            />
          )}

          {/* <ButtonLinearProps
                          label="Practice Flashcards"
                          styleButton={styles.btnTryAgain}
                          styleText={styles.txtColorBlack}
                          onPress={() => navigation.navigate("FlashCard", { itemLevel: itemLevel })}
                      /> */}
        </View>
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

export default WrongResult;
