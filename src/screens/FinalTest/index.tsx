import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import React from 'react';
import {Colors, fullWidth} from '../../theme';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {moderateScale} from 'react-native-size-matters';
import TodayPlan from '../../components/TodayPlan';
import TextNormal from '@/components/Text';
import {useFocusEffect} from '@react-navigation/native';
import {
  getFinalTest,
  getTodayPlanFinalTest,
} from '@/services/api/api';
import {
  setDataLocalFinalTest,
  setDataProgressFinalTest,
} from '@/store/finalTest';

const FinalTest = ({navigation}: any) => {
  const dispatch = useDispatch();
  const dataFinalTest = useSelector(
    (state: RootState) => state.finalTest.dataFinalTest,
  );
  const dataProgress = useSelector(
    (state: RootState) => state.finalTest.dataProgress,
  );
  const token = useSelector((state: RootState) => state.auth.token);

  const numberFinalTestTodayPlan = useSelector(
    (state: RootState) => state.config.numberFinalTestTodayPlan,
  );
  const numberFailFinalTestTodayPlan = useSelector(
    (state: RootState) => state.config.numberFailFinalTestTodayPlan,
  );

  useFocusEffect(
    React.useCallback(() => {
      if (token) {
        getDataTodayPlan();
        getDataFinalTest();
      }
    }, []),
  );

  const getDataFinalTest = async () => {
    const res = await getFinalTest(0);
    if (res?.error === 0) {
      let finalTest = dataFinalTest.map((item: any) => {
        let part = res?.res?.find((data: any) => data.id === item.id);
        return {
          ...item,
          percentPass: part?.progress,
        };
      });
      dispatch(setDataLocalFinalTest(finalTest));
    }
  };

  const getDataTodayPlan = async () => {
    const res = await getTodayPlanFinalTest();
    if (res && res.res) {
      dispatch(
        setDataProgressFinalTest({
          q_wrong: res.res.false_question,
          q_correct: res.res.true_question,
          target_questions: res.res.total_question,
        }),
      );
    }
  };

  const renderItem = (item: any) => {
    return (
      <TouchableOpacity
        style={styles.wrapItem}
        onPress={() => navigation.navigate('QuestionTest', {itemTest: item})}>
        <CircularProgress
          value={item.percentPass || 0}
          radius={moderateScale(28)}
          activeStrokeWidth={10}
          progressValueColor={
            item.is_passed ? Colors.baseBold : Colors.colorTextHeaderForm
          }
          inActiveStrokeColor="#E6F6FF"
          activeStrokeColor={Colors.primaryMain}
          valueSuffix={'%'}
          title={
            item.is_passed ? 'Pass' : item.percentPass === null ? '' : 'Fail'
          }
          titleStyle={{
            fontSize: 11,
            color: item.is_passed
              ? Colors.baseBold
              : Colors.colorTextHeaderForm,
          }}
          progressValueStyle={{
            height: 18,
          }}
          progressValueFontSize={13}
          valueSuffixStyle={{
            fontSize: 11,
            color: item.is_passed
              ? Colors.baseBold
              : Colors.colorTextHeaderForm,
            paddingTop: Platform.OS === 'android' ? 1 : 2,
          }}
        />
        <TextNormal fontSize={14} style={{marginLeft: moderateScale(8)}}>
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
          title="Final Test"
          showBtnRight={false}
        />
        {/* {renderTodayPlan()} */}
        <TodayPlan
          dataPass={numberFinalTestTodayPlan}
          dataFail={numberFailFinalTestTodayPlan}
          dataProgress={dataProgress}
        />
        <View style={styles.wrapList}>
          {dataFinalTest && (
            <FlatList
              style={{marginTop: 16}}
              data={dataFinalTest}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({item}) => renderItem(item)}
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
    width: fullWidth * 0.5 - 24,
    height: moderateScale(72),
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    height: 16,
    width: '100%',
  },
});

export default FinalTest;
