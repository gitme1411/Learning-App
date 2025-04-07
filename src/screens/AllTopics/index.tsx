import {View, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {moderateScale} from 'react-native-size-matters';
import {Colors, fullWidth} from '../../theme';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {getAllTopic, getTodayPlan} from '../../services/api/api';
import TodayPlan from '../../components/TodayPlan';
import TextNormal from '@/components/Text';
import {setNumberTopicTodayPlan} from '@/store/config';
import {useFocusEffect} from '@react-navigation/native';
import {setDataLocalTopic} from '@/store/topics';

const AllTopics = ({navigation}: any) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const dataProgress = useSelector(
    (state: RootState) => state.topics.dataProgress,
  );
  const numberTopicTodayPlan = useSelector(
    (state: RootState) => state.config.numberTopicTodayPlan,
  );
  const numberFailTopicTodayPlan = useSelector(
    (state: RootState) => state.config.numberFailTopicTodayPlan,
  );

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getDataTodayPlan();
        getTopic();
      }
    }, []),
  );

  const getTopic = async () => {
    const res = await getAllTopic(1);
    if (res?.error === 0) {
      let topic = dataTopics.map((item: any) => {
        let part = res.res.data.find((data: any) => data.id === item.id);
        return {
          ...item,
          percentPass: part.progress,
        };
      });
      dispatch(setDataLocalTopic(topic));
    }
  };

  const getDataTodayPlan = async () => {
    const res = await getTodayPlan();
    if (res?.error === 0) {
      dispatch(
        setNumberTopicTodayPlan({
          numberTopicTodayPlan: res.res.q_correct,
          numberFailTopicTodayPlan: res.res.q_wrong,
        }),
      );
    }
  };

  const renderItem = (item: any, index: number) => {
    return (
      <TouchableOpacity
        style={styles.wrapItem}
        onPress={() => navigation.navigate('Topic', {indexTopic: index})}>
        <CircularProgress
          value={parseFloat(item.percentPass) || 0}
          radius={moderateScale(24)}
          activeStrokeWidth={10}
          progressValueColor={Colors.primaryMain}
          inActiveStrokeColor="#E6F6FF"
          activeStrokeColor={Colors.primaryMain}
          valueSuffix={'%'}
          progressFormatter={(value: number) => {
            'worklet';
            let number = value.toFixed(1);
            let index = number.toString().indexOf('.0');
            if (index > 0) {
              return parseInt(number).toString();
            }
            return number;
          }}
        />
        <TextNormal
          fontSize={14}
          numberOfLines={2}
          style={{
            marginLeft: 8,
            width: fullWidth - 32 - 26 - 24 - 34,
          }}>
          {item.name}
        </TextNormal>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradientView>
      {/* <View style={{ width: "100%", height: 36 }}></View> */}
      <View style={{flex: 1}}>
        <Header
          goBack={() => navigation.goBack()}
          title="All topics"
          showBtnRight={false}
        />
        {/* {renderTodayPlan()} */}
        <TodayPlan
          dataPass={numberTopicTodayPlan}
          dataFail={numberFailTopicTodayPlan}
        />
        <View style={styles.wrapList}>
          {dataTopics && (
            <FlatList
              style={{marginTop: 16}}
              data={dataTopics}
              keyExtractor={(item, index) => index.toString()}
              // numColumns={1}
              renderItem={({item, index}) => renderItem(item, index)}
              ItemSeparatorComponent={() => {
                return <View style={styles.space}></View>;
              }}
            />
          )}
        </View>
      </View>
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
  right: {
    width: 56,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapList: {
    marginTop: 16,
    flex: 1,
    backgroundColor: '#fbfbfb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  wrapItem: {
    width: fullWidth - 32,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 30,
    shadowRadius: 3.84,
    marginLeft: 16,
    elevation: 4,
    flexDirection: 'row',
    // justifyContent: "",
    alignItems: 'center',
    padding: 12,
  },
  space: {
    height: 16,
    width: '100%',
  },
});

export default AllTopics;
