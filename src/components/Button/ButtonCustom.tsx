import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {styles} from './styles';
import LinearGradient from 'react-native-linear-gradient';
import TextNormal from '../Text';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

type Props = {
  onPressNext?: () => void;
  text?: string;
  styleButton?: any;
  styleText?: any;
  fontSize?: any;
};

const ButtonCustom = ({
  onPressNext,
  text,
  styleButton,
  styleText,
  fontSize,
}: Props) => {
  return (
    <TouchableOpacity style={styleButton} onPress={onPressNext}>
      <TextNormal fontSize={fontSize} style={styleText}>
        {text}
      </TextNormal>
    </TouchableOpacity>
  );
};

export default ButtonCustom;
