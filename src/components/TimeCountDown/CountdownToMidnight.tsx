// Imports
import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Alert, Modal, Button} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../../store';
import {
  decrementDay,
  setDaysCountDownt,
  setTotalQuestion,
  updateData,
} from '../../store/stepPlan';
import {moderateScale} from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarComponent from '../Calenders';
import {DateData} from 'react-native-calendars';
import {createStudyPlan, getTotalQuestionApp} from '@/services/api/api';
import ButtonCustom from '../Button/ButtonCustom';
import {Colors} from '@/theme';
import LoadingModal from '../Loading';
import TextNormal from '../Text';
import {eachDayOfInterval, format} from 'date-fns';
import {setDataStudyPlan} from '@/store/config';

type PropsTime = {
  isChangeDate?: boolean;
  setChangeDate?: any;
};

const CountdownToMidnight = ({isChangeDate, setChangeDate}: PropsTime) => {
  const dispatch = useDispatch();
  const daysCountDown = useSelector(
    (state: RootState) => state.createStepPlan.daysCountDownt,
  );
  const dataStepPlan = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan,
  );
  const [selectedDate, setSelectedDate] = useState(getCurrentDate(6));
  const [isModalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(getCurrentDate());

  useEffect(() => {
    if (isChangeDate != undefined) {
      setModalVisible(isChangeDate);
    }
    if (daysCountDown <= 0) setModalVisible(true);
  }, [daysCountDown, isChangeDate]);

  const [totalDays, setTotalDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const dataStepPlanLocal = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );

  function getCurrentDate(daysToAdd = 0): string {
    const today = new Date();
    today.setDate(today.getDate() + daysToAdd);
    return today.toISOString().split('T')[0];
  }

  useEffect(() => {
    const updateStartDateAtMidnight = () => {
      const now = new Date();
      const timeUntilMidnight =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() + 1,
        ).getTime() - now.getTime();
      setTimeout(() => {
        setStartDate(getCurrentDate());
        updateStartDateAtMidnight(); // Schedule the next update
      }, timeUntilMidnight);
    };
    updateStartDateAtMidnight();
  }, []);

  async function checkAndDecrementDays() {
    try {
      let date = new Date();
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      let dateEnd = new Date(dataStepPlanLocal.end_date);
      let count =
        dateEnd.getTime() - new Date(`${year}-${month}-${day}`).getTime();
      dispatch(setDaysCountDownt(Math.round(count / 86400000)));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleConfirmDate() {
    const param = {
      device_token: dataStepPlan?.param?.deviceToken || 'abc',
      time_in_date: dataStepPlan?.param?.time_in_date,
      minutes: dataStepPlan?.param?.minutes,
      day_in_week: dataStepPlan?.param?.day_in_week,
      start_date: dataStepPlan?.param?.start_date,
      end_date: selectedDate,
    };

    try {
      setLoading(true);
      const create = await createStudyPlan(
        param.device_token,
        param.time_in_date,
        param.minutes,
        param.day_in_week,
        param.start_date,
        param.end_date,
      );
      const getValue = await getTotalQuestionApp();

      if (create?.error === 0) {
        const totalQuestion = Math.ceil(getValue?.res / totalDays);
        const dates = eachDayOfInterval({
          start: param.start_date,
          end: param.end_date,
        });
        let data = dates.reduce((acc: any, date: any) => {
          acc[format(date, 'yyyy-MM-dd')] = 0;
          return acc;
        }, {});
        dispatch(setDataStudyPlan(data));
        dispatch(setDaysCountDownt(totalDays));
        dispatch(updateData({param}));
        dispatch(setTotalQuestion(totalQuestion));
        setModalVisible(false);
        setChangeDate(false);
      } else {
        Alert.alert('Update Failed!', 'Please try again');
        setModalVisible(false);
        setChangeDate(false);
      }
    } catch (error) {
      Alert.alert('Update Failed!', 'Please try again');
      setModalVisible(false);
      setChangeDate(false);
    } finally {
      setLoading(false);
    }
  }

  const onDayPress = (day: DateData) => {
    const selectedStartDate = new Date(startDate);
    setSelectedDate(day.dateString);
    const diffTime = Math.abs(
      new Date(day.dateString).getTime() - selectedStartDate.getTime(),
    );
    setTotalDays(Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  };

  const getMarkedDates = () => {
    const markedDates: {[key: string]: any} = {};

    if (startDate) {
      markedDates[startDate] = {
        startingDay: true,
        color: '#0F90EB',
        textColor: 'white',
      };

      if (selectedDate && selectedDate !== startDate) {
        markedDates[selectedDate] = {
          endingDay: true,
          color: '#0F90EB',
          textColor: 'white',
        };

        let currentDate = new Date(startDate);
        const end = new Date(selectedDate);

        while (currentDate <= end) {
          const dateString = currentDate.toISOString().split('T')[0];
          if (dateString !== startDate && dateString !== selectedDate) {
            markedDates[dateString] = {
              color: '#F0F0F4',
              textColor: 'black',
            };
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }

    return markedDates;
  };

  useEffect(() => {
    checkAndDecrementDays();
  }, []);

  useEffect(() => {
    if (startDate && selectedDate) {
      const start = new Date(startDate);
      const end = new Date(selectedDate);
      const daysDifference =
        Math.ceil(
          Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
        ) + 1;
      setTotalDays(daysDifference);
    }
  }, [startDate, selectedDate]);

  return (
    <View style={styles.container}>
      <Text
        style={styles.timeCountDown}>{`${daysCountDown} Day CountDown`}</Text>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <LoadingModal visible={loading} />
        <View style={styles.modalContainer}>
          <View style={styles.datePickerContainer}>
            <TextNormal fontSize={16} style={styles.modalTitle}>
              Select a date to enhance your learning journey over the next{' '}
              <TextNormal fontSize={16} style={styles.highlightedDays}>
                {totalDays} day{totalDays > 1 ? 's' : ''}
              </TextNormal>
              !
            </TextNormal>
            <CalendarComponent
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              style={styles.calendar}
            />
          </View>
          <ButtonCustom
            fontSize={16}
            onPressNext={handleConfirmDate}
            styleButton={styles.buttonConfirm}
            text="Confirm"
            styleText={styles.textConfirm}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeCountDown: {
    color: '#723000',
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonConfirm: {
    backgroundColor: Colors.white,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    height: moderateScale(40),
    borderRadius: 10,
    marginTop: 10,
  },
  textConfirm: {
    color: Colors.primaryMain,
    fontWeight: '500',
  },
  calendar: {
    borderRadius: 16,
    borderColor: 'gray',
    height: '42%',
    width: moderateScale(290),
    marginVertical: 16,
    paddingBottom: 30,
  },
  highlightedDays: {
    color: '#0F90EB',
  },
});

export default CountdownToMidnight;
