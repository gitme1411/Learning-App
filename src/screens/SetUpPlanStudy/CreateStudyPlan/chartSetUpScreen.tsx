import React, {useEffect, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {styles} from './styles';
import HeaderBackSkip from '../../../components/HeaderBackSkip';
import ButtonNext from '../../../components/Button/ButtonNext';
import TimePicker from '../../../components/Modal/ModalTimeInDate';
import moment from 'moment';
import {addDays, format, eachDayOfInterval} from 'date-fns';
import ChartComponent from '../../../components/StudyPlan/ChartStudy';
import ReminderDetails from '../../../components/StudyPlan/ReminderDetails';
import {getTotalQuestionApp} from '../../../services/api/api';
import {setHasOnboarded} from '../../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setTotalQuestion} from '../../../store/stepPlan';

interface ChartStudyPlanScreenProps {
  navigation: any;
  route: any;
}

const ChartStudyPlanScreen: React.FC<ChartStudyPlanScreenProps> = ({
  navigation,
  route,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isShowCalender, setShowCalender] = useState(false);

  const dataStepPlan = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );
  const [totalQuestion, setTotal] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    const value = async () => {
      const getValue = await getTotalQuestionApp();
      setTotal(getValue?.res);
    };
    value();
  }, []);

  const startDate = new Date(dataStepPlan.start_date);
  const endDate = new Date(dataStepPlan.end_date);

  const generateDateRange = (start: Date, end: Date) => {
    const dates = eachDayOfInterval({start, end});
    const formattedDates = dates.reduce((acc: any, date: any) => {
      acc[format(date, 'yyyy-MM-dd')] = 0;
      return acc;
    }, {});
    return formattedDates;
  };

  const currentData = generateDateRange(startDate, endDate);
  const targetData = {...currentData};

  const numDays = Object.keys(targetData).length;
  const averageValue = Math.ceil(totalQuestion / numDays);

  for (let date in targetData) {
    targetData[date] = averageValue;
  }

  const showTimePicker = () => {
    setShowPicker(true);
  };

  const showCalender = () => {
    setShowCalender(true);
  };

  const formatTime = (date: Date | null) => {
    if (date) {
      return moment(date).format('hh:mm ');
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

  const handleNextOrSkip = async () => {
    // await AsyncStorage.setItem('hasOnboarded', 'MainTab');
    dispatch(setHasOnboarded('MainTab'));
    dispatch(setTotalQuestion(averageValue));
    navigation.navigate('MainTab');
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackSkip
        text={''}
        hideButton={false}
        stylesText={styles.stylesButtonSkip}
        fontSize={14}
        onPress={() => {
          navigation.goBack();
          navigation.goBack();
        }}
        onPressSkip={() => {}}
        progress={4.7}
      />
      <View style={styles.viewContent}>
        <ChartComponent
          current={currentData}
          target={targetData}
          textDate={
            format(startDate, 'd MMM yyyy') +
            ' - ' +
            format(endDate, 'd MMM yyyy')
          }
          showCalender={showCalender}
        />
        <ReminderDetails
          textReminder={
            selectedTime === null
              ? dataStepPlan?.time_in_date
              : formatTime(selectedTime)
          }
          minutes={dataStepPlan?.minutes}
          selectedTime={selectedTime}
          showTimePicker={showTimePicker}
          formatTime={formatTime}
          isShowIcon={false}
          question={averageValue}
        />
        <TimePicker
          visible={showPicker}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </View>
      <ButtonNext onPressNext={handleNextOrSkip} text="Next" />
    </SafeAreaView>
  );
};

export default ChartStudyPlanScreen;
