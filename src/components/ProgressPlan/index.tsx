import {StyleSheet, View} from 'react-native';
import React, {memo} from 'react';
import {Colors, fullWidth} from '../../theme';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../Text';

type Props = {
  correct: number;
  wrong: number;
  total: number;
  title: string;
  isShowTotal?: boolean;
};

const ProgressPlan = memo(
  ({correct, wrong, total, title, isShowTotal}: Props) => {
    let sum = correct + wrong;
    let check = sum >= total;
    let sumWidth = correct / (check ? sum : total);
    let sumWidthWrong = wrong / (check ? sum : total);
    return (
      <View style={styles.container}>
        <View style={styles.wrapTitle}>
          <TextNormal fontSize={16} style={styles.txt}>
            {title}
          </TextNormal>
          {!isShowTotal ? (
            <TextNormal fontSize={16} style={styles.total}>
              {correct + wrong} / {total}
            </TextNormal>
          ) : null}
        </View>
        <View style={styles.wrapLine}>
          <View
            style={{
              backgroundColor: '#34C759',
              width: (sumWidth || 0) * (fullWidth - 56),
              borderTopLeftRadius: 16,
              borderBottomLeftRadius: 16,
            }}></View>
          {correct == 0 && wrong > 0 ? (
            <View
              style={{
                width: (sumWidthWrong || 0) * (fullWidth - 56),
                backgroundColor: '#F5574E',
                borderTopLeftRadius: 16,
                borderBottomLeftRadius: 16,
              }}></View>
          ) : check ? (
            <View
              style={{
                width: (sumWidthWrong || 0) * (fullWidth - 56),
                backgroundColor: '#F5574E',
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
              }}></View>
          ) : (
            <View
              style={{
                width: (sumWidthWrong || 0) * (fullWidth - 56),
                backgroundColor: '#F5574E',
              }}></View>
          )}
        </View>
        <View style={styles.wrapInfo}>
          <View style={styles.wrapCorrect}>
            <View style={styles.green}></View>
            <TextNormal fontSize={11} style={styles.correct}>
              {correct} Correct
            </TextNormal>
          </View>
          <View style={styles.wrapWrong}>
            <View style={styles.red}></View>
            <TextNormal fontSize={11} style={styles.wrong}>
              {wrong} Wrong
            </TextNormal>
          </View>
          <View style={styles.wrapNot}>
            <View style={styles.gray}></View>
            <TextNormal fontSize={11} style={styles.not}>
              {check ? 0 : total - (correct + wrong)} Not answered
            </TextNormal>
          </View>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.correct === nextProps.correct;
  },
);

const styles = StyleSheet.create({
  container: {
    width: fullWidth - 32,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    paddingHorizontal: 12,
    paddingVertical: moderateScale(8),
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
    height: moderateScale(16),
    flexDirection: 'row',
    borderRadius: 16,
    marginVertical: moderateScale(16),
  },
  wrapInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
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
    marginLeft: 18,
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
    marginLeft: 18,
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

export default ProgressPlan;
