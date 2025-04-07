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
import {postRateQuiz, submitPractice} from '../../services/api/api';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {setDataWrong} from '@/store/quesStatis';
import {moderateScale} from 'react-native-size-matters';
import {setPendingRating} from '../../store/questions';
import ToastSimple from 'react-native-simple-toast';
import TextNormal from '../../components/Text';
import {useQuery, useRealm} from '@realm/react';
import WrongQuestion from '@/model/wrong_question';
const PassingPractice = ({route, navigation}: any) => {
  const {dataQuestions, itemPractice, save, checkCriticalSentence, title} =
    route.params;
  const dispatch = useDispatch();
  const realm = useRealm();
  const listWrongQuestion = useQuery(WrongQuestion);

  const [rating, setRate] = useState<number>(1);
  const [value, setValue] = useState('');
  const [showRate, setShowRate] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const {width, height} = Dimensions.get('window');

  useEffect(() => {
    if (save) {
      submit();
      if (!token) {
        saveWrongQues();
      }
    }
  }, []);

  const submit = async () => {
    let answer = dataQuestions.map(e => {
      return {
        question_id: e.id,
        answer_id: [e.user_answers],
      };
    });
    let dataAnswers = {
      test_id: dataQuestions[0].pivot.m_test_id,
      time: 1000,
      answer: answer,
    };
    if (token) {
      const data = await submitPractice(
        dataAnswers.test_id,
        dataAnswers.time,
        answer,
      );
    }
  };

  const saveWrongQues = () => {
    let data = dataQuestions.map(e => {
      let id = e.user_answers;
      let correct = false;
      e.answers_random.forEach(e => {
        if (e.is_true == 1) {
          if (e.id == id) {
            correct = true;
          }
        }
      });
      return {
        ques: e,
        correct: correct,
      };
    });
    realm.write(() => {
      data.map((e: any) => {
        let indexQuestion = listWrongQuestion.findIndex(
          (item: WrongQuestion) => item.id === e.ques.id,
        );
        if (!e.correct) {
          if (indexQuestion === -1) {
            // console.log('vao day');
            realm.create('WrongQuestion', {
              id: e.ques.id,
              ques: e.ques,
              correct: e.correct,
            });
          }
        } else {
          if (indexQuestion > -1) {
            realm.delete(listWrongQuestion[indexQuestion]);
          }
        }
      });
    });
    dispatch(setDataWrong(listWrongQuestion));
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
            value={itemPractice.percentPass}
            interval={15}
            countBy={1}
            style={[
              styles.stylesNumberLoad,
              itemPractice.is_passed ? {color: '#2CC86F'} : {color: 'red'},
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
              itemPractice.is_passed ? {color: '#2CC86F'} : {color: 'red'},
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
        <View
          style={{
            width: '100%',
            height: 40,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}>
          <ButtonIcon
            icon={Icon.icClose}
            title=""
            onPress={() => {
              navigation.navigate('Standard');
            }}
            style={styles.btnClose}
          />
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}>
            <TextNormal
              fontSize={18}
              numberOfLines={2}
              style={{
                textAlign: 'center',
                fontWeight: '600',
                color: '#ffffff',
              }}>
              {title}
            </TextNormal>
          </View>
          <View style={styles.btnClose} />
        </View>

        {itemPractice.is_passed ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 8,
            }}>
            <TextNormal
              fontSize={24}
              style={{
                fontWeight: '600',
                textAlign: 'center',
                color: '#2CC86F',
                paddingHorizontal: 16,
              }}>
              Pass
            </TextNormal>
            <Image
              source={Icon.icHappy}
              style={{width: 24, height: 24, tintColor: '#FFB400'}}
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
            <TextNormal
              fontSize={22}
              style={{
                fontWeight: '600',
                textAlign: 'center',
                color: '#F5574E',
                paddingHorizontal: 16,
              }}>
              Fail
            </TextNormal>
            <Image
              source={Icon.icConfuse}
              style={{width: 24, height: 24, tintColor: '#FFB400'}}
            />
          </View>
        )}
        <TextNormal fontSize={19} style={styles.txtTitle}>
          <TextNormal fontSize={19} style={styles.txtNumberPass}>
            {5 - checkCriticalSentence}/5
          </TextNormal>
          {' correct answers \nin Australian values  '}
          {checkCriticalSentence === 0 ? (
            <Image source={Icon.icCheckTrue} style={{width: 16, height: 16}} />
          ) : (
            <Image source={Icon.icDelete} style={{width: 16, height: 16}} />
          )}
        </TextNormal>
        <TextNormal fontSize={19} style={styles.txtTitle}>
          <TextNormal fontSize={19} style={styles.txtNumberPass}>
            {itemPractice.numberPass}/{dataQuestions.length}
          </TextNormal>
          {' correct answers in total  '}
          {itemPractice.is_passed ? (
            <Image source={Icon.icCheckTrue} style={{width: 16, height: 16}} />
          ) : (
            <Image source={Icon.icDelete} style={{width: 16, height: 16}} />
          )}
        </TextNormal>
        {_renderPassing()}
        <View style={styles.viewRightAnswer}>
          <TouchableOpacity
            style={styles.btnRightAnswer}
            onPress={() => {
              navigation.navigate('Detail', {
                dataQuestions: dataQuestions,
                title: title,
              });
              // setRateQuiz(true);
            }}>
            <TextNormal fontSize={20} style={styles.txtRightAnswer}>
              Detail Test
            </TextNormal>
            <View style={styles.viewIconButton}>
              <Icons icon={Icon.icCircleArrow} size={moderateScale(24)} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.viewButtonBottom}>
          {itemPractice.is_passed ? (
            <ButtonLinearProps
              label="Try another"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.navigate('Standard');
              }}
            />
          ) : (
            <ButtonLinearProps
              label="Try again"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.navigate('Standard');
                navigation.navigate('QuestionPractice', {
                  itemPractice: itemPractice,
                  reset: true,
                });
              }}
            />
          )}
          {/* <ButtonLinearProps
                        label="Try again"
                        styleButton={styles.btnTryAgain}
                        styleText={styles.txtColorBlack}
                        onPress={() => { navigation.navigate("Standard") }}
                    /> */}
          {/* <ButtonLinearProps
                        label="Practice Flashcards"
                        styleButton={styles.btnTryAgain}
                        styleText={styles.txtColorBlack}
                        onPress={() => navigation.navigate("FlashCard", { itemLevel: itemLevel })}
                    /> */}
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
      </SafeAreaView>
    </LinearGradientView>
  );
};

export default PassingPractice;
