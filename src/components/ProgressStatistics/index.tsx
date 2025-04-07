import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Colors, fullWidth} from '../../theme';
import ProgressComponent from './ProgressComponent';
import {moderateScale, scale} from 'react-native-size-matters';
import {RootState} from '../../store';
import {useSelector} from 'react-redux';
import TextNormal from '../Text';

type Props = {
  correct: number;
  wrong: number;
  total: number;
  title: string;
  isShowTotal: boolean;
  valueCorrect: number;
  valueWrong: number;
  valueTotal: number;
};

const ProgressStatistics = ({
  correct,
  wrong,
  total,
  title,
  isShowTotal,
  valueCorrect,
  valueWrong,
  valueTotal,
}: Props) => {
  return (
    <View style={styles.container}>
      <ProgressComponent total={total} correct={correct} wrong={wrong} />
      <View style={styles.wrapInfo}>
        <View style={styles.wrapCorrect}>
          <View style={styles.green}></View>
          <TextNormal fontSize={11} style={styles.correct}>
            {valueCorrect} Correct
          </TextNormal>
        </View>
        <View style={styles.wrapWrong}>
          <View style={styles.red}></View>
          <TextNormal fontSize={11} style={styles.wrong}>
            {valueWrong} Wrong
          </TextNormal>
        </View>
        <View style={styles.wrapNot}>
          <View style={styles.gray}></View>
          <TextNormal fontSize={11} style={styles.not}>
            {valueTotal} Not answered
          </TextNormal>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: fullWidth - moderateScale(48),
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: moderateScale(14),
    paddingVertical: 8,
    justifyContent: 'center',
    // alignItems: "center"
  },
  wrapTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: '#242424',
  },
  total: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    color: Colors.primaryMain,
  },
  wrapLine: {
    width: fullWidth - 56,
    backgroundColor: '#D8D6DD',
    height: 16,
    flexDirection: 'row',
    borderRadius: 16,
    marginVertical: 16,
  },
  wrapInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: moderateScale(12),
    paddingHorizontal: moderateScale(12),
  },
  wrapCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  green: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#34C759',
  },
  correct: {
    fontSize: moderateScale(11),
    color: '#34C759',
    marginLeft: 6,
  },
  wrapWrong: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  red: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#F5574E',
  },
  wrong: {
    fontSize: moderateScale(11),
    color: '#F5574E',
    marginLeft: 6,
  },
  wrapNot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gray: {
    width: 12,
    height: 12,
    borderRadius: 12,
    backgroundColor: '#D8D6DD',
  },
  not: {
    fontSize: moderateScale(11),
    color: '#242424',
    marginLeft: 6,
  },
});

export default ProgressStatistics;
