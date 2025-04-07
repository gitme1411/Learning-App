import {FlatList, TouchableOpacity, View, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import LinearGradientView from '../../../components/LinerGradient';
import Header from '../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, fullWidth, spacing} from '../../../theme';
import {dataTime, dataQues} from './dataSetUp';
import {Icon} from '../../../utils/icon';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {getCustomPractice} from '../../../services/api/api';
import LoadingModal from '../../../components/Loading';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '@/components/Text';
import ModalNormal from '@/components/Modal/ModalNormal';
import {useNetInfo} from '@react-native-community/netinfo';
import ToastSimple from 'react-native-simple-toast';
type SelectedButtonType = 'goOutCustomPractice' | null;

const SetupTest = ({navigation}: any) => {
  const {type, isConnected} = useNetInfo();
  const [indexQues, setIndexQues] = useState('1');
  const [numQues, setNum] = useState(10);
  const [indexTime, setIndexTime] = useState('1');
  const [time, setTime] = useState('60');
  const [loading, setLoading] = useState(false);
  const [isModalSubmit, setModalSubmit] = useState(false);
  const [selectedButton, setSelectedButton] =
    useState<SelectedButtonType>(null);

  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);

  const newData = dataTopics.map(e => {
    return {
      id: e.id,
      name: e.name,
      check: true,
    };
  });

  const [dataTopic, setDataTopic] = useState(newData);

  const checkItemTopic = item => {
    const data = dataTopic.map(e => {
      if (e.id == item.id) {
        return {
          ...e,
          check: !e.check,
        };
      }
      return {
        ...e,
      };
    });
    setDataTopic(data);
  };

  const renderNumQues = item => {
    return (
      <TouchableOpacity
        style={{marginRight: 8}}
        onPress={() => {
          setIndexQues(item.id);
          setNum(item.num);
        }}>
        {item.id == indexQues ? (
          <LinearGradient
            colors={['#00C2FF', '#0F90EB']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            style={{
              height: 40,
              width: 62,
              borderRadius: 333,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextNormal
              fontSize={14}
              style={{
                color: '#fff',
                fontWeight: '600',
              }}>
              {item.num}
            </TextNormal>
          </LinearGradient>
        ) : (
          <View
            style={{
              height: 40,
              width: 62,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#D8D6DD',
              borderRadius: 333,
            }}>
            <TextNormal
              fontSize={14}
              style={{
                color: Colors.mainText,
                fontWeight: '600',
              }}>
              {item.num}
            </TextNormal>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderNumTimes = item => {
    return (
      <TouchableOpacity
        style={{marginRight: 8}}
        onPress={() => {
          setIndexTime(item.id);
          setTime(item.num);
        }}>
        {item.id == indexTime ? (
          <LinearGradient
            colors={['#00C2FF', '#0F90EB']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            style={{
              height: 40,
              width: 62,
              borderRadius: 333,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextNormal
              fontSize={14}
              style={{
                color: '#fff',
                fontWeight: '600',
              }}>
              {item.num}
            </TextNormal>
          </LinearGradient>
        ) : (
          <View
            style={{
              height: 40,
              width: 62,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#D8D6DD',
              borderRadius: 333,
            }}>
            <TextNormal
              fontSize={14}
              style={{
                color: Colors.mainText,
                fontWeight: '600',
              }}>
              {item.num}
            </TextNormal>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSetQues = () => {
    return (
      <>
        <TextNormal
          fontSize={16}
          style={{
            fontWeight: '600',
            color: Colors.mainText,
          }}>
          How many questions?
        </TextNormal>
        <FlatList
          style={{flexDirection: 'row', marginTop: 12}}
          data={dataQues}
          renderItem={({item}) => renderNumQues(item)}
          horizontal
        />
      </>
    );
  };

  const renderSetTime = () => {
    return (
      <>
        <TextNormal
          fontSize={16}
          style={{
            fontWeight: '600',
            color: Colors.mainText,
            marginTop: 30,
          }}>
          How many seconds for each questions ?
        </TextNormal>
        <FlatList
          style={{flexDirection: 'row', marginTop: 12}}
          data={dataTime}
          renderItem={({item}) => renderNumTimes(item)}
          horizontal
        />
      </>
    );
  };

  const renderItemTopic = (item, index) => {
    return (
      <TouchableOpacity onPress={() => checkItemTopic(item)}>
        <View
          style={{
            height: 48,
            width: fullWidth - 32,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TextNormal
            fontSize={16}
            numberOfLines={1}
            style={{width: fullWidth - 64}}>
            {item.name}
          </TextNormal>
          <Image
            source={item.check ? Icon.icCheckBox : Icon.icUnCheckBox}
            style={{marginRight: 12}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderTopics = () => {
    return (
      <View>
        <TextNormal
          fontSize={16}
          style={{
            fontWeight: '600',
            color: Colors.mainText,
            marginTop: 30,
          }}>
          Topics
        </TextNormal>
        <FlatList
          style={{marginTop: 8}}
          data={dataTopic}
          renderItem={({item, index}) => renderItemTopic(item, index)}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  width: fullWidth - 32,
                  height: 1,
                  backgroundColor: Colors.backgroundGray,
                }}></View>
            );
          }}
        />
      </View>
    );
  };

  const onStart = () => {
    if (isConnected) {
      let index = dataTopic.findIndex((item: any) => item.check);
      if (index === -1) {
        ToastSimple.showWithGravity(
          'You must choose at least 1 part',
          ToastSimple.SHORT,
          ToastSimple.BOTTOM,
        );
      } else {
        setModalSubmit(true);
      }
    } else {
      Alert.alert('Error', 'Network Error');
    }
  };
  const onClose = () => {
    setModalSubmit(false);
  };
  const onConfirm = async () => {
    if (selectedButton === 'goOutCustomPractice') {
      setModalSubmit(false);
      navigation.goBack();
    } else {
      let arrTopicId = '';
      dataTopic.map(e => {
        if (e.check == true) {
          arrTopicId = arrTopicId + e.id + ',';
        }
      });

      if (arrTopicId.length < 1) return;
      setLoading(true);
      const res = await getCustomPractice(
        numQues,
        time,
        arrTopicId.slice(0, arrTopicId.length - 1),
      );
      if (res && res.error == 0) {
        setLoading(false);
        navigation.navigate('QuestionCustomP', {
          itemTest: res.res,
          title: 'Custom Practice',
        });
      }
      setLoading(false);
      setModalSubmit(false);
    }
  };

  return (
    <LinearGradientView>
      <Header
        title="Custom Practice"
        showBtnRight={false}
        goBack={() => {
          navigation.goBack();
        }}
      />
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
        <View style={{marginTop: 16, paddingHorizontal: spacing.mainSpacing}}>
          {renderSetQues()}
          {renderSetTime()}
          {renderTopics()}
        </View>
        <TouchableOpacity
          style={{position: 'absolute', bottom: moderateScale(22), left: 16}}
          onPress={onStart}>
          <LinearGradient
            colors={['#00C2FF', '#0F90EB']}
            start={{x: 1, y: 0}}
            end={{x: 0, y: 0}}
            style={{
              height: 44,
              width: fullWidth - 32,
              borderRadius: 333,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextNormal
              fontSize={14}
              style={{
                color: '#fff',
                fontWeight: '600',
              }}>
              Start Test
            </TextNormal>
          </LinearGradient>
        </TouchableOpacity>
        <ModalNormal
          modalVisible={isModalSubmit}
          onClose={onClose}
          onSubmit={onConfirm}
          title="Confirm"
          textContent={
            selectedButton === 'goOutCustomPractice'
              ? 'Are you sure to exit this test'
              : 'Are you ready?'
          }
          textClose="No"
          textSubmit="Yes"
        />
      </View>
      <LoadingModal visible={loading} />
    </LinearGradientView>
  );
};

export default SetupTest;
