import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale, moderateScale} from 'react-native-size-matters';
import {fullWidth} from '../../theme';

interface ProgressBarProps {
  total: number;
  correct: number;
  wrong: number;
}

const ProgressComponent: React.FC<ProgressBarProps> = ({
  total,
  correct,
  wrong,
}) => {
  const correctPercentage = (correct / total) * 100;
  const wrongPercentage = (wrong / total) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.correctBar, {width: `${correctPercentage}%`}]} />
      <View style={[styles.wrongBar, {width: `${wrongPercentage}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    height: scale(16),
    backgroundColor: '#d3d3d3',
    borderRadius: moderateScale(10),
    overflow: 'hidden',
  },
  correctBar: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  wrongBar: {
    height: '100%',
    backgroundColor: '#f44336',
  },
});

export default ProgressComponent;
