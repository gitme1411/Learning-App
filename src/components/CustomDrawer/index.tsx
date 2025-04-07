import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  Platform,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import {DrawerContentComponentProps} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, fullHeight, fullWidth} from '../../theme';
import ItemDrawer from './ItemDrawer';
import {Icon} from '../../utils/icon';
import LinearGradientView from '../LinerGradient';
import DeviceInfo from 'react-native-device-info';
import Modal from 'react-native-modal';
import Pdf from 'react-native-pdf';
import WebView from 'react-native-webview';
import {moderateScale, scale} from 'react-native-size-matters';
import {
  getMasterDataFinalTest,
  getMasterDataPractice,
  getMasterDataTopic,
  resetProgress,
} from '../../services/api/api';
import LoadingModal from '../Loading';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {resetLikedQuestions} from '../../store/likedQuestionsSlice';
import {clearPendingRating} from '../../store/questions';
import {setDataWrong} from '@/store/quesStatis';
import {ScrollView} from 'react-native-gesture-handler';
import ModalConfirmApp from '../Modal/Modal';
import TextNormal from '../Text';
import {dataFSize} from '@/database';
import {
  setDataStudyPlan,
  setResetTodayPlan,
  setSettingFont,
} from '@/store/config';
import ToastSimple from 'react-native-simple-toast';
import {useQuery, useRealm} from '@realm/react';
import {setDataLocalTopic} from '@/store/topics';
import {setDataLocalPractice} from '@/store/practice';
import {setDataLocalFinalTest} from '@/store/finalTest';
import InAppReview from 'react-native-in-app-review';
import WrongQuestion from '@/model/wrong_question';
import {eachDayOfInterval, format} from 'date-fns';
import LottieView from 'lottie-react-native';

type Props = {
  props: DrawerContentComponentProps;
  navigation: any;
};

const CustomDrawer = ({props}: Props) => {
  const realm = useRealm();
  let hasNotch = DeviceInfo.hasNotch();
  const dispatch = useDispatch();
  const listWrongQuestion = useQuery(WrongQuestion);
  const dataStepPlanLocal = useSelector(
    (state: RootState) => state.createStepPlan.dataCreateStepPlan?.param,
  );

  const token = useSelector((state: RootState) => state.auth.token);

  const sourcePrivacy = {
    uri: 'https://www.jamesedutech.net/Privacy-Policy-AuTest.pdf',
    cache: true,
  };
  const sourceTermsAndroid = {
    uri: 'https://www.jamesedutech.net/Terms-of-Service-AuTest-CHPlay.pdf',
    cache: true,
  };
  const sourceTermsIos = {
    uri: 'https://www.jamesedutech.net/Terms-of-Service-AuTest-AppStore.pdf',
    cache: true,
  };
  const settingFont = useSelector(
    (state: RootState) => state.config.settingFont,
  );

  const [isModalPrivacyVisible, setModalPrivacyVisible] = useState(false);
  const [isModalTermVisible, setModalTermVisible] = useState(false);
  const [isModalFontVisible, setModalFontVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [loadingPrivacy, setLoadingPrivacy] = useState(false);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'AU Test 2024',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  const onReset = async () => {
    setShowModalConfirm(false);
    if (token) {
      setTimeout(async () => {
        setLoading(true);
        const res = await resetProgress();
        if (res) {
          if (res?.error === 0) {
            dispatch(resetLikedQuestions());
            dispatch(clearPendingRating());
            dispatch(setDataWrong([]));
            setLoading(false);
            props.navigation.navigate('Home');
            ToastSimple.showWithGravity(
              'Reset successfully!',
              ToastSimple.SHORT,
              ToastSimple.BOTTOM,
            );
          } else {
            setLoading(false);
            Alert.alert('Error', res.message);
          }
        } else {
          setLoading(false);
        }
      }, 700);
    } else {
      setTimeout(async () => {
        setLoading(true);
        deleteAllData();
        dispatch(resetLikedQuestions());
        dispatch(setResetTodayPlan());
        dispatch(clearPendingRating());
        dispatch(setDataWrong([]));
        resetDataStudy();
        await fetchMasterDataAll();
        setLoading(false);
        props.navigation.navigate('Home');
        ToastSimple.showWithGravity(
          'Reset successfully!',
          ToastSimple.SHORT,
          ToastSimple.BOTTOM,
        );
      }, 700);
    }
  };

  const resetDataStudy = () => {
    const startDateLocal = new Date(dataStepPlanLocal.start_date);
    const endDateLocal = new Date(dataStepPlanLocal.end_date);
    const dates = eachDayOfInterval({
      start: startDateLocal,
      end: endDateLocal,
    });
    let data = dates.reduce((acc: any, date: any) => {
      acc[format(date, 'yyyy-MM-dd')] = 0;
      return acc;
    }, {});
    dispatch(setDataStudyPlan(data));
  };

  const fetchMasterDataAll = async () => {
    // setLoading(true);
    const [resDataTopic, resDataPractice, resDataFinalTest] = await Promise.all(
      [getMasterDataTopic(), getMasterDataPractice(), getMasterDataFinalTest()],
    );
    if (resDataTopic && resDataTopic.res && resDataTopic.res.data) {
      realm.write(() => {
        resDataTopic.res.data.forEach((obj: any) => {
          realm.create('Topic', obj);
        });
      });
      dispatch(setDataLocalTopic(resDataTopic.res.data));
    }

    if (resDataPractice && resDataPractice.res && resDataPractice.res.data) {
      realm.write(() => {
        resDataPractice.res.data.forEach((obj: any) => {
          realm.create('Practice', obj);
        });
      });
      dispatch(setDataLocalPractice(resDataPractice.res.data));
    }

    if (resDataFinalTest && resDataFinalTest.res && resDataFinalTest.res.data) {
      realm.write(() => {
        resDataFinalTest.res.data.forEach((obj: any) => {
          realm.create('FinalTest', obj);
        });
      });
      dispatch(setDataLocalFinalTest(resDataFinalTest.res.data));
    }
    setLoading(false);
  };

  const deleteAllData = () => {
    realm.write(() => {
      realm.deleteAll();
      realm.delete(listWrongQuestion);
    });
  };

  const renderHeader = () => {
    return (
      <>
        {hasNotch ? (
          <View style={{height: 34, width: '100%'}} />
        ) : (
          <View style={{height: 16, width: '100%'}} />
        )}
        <View style={styles.wrapHeader}>
          <TouchableOpacity onPress={() => props.navigation.closeDrawer()}>
            <View style={styles.wrapClose}>
              <Image source={Icon.icClose} />
            </View>
          </TouchableOpacity>
          <View style={styles.wrapAppName}>
            <TextNormal fontSize={18} style={styles.appName}>
              AU Test 2024
            </TextNormal>
          </View>
        </View>
      </>
    );
  };

  const onRateApp = () => {
    // let isAvailable = InAppReview.isAvailable();
    // if (isAvailable) {
    // trigger UI InAppreview
    InAppReview.RequestInAppReview()
      .then(hasFlowFinishedSuccessfully => {
        // when return true in android it means user finished or close review flow
        console.log('InAppReview in android', hasFlowFinishedSuccessfully);

        // when return true in ios it means review flow lanuched to user.
        console.log(
          'InAppReview in ios has launched successfully',
          hasFlowFinishedSuccessfully,
        );

        // 1- you have option to do something ex: (navigate Home page) (in android).
        // 2- you have option to do something,
        // ex: (save date today to lanuch InAppReview after 15 days) (in android and ios).

        // 3- another option:
        if (hasFlowFinishedSuccessfully) {
          // do something for ios
          // do something for android
        }
        console.log('InAppReview in android', hasFlowFinishedSuccessfully);
        // for android:
        // The flow has finished. The API does not indicate whether the user
        // reviewed or not, or even whether the review dialog was shown. Thus, no
        // matter the result, we continue our app flow.

        // for ios
        // the flow lanuched successfully, The API does not indicate whether the user
        // reviewed or not, or he/she closed flow yet as android, Thus, no
        // matter the result, we continue our app flow.
      })
      .catch(error => {
        //we continue our app flow.
        // we have some error could happen while lanuching InAppReview,
        // Check table for errors and code number that can return in catch.
        console.log(error);
      });
    // }
  };

  const renderStudyProgress = () => {
    return (
      <>
        <TextNormal fontSize={16} style={styles.txtProgress}>
          Study progress
        </TextNormal>
        <View style={styles.space} />
        <ItemDrawer
          icon={Icon.icStPlan}
          title="Study plan"
          onPress={() =>
            props.navigation.navigate('AppStack', {
              screen: 'MainTab',
              params: {
                screen: 'Study plan',
              },
            })
          }
        />
        <ItemDrawer
          icon={Icon.icArBook}
          title="All topics"
          onPress={() =>
            props.navigation.navigate('AppStack', {screen: 'AllTopics'})
          }
        />
        <ItemDrawer
          icon={Icon.icRepeate}
          title="Practice"
          onPress={() =>
            props.navigation.navigate('AppStack', {screen: 'DPractice'})
          }
        />
        <ItemDrawer
          icon={Icon.icTimeStart}
          title="Final test"
          onPress={() =>
            props.navigation.navigate('AppStack', {screen: 'FinalTest'})
          }
        />
        <ItemDrawer
          icon={Icon.icQA}
          title="Question statistics"
          onPress={() =>
            props.navigation.navigate('AppStack', {
              screen: 'QuestionsStatistics',
            })
          }
        />
        <ItemDrawer
          icon={Icon.icStatistics}
          title="Statistics"
          onPress={() =>
            props.navigation.navigate('AppStack', {
              screen: 'MainTab',
              params: {
                screen: 'Statistics',
              },
            })
          }
        />
        <ItemDrawer
          icon={Icon.icNotification}
          title="Notification"
          onPress={() => {
            props.navigation.navigate('AppStack', {
              screen: 'PushNotificationScreen',
              params: {
                screen: 'PushNotificationScreen',
              },
            });
          }}
        />
        <ItemDrawer
          icon={Icon.icReset}
          title="Reset Progress"
          onPress={() => setShowModalConfirm(true)}
        />
      </>
    );
  };

  const renderHS = () => {
    return (
      <>
        <TextNormal fontSize={16} style={styles.txtProgress}>
          Help & Support
        </TextNormal>
        <View style={styles.space} />
        <ItemDrawer
          icon={Icon.icChangeFont}
          title="Change font size"
          onPress={() => setModalFontVisible(true)}
        />
        <ItemDrawer
          icon={Icon.icRateApp}
          title="Rate app"
          onPress={onRateApp}
        />
        <ItemDrawer
          icon={Icon.icShare}
          title="Share with frierds"
          onPress={onShare}
        />
        <ItemDrawer
          icon={Icon.icDocument}
          title="Privacy policy"
          onPress={() => setModalPrivacyVisible(true)}
        />
        <ItemDrawer
          icon={Icon.icDocument}
          title="Terms of service"
          onPress={() => setModalTermVisible(true)}
        />
        {/* <ItemDrawer
          icon={Icon.icStar}
          title="Rating app"
          onPress={() => console.log('')}
        /> */}
      </>
    );
  };

  const renderModalTerms = () => {
    return (
      <Modal isVisible={isModalTermVisible} style={{padding: 0, margin: 0}}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: 0.89 * fullHeight,
              width: '100%',
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingVertical: 12,
            }}>
            <WebView
              style={{
                flex: 1,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
              onLoadStart={() => setLoadingPrivacy(true)}
              onLoadEnd={() => setLoadingPrivacy(false)}
              source={{
                uri:
                  Platform.OS === 'android'
                    ? 'https://jamesedutech.net/term-chplay'
                    : 'https://jamesedutech.net/term-appstore',
              }}
            />
            {loadingPrivacy && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LottieView
                  style={{width: 64, height: 64}}
                  source={require('@/assets/animation/loading3.json')}
                  autoPlay
                  loop
                />
              </View>
            )}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setModalTermVisible(false)}>
                <LinearGradient
                  colors={['#00C2FF', '#0F90EB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    height: 44,
                    width: 150,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 333,
                    marginLeft: 12,
                  }}>
                  <TextNormal
                    fontSize={14}
                    style={{color: '#fff', fontWeight: '500'}}>
                    Close
                  </TextNormal>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderModalPrivacy = () => {
    return (
      <Modal isVisible={isModalPrivacyVisible} style={{padding: 0, margin: 0}}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: 0.89 * fullHeight,
              width: '100%',
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingVertical: 12,
            }}>
            <WebView
              style={{
                flex: 1,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
              onLoadStart={() => setLoadingPrivacy(true)}
              onLoadEnd={() => setLoadingPrivacy(false)}
              source={{uri: 'https://jamesedutech.net/privacy'}}
            />
            {loadingPrivacy && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LottieView
                  style={{width: 64, height: 64}}
                  source={require('@/assets/animation/loading3.json')}
                  autoPlay
                  loop
                />
              </View>
            )}
            {/* <Pdf
              source={sourcePrivacy}
              onLoadComplete={(numberOfPages, filePath) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
                console.log(error);
              }}
              onPressLink={uri => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={{
                flex: 1,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
              trustAllCerts={false}
            /> */}

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setModalPrivacyVisible(false)}>
                <LinearGradient
                  colors={['#00C2FF', '#0F90EB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    height: 44,
                    width: 150,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 333,
                    marginLeft: 12,
                  }}>
                  <TextNormal
                    fontSize={14}
                    style={{color: '#fff', fontWeight: '500'}}>
                    Close
                  </TextNormal>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderModalChangeFontSize = () => {
    return (
      <Modal isVisible={isModalFontVisible} style={{margin: 0}}>
        <View style={{flex: 1}}>
          <View style={styles.viewModalFont}>
            <TextNormal fontSize={16} style={styles.textChangeFont}>
              Change font size
            </TextNormal>
            <TextNormal fontSize={16} style={styles.textNameFont}>
              {settingFont}
            </TextNormal>
            <View style={{flexDirection: 'row'}}>
              <FlatList
                style={styles.flFont}
                data={dataFSize}
                renderItem={({item}) => renderItemFZ(item)}
                horizontal
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
            <View style={styles.viewButton}>
              <TouchableOpacity onPress={() => setModalFontVisible(false)}>
                <LinearGradient
                  colors={['#00C2FF', '#0F90EB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={styles.viewGradient}>
                  <TextNormal fontSize={16} style={styles.textButtonChangeFont}>
                    OK
                  </TextNormal>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderItemFZ = (item: any) => {
    return (
      <View
        style={{
          marginLeft: (fullWidth - scale(170)) / 6,
        }}>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSettingFont(item.name));
          }}
          hitSlop={{left: 30, right: 30, top: 30, bottom: 30}}>
          <Image
            style={styles.imageFont}
            source={
              item.name === settingFont ? Icon.icCheckRButton : Icon.icRButton
            }
          />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <LinearGradientView>
        {renderHeader()}
        <ScrollView>
          <View style={styles.wrapContent}>
            {renderStudyProgress()}
            {renderHS()}
            {/* <View style={styles.wrapVersion}>
            <TextNormal fontSize={} style={styles.version}>Version 1.1.2    </TextNormal>
          </View> */}
          </View>
          {renderModalPrivacy()}
          {renderModalTerms()}
          {renderModalChangeFontSize()}
          <View style={{width: '100%', height: 30}} />
        </ScrollView>
      </LinearGradientView>

      <ModalConfirmApp
        modalVisible={showModalConfirm}
        onSubmit={() => onReset()}
        onClose={() => setShowModalConfirm(false)}
        title="Are you sure to reset progress?"
      />
      <LoadingModal visible={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapHeader: {
    height: 56,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  wrapClose: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000040',
    borderRadius: 40,
    marginLeft: 24,
  },
  wrapAppName: {
    width: 0.8 * fullWidth - 90,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  appName: {
    textAlign: 'center',
    fontSize: moderateScale(18),
    fontWeight: '600',
    color: '#fff',
  },
  txtProgress: {
    marginTop: 12,
    marginLeft: 24,
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#242424',
  },
  wrapContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: '100%',
    marginTop: 12,
  },
  wrapVersion: {
    marginTop: 60,
  },
  version: {
    textAlign: 'center',
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
  space: {
    width: '100%',
    height: 12,
  },
  viewModalFont: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    paddingBottom: scale(16),
  },
  textChangeFont: {
    fontWeight: '600',
    fontSize: 18,
    color: Colors.mainText,
    textAlign: 'center',
    marginTop: scale(24),
  },
  textNameFont: {
    color: Colors.primaryMain,
    textAlign: 'center',
    marginTop: scale(12),
    height: scale(30),
  },
  flFont: {
    backgroundColor: Colors.backgroundGray,
    marginHorizontal: scale(40),
    marginVertical: scale(32),
    borderRadius: scale(16),
  },
  imageFont: {
    height: scale(18),
    width: scale(18),
  },
  viewGradient: {
    height: scale(40),
    width: scale(150),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(20),
    marginLeft: scale(12),
  },
  textButtonChangeFont: {
    color: '#fff',
    fontWeight: '500',
  },
  viewButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomDrawer;
