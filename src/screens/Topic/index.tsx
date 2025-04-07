import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import ProgressPlan from '../../components/ProgressPlan';
import {Colors, fullWidth} from '../../theme';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';
import {getLevel, getTopicProgress} from '@/services/api/api';
import {useFocusEffect} from '@react-navigation/native';
import {setDataLocalTopic} from '@/store/topics';
import ItemTopic from './Item';

const Topic = ({route, navigation}: any) => {
  const {indexTopic} = route.params;
  const dispatch = useDispatch();
  const dataTopics = useSelector((state: RootState) => state.topics.dataTopics);
  const token = useSelector((state: RootState) => state.auth.token);
  const [topicProgress, setTopicProgress] = useState<any>({});

  const getDataLevel = async () => {
    const res = await getLevel(dataTopics[indexTopic].id, 0);
    if (res?.error === 0) {
      let dataLevel = [...res.res];
      let dataTopic = dataTopics.map((item: any) => ({...item}));
      let part = dataTopic[indexTopic].data_level.map((item: any) => {
        let level = dataLevel.find((data: any) => data.id === item.id);
        return {
          ...item,
          percentPass: level?.progress,
        };
      });
      dataTopic[indexTopic].data_level = part;
      dispatch(setDataLocalTopic(dataTopic));
    }
  };

  const getProgressTopic = async () => {
    const res = await getTopicProgress(dataTopics[indexTopic].id);
    if (res?.error === 0) {
      setTopicProgress(res.res);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getDataLevel();
        getProgressTopic();
      }
    }, []),
  );

  const renderProgress = useCallback(() => {
    return token ? (
      <ProgressPlan
        total={topicProgress?.target_questions || 0}
        correct={topicProgress?.q_correct || 0}
        wrong={topicProgress?.q_wrong || 0}
        title="Progressing"
      />
    ) : (
      <ProgressPlan
        total={dataTopics[indexTopic].total_questions}
        correct={dataTopics[indexTopic].numberPass || 0}
        wrong={dataTopics[indexTopic].numberFail || 0}
        title="Progressing"
      />
    );
  }, [topicProgress, dataTopics]);

  return (
    <LinearGradientView>
      {/* <View style={{ height: 36, width: "100%" }} /> */}
      <Header
        title={dataTopics[indexTopic].name}
        goBack={() => navigation.goBack()}
        showBtnRight={false}
      />
      {renderProgress()}
      <View style={styles.wrapList}>
        {dataTopics[indexTopic] && dataTopics[indexTopic].id && (
          <FlatList
            style={{marginTop: 16}}
            data={dataTopics[indexTopic].data_level}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={({item, index}: {item: any; index: any}) => (
              <ItemTopic item={item} index={index} indexTopic={indexTopic} />
            )}
            ItemSeparatorComponent={() => {
              return <View style={styles.space}></View>;
            }}
            ListFooterComponent={() => {
              return <View style={{paddingBottom: 50}}></View>;
            }}
          />
        )}
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
    width: (fullWidth * 1) / 3 - 64 / 3,
    height: moderateScale(100),
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
    // flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    height: 16,
    width: '100%',
  },
  wrapIcLock: {
    width: 48,
    height: 48,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#E6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    marginLeft: 8,
    marginTop: 8,
    fontSize: moderateScale(12),
  },
});

export default Topic;
