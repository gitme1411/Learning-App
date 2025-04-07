import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import {styles} from './styles';
import {Colors} from '../../theme';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';

type Props = {
  title: string;
  value: number;
  onPress: () => void;
  radius: number;
};

const ItemHome = ({title, value, onPress, radius}: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <CircularProgress
        value={parseFloat(value.toString()) || 0}
        radius={radius}
        activeStrokeWidth={12}
        progressValueColor={Colors.primaryMain}
        inActiveStrokeColor={Colors.blurMain}
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
        // title={'KM/H'}
      />
      <TextNormal fontSize={14} style={styles.txt}>
        {title}
      </TextNormal>
    </TouchableOpacity>
  );
};

export default ItemHome;
