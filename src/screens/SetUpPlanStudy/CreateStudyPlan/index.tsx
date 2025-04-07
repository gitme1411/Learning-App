import {View, Image, Dimensions} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import ButtonNext from '../../../components/Button/ButtonNext';
import HeaderBackSkip from '../../../components/HeaderBackSkip';
import AnimateNumber from 'react-native-animate-number';
import ToastSimple from 'react-native-simple-toast';
import TextNormal from '../../../components/Text';

const CreateStudyPlan = ({navigation}: any) => {
  const {navigate, goBack} = useNavigation();
  const {width, height} = Dimensions.get('window');

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackSkip
        text={'Skip'}
        hideButton={false}
        stylesText={styles.stylesButtonSkip}
        fontSize={14}
        onPress={() => {
          goBack();
        }}
        onPressSkip={() => {
          navigation.navigate('ChartStudyPlanScreen');
        }}
        progress={4.7}
      />
      <View style={styles.viewContent}>
        <TextNormal fontSize={18} style={styles.txtContentIntro}>
          {'Creating your personal study plan'}
        </TextNormal>
        <TextNormal fontSize={16} style={styles.txtNumberStep}>
          {'The key to pass is practice'}
        </TextNormal>
        <View style={styles.viewContentCreating}>
          <Image
            source={require('../../../assets/images/img_pie-chart.png')}
            style={{
              width: width * 0.8,
              height: height * 0.4,
              resizeMode: 'contain',
            }}
          />
          <View style={styles.viewAnimateNumber}>
            <AnimateNumber
              value={100}
              interval={15}
              countBy={1}
              style={styles.stylesNumberLoad}
              onFinish={() => {
                ToastSimple.showWithGravity(
                  // 'Study plan setting successfully.',
                  'Successfully setting a study plan',
                  ToastSimple.LONG,
                  ToastSimple.BOTTOM,
                );
                navigation.navigate('ChartStudyPlanScreen');
              }}
              formatter={(val: any) => {
                return parseInt(val) + '%';
              }}
            />
            <TextNormal fontSize={14} style={styles.txtLoading}>
              Loading
            </TextNormal>
          </View>
        </View>
      </View>
      <ButtonNext
        onPressNext={() => {
          // navigation.navigate('ChartStudyPlanScreen');
        }}
        text="Processing..."
      />
    </SafeAreaView>
  );
};

export default CreateStudyPlan;
