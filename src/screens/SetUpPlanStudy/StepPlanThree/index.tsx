import {View, Image, Alert, Switch, ScrollView, Dimensions} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import {useNavigation} from '@react-navigation/native';
import ButtonNext from '../../../components/Button/ButtonNext';
import HeaderBackSkip from '../../../components/HeaderBackSkip';
import {DateData} from 'react-native-calendars';
import ReactNativeModal from 'react-native-modal';
import {createStudyPlan} from '../../../services/api/api';
import Toast from 'react-native-simple-toast';
import LoadingModal from '../../../components/Loading';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {setDaysCountDownt, updateData} from '../../../store/stepPlan';
import CalendarComponent from '../../../components/Calenders';
import TextNormal from '../../../components/Text';
import ModalNormal from '@/components/Modal/ModalNormal';
type ItemProps = {
  route: any;
  navigation: any;
};

const StepPlanThree: React.FC<ItemProps> = ({route, navigation}) => {
  const {navigate, goBack} = useNavigation();
  const date = new Date();
  const dateMonth = new Date(date.setMonth(date.getMonth() + 1));
  const dateEnd = new Date(dateMonth.setDate(date.getDate() - 1));
  let day = new Date().getDate();
  let month = new Date().getMonth() + 1;
  let year = new Date().getFullYear();
  const currentDate = `${day}-${month}-${year}`;
  const currentDateEnd = `${dateEnd.getFullYear()}-${
    dateEnd.getMonth() + 1
  }-${dateEnd.getDate()}`;
  const [modalVisible, setModalVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const getCurrentDate = () => {
    const today = new Date();
    const localDate = new Date(
      today.getTime() - today.getTimezoneOffset() * 60000,
    );
    return localDate.toISOString().split('T')[0];
  };

  const today = getCurrentDate();
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string | null>(currentDateEnd);
  const [totalDays, setTotalDays] = useState<number>(1);
  const [isModal, setIsModal] = useState<boolean>(false);
  const {width, height} = Dimensions.get('window');
  const props = route.params;
  const dispatch = useDispatch();
  const dataStepPlan = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan,
  );
  const deviceToken = useSelector(
    (state: RootState) => state.auth.devicesToken,
  );
  useEffect(() => {
    const createTwoButtonAlert = () =>
      Alert.alert(
        '“AU Test 2024” Would Like to Access Your Calendar',
        'Evenys to which you subscrubed will be synchronized with your phone’s calendar. You can delete all events on menu.',
        [
          {
            text: 'Don’t Allow',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ],
        {
          cancelable: true,
        },
      );
    createTwoButtonAlert();
  }, []);

  const onDayPress = (day: DateData) => {
    if (day.dateString === endDate) {
      setEndDate(null);
      setTotalDays(1);
    } else if (day.dateString > startDate) {
      setEndDate(day.dateString);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalDays(diffDays);
    } else {
      setTotalDays(1);
    }
  }, [startDate, endDate]);

  const getMarkedDates = () => {
    const markedDates: {[key: string]: any} = {};

    markedDates[startDate] = {
      startingDay: true,
      color: '#0F90EB',
      textColor: 'white',
    };

    if (endDate) {
      markedDates[endDate] = {
        endingDay: true,
        color: '#0F90EB',
        textColor: 'white',
      };

      let currentDate = new Date(startDate);
      const end = new Date(endDate);

      while (currentDate <= end) {
        const dateString = currentDate.toISOString().split('T')[0];
        if (dateString !== startDate && dateString !== endDate) {
          markedDates[dateString] = {
            color: '#F0F0F4',
            textColor: 'black',
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      markedDates[startDate].borderColor = 'gray';
      markedDates[startDate].borderWidth = 1;
    }
    return markedDates;
  };

  const _renderItemShowTimeLearn = () => {
    return (
      <View style={styles.viewDateTime}>
        <View>
          <TextNormal
            fontSize={14}
            style={[styles.txtDate, {color: '#A7A7B3'}]}>
            {'Date'}
          </TextNormal>
          <TextNormal fontSize={16} style={styles.txtDays}>
            {currentDate}
          </TextNormal>
        </View>
        <View style={styles.viewDaysLeft}>
          <TextNormal fontSize={14} style={[styles.txtDate, {color: 'red'}]}>
            {'Days left'}
          </TextNormal>
          {totalDays !== null && (
            <TextNormal fontSize={16} style={[styles.txtDays]}>
              {totalDays + ' Day'}
            </TextNormal>
          )}
        </View>
      </View>
    );
  };

  const onNextScreen = async () => {
    // if (endDate === null) {
    //   Toast.showWithGravity(
    //     'You need to select the course end date!',
    //     Toast.TOP,
    //     Toast.CENTER,
    //   );
    // } else {
    const param = {
      device_token: deviceToken || 'abc',
      time_in_date: props.time_in_date,
      minutes: props.selectedValue,
      day_in_week: props.day_in_week,
      start_date: startDate,
      end_date: endDate === null ? currentDateEnd : endDate,
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
      if (create?.error === 0) {
        dispatch(setDaysCountDownt(totalDays));
        dispatch(updateData({param}));
        navigation.navigate('CreateStudyPlan');
        // Toast.showWithGravity(create?.message, Toast.LONG, Toast.BOTTOM);
      } else if (create?.error === 1) {
        Alert.alert('Create Plan Failed!', 'Please try again');
      } else {
        setIsModal(true);
      }
      setLoading(false);
    } catch (error) {
      Alert.alert('Create Plan Failed!', 'Please try again');
    }
    // }
  };

  const _renderModal = () => {
    const onContinue = async () => {
      const param = {
        device_token: deviceToken || 'abc',
        time_in_date: props.time_in_date,
        minutes: props.selectedValue,
        day_in_week: props.day_in_week,
        start_date: startDate,
        end_date: endDate,
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
        if (create?.error === 0) {
          setModalVisible(!modalVisible);
          dispatch(setDaysCountDownt(totalDays));
          dispatch(updateData({param}));
          navigation.navigate('CreateStudyPlan');
          // Toast.showWithGravity(create?.message, Toast.LONG, Toast.BOTTOM);
        } else if (create?.error === 1) {
          Alert.alert('Create Plan Failed!', 'Please try again');
        }
        setLoading(false);
      } catch (error) {
        Alert.alert('Create Plan Failed!', 'Please try again');
      }
    };

    return (
      <ReactNativeModal
        animationIn={'slideInUp'}
        isVisible={modalVisible}
        style={{justifyContent: 'flex-end', margin: 0}}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}>
        <LoadingModal visible={loading} />
        <View style={[styles.centeredView]}>
          <View style={styles.modalView}>
            <Image
              source={require('../../../assets/images/img_notification.png')}
              style={{
                width: width * 0.5,
                height: height * 0.12,
                resizeMode: 'contain',
              }}
            />
            <View style={styles.viewContentNotiModal}>
              <View
                style={[
                  styles.flexRow,
                  {justifyContent: 'space-between', paddingBottom: 12},
                ]}>
                <TextNormal fontSize={16} style={styles.txtDays}>
                  {'Notification'}
                </TextNormal>
                <Switch
                  trackColor={{false: '#767577', true: '#00C2FF'}}
                  thumbColor={isEnabled ? '#f4f3f4' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </View>
              <TextNormal
                fontSize={14}
                style={[styles.txtDate, {color: '#6D6B7A', textAlign: 'left'}]}>
                {
                  'We will send notifications to remind you in accordance with the personal study schedule you have created.'
                }
              </TextNormal>
            </View>
            <View style={styles.btnContinue}>
              <ButtonNext onPressNext={onContinue} text="Continue" />
            </View>
          </View>
        </View>
      </ReactNativeModal>
    );
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
        onPressSkip={onNextScreen}
        progress={4.7}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.viewContent}
        contentContainerStyle={{alignItems: 'center'}}>
        {/* <View style={styles.viewContent}> */}
        <TextNormal fontSize={14} style={styles.txtNumberStep}>
          {'Step 3/3'}
        </TextNormal>
        <TextNormal fontSize={18} style={styles.txtContentIntro}>
          {'Tell us when the exam will \n take place'}
        </TextNormal>
        {_renderItemShowTimeLearn()}

        <CalendarComponent
          onDayPress={onDayPress}
          markedDates={getMarkedDates()}
          style={styles.stylesCalendar}
        />
        {/* {_renderModal()} */}
        {/* </View> */}
      </ScrollView>

      <ButtonNext onPressNext={onNextScreen} text="Next" />
      <ModalNormal
        modalVisible={isModal}
        onSubmit={() => setIsModal(false)}
        title="Message"
        textContent={'Network Error !!!'}
        textSubmit="Close"
      />
    </SafeAreaView>
  );
};

export default StepPlanThree;
