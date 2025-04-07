import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import LinearGradientView from '../../components/LinerGradient';
import {Icon} from '../../utils/icon';
import DeviceInfo from 'react-native-device-info';
import {styles} from './styles';
import {Colors} from '../../theme';
import CircularProgress from 'react-native-circular-progress-indicator';
import ProgressStatistics from '../../components/ProgressStatistics';
import {getTopicDetailReport} from '../../services/api/api';
import LoadingModal from '../../components/Loading';
import TextNormal from '../../components/Text';

const DetailTopic = ({navigation}: any) => {
  let hasNotch = DeviceInfo.hasNotch();
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [statisticTopic, setStatisticTopic] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const callApi = async () => {
    setLoading(true);
    const data = await getTopicDetailReport();
    setTimeout(() => {
      if (data?.error === 0 && data?.res?.report != 0) {
        setStatisticTopic(data?.res?.report);
      } else {
        Alert.alert('Error', 'NO DATA', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      }
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    callApi();
  }, []);

  const toggleItem = (index: number) => {
    const currentIndex = expandedIndices.indexOf(index);
    if (currentIndex === -1) {
      setExpandedIndices([...expandedIndices, index]);
    } else {
      setExpandedIndices(expandedIndices.filter(idx => idx !== index));
    }
  };
  const convertedData = Object.keys(statisticTopic).map(key => ({
    id: key,
    ...statisticTopic[key],
  }));
  const renderHeader = () => {
    return (
      <View style={styles.wrapHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnBack}>
          <Image source={Icon.icBack} style={styles.icMenu} />
        </TouchableOpacity>
        <View style={styles.viewTextHeader}>
          <TextNormal
            fontSize={20}
            style={[styles.appName, {textAlign: 'center'}]}>
            Statistics for each topic
          </TextNormal>
        </View>
      </View>
    );
  };

  const renderContent = ({item, index}: {item: any; index: number}) => {
    return (
      <View style={[styles.wrapItemContent, {marginHorizontal: 5}]}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => toggleItem(index)}>
          <TextNormal fontSize={16} style={styles.titleTopicDays}>
            {`Topics ${index + 1}`}
          </TextNormal>
          <Image
            source={
              expandedIndices.includes(index) ? Icon.icDrop : Icon.icArrowUp
            }
            style={styles.icMenu}
          />
        </TouchableOpacity>

        {expandedIndices.includes(index) ? (
          <View style={styles.viewSelectItem}>
            <ProgressStatistics
              total={item?.progress?.skipped}
              correct={item?.progress?.correct}
              wrong={item?.progress?.wrong}
              valueCorrect={item?.question?.correct}
              valueWrong={item?.question?.wrong}
              valueTotal={item?.question?.skipped}
              title=""
              isShowTotal
            />

            <View style={styles.viewCircularProgress}>
              <TouchableOpacity
                style={styles.wrapItem}
                // onPress={() => navigation.navigate('Questions')}
              >
                <CircularProgress
                  value={item?.statistics?.pass_rate || 0}
                  radius={26}
                  activeStrokeWidth={10}
                  progressValueColor={Colors.primaryMain}
                  inActiveStrokeColor="#E6F6FF"
                  activeStrokeColor={Colors.primaryMain}
                  valueSuffix={'%'}
                />
                <TextNormal fontSize={12} style={styles.txtAVGPass}>
                  Pass rate
                </TextNormal>
              </TouchableOpacity>

              <View style={styles.lineBorder} />

              <TouchableOpacity
                style={styles.wrapItem}
                // onPress={() => navigation.navigate('Questions')}
              >
                <CircularProgress
                  value={item?.statistics?.community_avg_pass || 0}
                  radius={26}
                  activeStrokeWidth={10}
                  progressValueColor={Colors.primaryMain}
                  inActiveStrokeColor="#E6F6FF"
                  activeStrokeColor={Colors.primaryMain}
                  valueSuffix={'%'}
                />
                <TextNormal fontSize={12} style={styles.txtAVGPass}>
                  Community AVG pass
                </TextNormal>
              </TouchableOpacity>
            </View>

            <View style={styles.viewCircularProgress}>
              <View style={styles.wrapItem}>
                <TextNormal fontSize={16} style={styles.stylesTimeQuestion}>
                  {item?.statistics?.time || '0ms'}
                </TextNormal>
                <TextNormal fontSize={12} style={{color: '#6D6B7A'}}>
                  /question
                </TextNormal>
                <TextNormal fontSize={12} style={styles.txtAVGPass}>
                  Your time
                </TextNormal>
              </View>

              <View style={styles.lineBorder} />

              <View style={styles.wrapItem}>
                <TextNormal fontSize={16} style={styles.stylesTimeQuestion}>
                  {item?.statistics?.time || '0ms'}
                </TextNormal>
                <TextNormal fontSize={12} style={{color: '#6D6B7A'}}>
                  /question
                </TextNormal>
                <TextNormal fontSize={12} style={styles.txtAVGPass}>
                  Community AVG pass
                </TextNormal>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  const renderItemTopics = () => {
    return (
      <View style={[styles.wrapContent, {alignItems: 'center'}]}>
        <FlatList
          data={convertedData}
          renderItem={({item, index}) => renderContent({item, index})}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => {
            return <View style={{height: 30}} />;
          }}
        />
      </View>
    );
  };

  return (
    <LinearGradientView>
      {hasNotch ? (
        <View style={{height: 34, width: '100%'}} />
      ) : (
        <View style={{height: 16, width: '100%'}} />
      )}
      <LoadingModal visible={loading} />
      {renderHeader()}
      {renderItemTopics()}
    </LinearGradientView>
  );
};

export default DetailTopic;
