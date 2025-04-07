import {FlatList, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import LinearGradientView from '../../../../components/LinerGradient';
import Header from '../../../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import {Colors, fullWidth, spacing} from '../../../../theme';
import {dataTime, dataQues} from '../../WrongQues/WrongSetup/dataSetup';
import TextNormal from '@/components/Text';
import ModalNormal from '@/components/Modal/ModalNormal';

const FavoriteSetup = ({route, navigation}: any) => {
  const {dataFavorite} = route.params;
  const dataQuestion = dataFavorite.map(e => {
    return {
      ...e,
      checked: false,
      user_answers: -1,
    };
  });
  let allques = dataQuestion.length;

  const [indexQues, setIndexQues] = useState('1');
  const [numQues, setNumQues] = useState(allques);
  const [indexTime, setIndexTime] = useState('2');
  const [time, setTime] = useState('60');
  const [isModalSubmit, setModalSubmit] = useState(false);

  const renderNumQues = item => {
    return item.num === 'All' || dataQuestion.length > Number(item.num) ? (
      <TouchableOpacity
        style={{marginRight: 8}}
        onPress={() => {
          if (item.id == '1') {
            setNumQues(dataQuestion.length);
          } else {
            setNumQues(item.num);
          }
          setIndexQues(item.id);
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
    ) : (
      <View></View>
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

  const goWrongTest = () => {
    setModalSubmit(false);
    let dataQues: any[] = [];

    dataQuestion.map((e, index) => {
      if (index < numQues) {
        dataQues.push(e);
      }
    });

    navigation.navigate('QuestionCustomP', {
      itemTest: {
        question_info: dataQues,
        total_question_set: numQues,
        time_for_one: time,
      },
      title: 'Favorite Questions',
    });
  };

  const onClose = () => {
    setModalSubmit(false);
  };

  const onConfirm = () => {
    setModalSubmit(true);
  };

  return (
    <LinearGradientView>
      <Header
        title="Favorite Questions"
        showBtnRight={false}
        goBack={() => navigation.goBack()}
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
        </View>
        <TouchableOpacity
          style={{position: 'absolute', bottom: 24, left: 16}}
          onPress={() => onConfirm()}>
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
      </View>
      <ModalNormal
        modalVisible={isModalSubmit}
        onClose={onClose}
        onSubmit={goWrongTest}
        title="Confirm"
        textContent={'Are you ready?'}
        textClose="No"
        textSubmit="Yes"
      />
    </LinearGradientView>
  );
};

export default FavoriteSetup;
