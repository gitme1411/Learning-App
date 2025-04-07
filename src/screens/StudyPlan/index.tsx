import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import HeaderWithSignUp from '../../components/Header/HeaderWithSignUp';
import LoadingModal from '../../components/Loading';
import {Icon} from '../../utils/icon';
import ReminderDetails from '../../components/StudyPlan/ReminderDetails';
import TimePicker from '../../components/Modal/ModalTimeInDate';
import moment from 'moment';
import {format} from 'date-fns';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import {getStudyPlan} from '../../services/api/api';
import ChartComponent from '../../components/StudyPlan/ChartStudy';
import {fullWidth} from '../../theme';
import {moderateScale} from 'react-native-size-matters';

interface StudyPlan {
  start_date: string;
  end_date: string;
  time_in_date_formated: string;
  minutes: number;
  total_question_per_day: number;
}

const StudyPlan = ({navigation, route}: any) => {
  let hasNotch = DeviceInfo.hasNotch();
  const [isShowSignUp, setModalSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isShowCalender, setShowCalender] = useState(false);
  const [dataStudyPlan, setData] = useState<StudyPlan>();
  const listStudyPlan = useSelector(
    (state: RootState) => state.config.dataStudyPlan,
  );
  const [dataChart, setDataChart] = useState<{
    current: any;
    target: any;
  } | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);
  const dataStepPlanLocal = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );
  const totalQuestion = useSelector(
    (state: RootState) => state.createStepPlan.totalQuestion,
  );

  const [targetData, setTargetData] = useState({...listStudyPlan});

  useEffect(() => {
    const updatedTargetData = {...listStudyPlan};
    for (let date in updatedTargetData) {
      updatedTargetData[date] = totalQuestion;
    }
    setTargetData(updatedTargetData);
  }, [totalQuestion, listStudyPlan]);

  useEffect(() => {
    const callApi = async () => {
      try {
        setLoading(true);
        const response = await getStudyPlan();
        setData(response?.res?.data);
        setDataChart(response?.res?.chart);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (token && isAuthenticated) {
      callApi();
    }
  }, [token, isAuthenticated]);

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
      return '00:00';
    }
  };

  const handleConfirm = (date: Date) => {
    setShowPicker(false);
    setSelectedTime(date);
  };

  const handleCancel = () => {
    setShowPicker(false);
  };

  return (
    <View style={{flex: 1}}>
      <LoadingModal visible={loading} />
      <Image
        source={Icon.imgBackGroudStudyPlan}
        style={styles.backgroundImage}
      />
      <View style={styles.overlay}>
        {hasNotch ? (
          <View
            style={{
              height: 36,
              width: '100%',
              paddingTop: moderateScale(30),
            }}
          />
        ) : (
          <View
            style={{
              height: 16,
              width: '100%',
              paddingTop: moderateScale(30),
            }}
          />
        )}
        <HeaderWithSignUp
          isShowSignUp={isShowSignUp}
          setModalSignUp={setModalSignUp}
        />
        <ScrollView
          style={{
            paddingHorizontal: 16,
            paddingTop: 12,
          }}
          contentContainerStyle={{alignItems: 'center'}}>
          <View
            style={{
              width: fullWidth - 48,
            }}>
            <ChartComponent
              // current={currentData}
              current={
                dataChart &&
                dataChart.current &&
                dataChart.target &&
                dataChart.current.length != 0
                  ? dataChart.current
                  : listStudyPlan
              }
              target={
                dataChart && dataChart.current && dataChart.target
                  ? dataChart.target
                  : targetData
              }
              textDate={
                format(
                  dataStudyPlan !== undefined
                    ? dataStudyPlan.start_date
                    : dataStepPlanLocal.start_date,
                  'd MMM yyyy',
                ) +
                ' - ' +
                format(
                  dataStudyPlan !== undefined
                    ? dataStudyPlan.end_date
                    : dataStepPlanLocal.end_date,
                  'd MMM yyyy',
                )
              }
              showCalender={showCalender}
            />

            <ReminderDetails
              textReminder={
                token && dataStudyPlan !== undefined
                  ? dataStudyPlan?.time_in_date_formated
                  : dataStepPlanLocal?.time_in_date
              }
              minutes={
                token && dataStudyPlan !== undefined
                  ? dataStudyPlan?.minutes
                  : dataStepPlanLocal?.minutes
              }
              question={
                token && dataStudyPlan !== undefined
                  ? dataStudyPlan?.total_question_per_day
                  : totalQuestion
              }
              selectedTime={selectedTime}
              showTimePicker={showTimePicker}
              formatTime={formatTime}
              isShowIcon={false}
            />
            <TimePicker
              visible={showPicker}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default StudyPlan;
