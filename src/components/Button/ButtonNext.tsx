import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';

type Props = {
  onPressNext?: () => void;
  text?: string;
};

const ButtonNext = ({onPressNext, text}: Props) => {
  return (
    <LinearGradient
      colors={['#00C2FF', '#0F90EB']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={[{borderRadius: 333, marginBottom: 15}, styles.buttonNext]}>
      <TouchableOpacity style={styles.buttonNext} onPress={onPressNext}>
        <TextNormal fontSize={14} style={styles.txtNext}>
          {text}
        </TextNormal>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default ButtonNext;
