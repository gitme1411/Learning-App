import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
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
import {submitCustomPractice, submitFinalTest} from '../../services/api/api';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';

const PassingTest = ({route, navigation}: any) => {
  const {dataQuestions, screen} = route.params;

  // const valueEllip = 80;
  const [modalRateQuiz, setRateQuiz] = useState(false);
  const [valueEllip, setValueEllip] = useState(0);
  const [correct, setCorrect] = useState(0);
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    if (screen == 'CustomPractice') {
      submitCusPractice();
    }
    if (screen == 'FinalTest') {
      submitTest();
    }
  }, []);

  const submitCusPractice = async () => {
    let answer = dataQuestions.map(e => {
      return {
        question_id: e.id,
        answer_id: [e.user_answer || -1],
      };
    });
    const data = await submitCustomPractice(12, 120, answer);
  };

  const submitTest = async () => {
    let answer = dataQuestions.map(e => {
      return {
        question_id: e.id,
        answer_id: [e.user_answer || -1],
      };
    });
    const data = await submitFinalTest(
      dataQuestions[0].pivot.m_test_id,
      120,
      answer,
    );
  };

  useEffect(() => {
    let correct = 0;
    dataQuestions.map(e => {
      let id = e.user_answer;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = correct + 1;
          }
        }
      });
    });
    setCorrect(correct);
    setValueEllip(Math.round((correct / dataQuestions.length) * 100));
  }, []);

  const _renderPassing = () => {
    return (
      <View style={styles.viewImageScore}>
        <Image
          source={require('../../assets/images/img-group-chart.png')}
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
              valueEllip >= 70 ? {color: '#2CC86F'} : {color: 'red'},
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
              valueEllip >= 70 ? {color: '#2CC86F'} : {color: 'red'},
            ]}>
            {'Your final score'}
          </TextNormal>
        </View>
      </View>
    );
  };

  const onClose = () => {
    if (screen == 'FinalTest') {
      navigation.navigate('FinalTest');
    }
    if (screen == 'WrongQues') {
      navigation.navigate('WrongQuestions');
    }
    if (screen == 'FavoriteQues') {
      navigation.navigate('FavoriteQuestions');
    }
    if (screen == 'CustomPractice') {
      navigation.navigate('SetupTest');
    }
  };

  const tryAnother = () => {
    if (screen == 'FinalTest') {
      navigation.navigate('FinalTest');
    }
    if (screen == 'WrongQues') {
      navigation.navigate('WrongSetup');
    }
    if (screen == 'FavoriteQues') {
      navigation.navigate('FavoriteSetup');
    }
    if (screen == 'CustomPractice') {
      navigation.navigate('SetupTest');
    }
  };
  return (
    <LinearGradientView>
      <SafeAreaView style={styles.container}>
        <ButtonIcon
          icon={Icon.icClose}
          title=""
          onPress={() => onClose()}
          style={styles.btnClose}
        />
        <TextNormal fontSize={19} style={styles.txtTitle}>
          {valueEllip >= 70
            ? ' Congratulations, you have passed \n the topic'
            : "You haven't passed the topic yet. \nTry harder!"}
        </TextNormal>
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
          <ButtonLinearProps
            label="Try another"
            styleButton={styles.btnTryAgain}
            styleText={styles.txtColorBlack}
            fontSize={14}
            onPress={() => tryAnother()}
          />
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

export default PassingTest;
