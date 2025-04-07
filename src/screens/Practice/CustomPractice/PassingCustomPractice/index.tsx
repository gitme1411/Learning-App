import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
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

const PassingCustomPractice = ({route, navigation}: any) => {
  const {dataQuestions, itemTest, title} = route.params;
  const [modalRateQuiz, setRateQuiz] = useState(false);

  const {width, height} = Dimensions.get('window');

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
            value={itemTest.percentPass}
            interval={15}
            countBy={1}
            style={[
              styles.stylesNumberLoad,
              itemTest.is_passed ? {color: '#2CC86F'} : {color: 'red'},
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
              itemTest.is_passed ? {color: '#2CC86F'} : {color: 'red'},
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
              navigation.goBack();
              navigation.goBack();
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
        {/* {valueEllip >= 80 && test ? (
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
          {valueEllip >= 80 && test
            ? ' Congratulations, you have passed \n the practice'
            : "You haven't passed the practice yet. \nTry harder!"}
        </TextNormal> */}
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
            <TextNormal fontSize={20} style={styles.txtNumberPass}>
              {itemTest.numberPass}/{dataQuestions.length}
            </TextNormal>
            <TextNormal fontSize={14} style={styles.txtRightAnswer}>
              {'RightAnswer'}
            </TextNormal>
            <Icons icon={Icon.icCircleArrow} size={moderateScale(24)} />
          </TouchableOpacity>
        </View>
        <View style={styles.viewButtonBottom}>
          {itemTest.is_passed ? (
            <ButtonLinearProps
              label="Try another"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.goBack();
                navigation.goBack();
              }}
            />
          ) : (
            <ButtonLinearProps
              label="Try another"
              styleButton={styles.btnTryAgain}
              styleText={styles.txtColorBlack}
              fontSize={14}
              onPress={() => {
                navigation.goBack();
                navigation.goBack();
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

export default PassingCustomPractice;
