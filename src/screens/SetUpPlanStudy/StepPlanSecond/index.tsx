import {View, TouchableOpacity, Image, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import ButtonNext from '../../../components/Button/ButtonNext';
import HeaderBackSkip from '../../../components/HeaderBackSkip';
import Icons from '../../../components/Icon';
import TimePicker from '../../../components/Modal/ModalTimeInDate';
import DropDownMinutes from '../../../components/DropDownPicker/DropDownMinutes/item';
import moment from 'moment';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../../components/Text';

type ItemProps = {
  route: any;
  navigation: any;
};

const StepPlanSecond: React.FC<ItemProps> = ({route, navigation}) => {
  const {goBack} = useNavigation();
  const [showPicker, setShowPicker] = useState(false);
  const defaultTime = new Date();
  const [selectedTime, setSelectedTime] = useState<Date | null>(defaultTime);
  const [selectedValue, setSelectedValue] = useState('30');
  const day_in_week = route.params?.selectedItems;
  const {width, height} = Dimensions.get('window');

  const minutes = [];
  for (let i = 10; i <= 120; i += 10) {
    minutes.push({label: i, value: i});
  }

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
  };

  const showTimePicker = () => {
    setShowPicker(true);
  };

  const formatTime = (date: Date | null) => {
    if (date) {
      return moment(date).format('hh:mm A');
    } else {
      return 'HH:MM';
    }
  };

  const handleConfirm = (date: Date) => {
    setShowPicker(false);
    setSelectedTime(date);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  const naviStepPlanThree = () => {
    const time_in_date = moment(selectedTime).format('hh:mm');
    navigation.navigate('StepPlanThree', {
      day_in_week,
      selectedValue,
      time_in_date,
    });
  };

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
        onPressSkip={naviStepPlanThree}
        progress={3}
      />
      <View style={styles.viewContent}>
        <TextNormal fontSize={14} style={styles.txtNumberStep}>
          {'Step 2/3'}
        </TextNormal>
        <TextNormal fontSize={18} style={styles.txtContentIntro}>
          {'Select time for practicing'}
        </TextNormal>
        <Image
          source={require('../../../assets/images/img_clock.png')}
          style={[
            styles.img,
            {
              width: width * 0.8,
              height: height * 0.4,
              resizeMode: 'contain',
            },
          ]}
        />

        <View style={styles.viewTimeInDate}>
          <TextNormal fontSize={14} style={styles.nonTextDay}>
            {'Time in date'}
          </TextNormal>
          <View style={styles.viewBoxTime}>
            <TouchableOpacity style={styles.btnHH_MM} onPress={showTimePicker}>
              <TextNormal fontSize={14} style={styles.txtHH_MM}>
                {formatTime(selectedTime)}
              </TextNormal>
              <Icons
                icon={require('../../../assets/images/ic_clock.png')}
                size={moderateScale(24)}
              />
            </TouchableOpacity>

            <TimePicker
              visible={showPicker}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />

            <DropDownMinutes
              value={selectedValue}
              items={minutes}
              onChange={handleValueChange}
            />

            <TextNormal fontSize={14} style={styles.txtHH_MM}>
              {'Mins/day'}
            </TextNormal>
          </View>
        </View>
      </View>
      <ButtonNext onPressNext={naviStepPlanThree} text="Next" />
    </SafeAreaView>
  );
};

export default StepPlanSecond;
