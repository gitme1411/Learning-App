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
import ProgressStatistics from '../../components/ProgressStatistics';
import {
  getDaysDetailReport,
  getFinalTestDetailReport,
  getPracticeDetailReport,
} from '../../services/api/api';
import LoadingModal from '../../components/Loading';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';

type ItemProps = {
  route: any;
  navigation: any;
};

const DetailDays: React.FC<ItemProps> = ({route, navigation}) => {
  let hasNotch = DeviceInfo.hasNotch();
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [statisticDays, setStatisticDays] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const convertedData = Object.keys(statisticDays).map(key => ({
    id: key,
    ...statisticDays[key],
  }));

  const keyScreen = route?.params.key;

  useEffect(() => {
    const callApi = async () => {
      let data: any;
      if (keyScreen == 'DaysTopic') {
        data = await getDaysDetailReport();
      } else if (keyScreen == 'DaysStandard') {
        data = await getPracticeDetailReport();
      } else if (keyScreen == 'DaysFinal') {
        data = await getFinalTestDetailReport();
      }
      setTimeout(() => {
        if (data?.error === 0 && Object.keys(data?.res?.report).length !== 0) {
          setStatisticDays(data?.res?.report);
        } else {
          Alert.alert('Error', 'NO DATA', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Home'),
            },
          ]);
        }
        setLoading(false);
      }, 1500);
    };

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
      <View
        style={[styles.wrapItemContent, {marginHorizontal: moderateScale(5)}]}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => toggleItem(index)}>
          <TextNormal fontSize={16} style={styles.titleTopicDays}>
            {`Days ${index + 1}`}
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
              total={item?.progress.skipped}
              correct={item?.progress?.correct}
              wrong={item?.progress?.wrong}
              valueCorrect={item?.correct}
              valueWrong={item?.wrong}
              valueTotal={item?.skipped}
              title=""
              isShowTotal
            />

            <View style={styles.viewBoxLine}>
              <View style={styles.viewContentValue}>
                <TextNormal fontSize={16} style={styles.valueRedo}>
                  {item?.redo}
                </TextNormal>
                <TextNormal
                  fontSize={12}
                  style={[styles.txtAVGPass, {paddingTop: 0}]}>
                  Redo
                </TextNormal>
              </View>
              <View style={[styles.lineBorder, {height: 24}]} />
              <View style={styles.viewContentValue}>
                <TextNormal fontSize={16} style={styles.valueRefresh}>
                  {item?.refresh}
                </TextNormal>
                <TextNormal
                  fontSize={12}
                  style={[styles.txtAVGPass, {paddingTop: 0}]}>
                  Refresh
                </TextNormal>
              </View>
            </View>
          </View>
        ) : null}
      </View>
    );
  };

  const renderItemDays = () => {
    return (
      <View style={[styles.wrapContent, {alignItems: 'center'}]}>
        <FlatList
          data={convertedData}
          renderItem={({item, index}) => renderContent({item, index})}
          keyExtractor={(item, index) => item.id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{height: 30}} />}
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
      {renderItemDays()}
    </LinearGradientView>
  );
};

export default DetailDays;
