import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
type Props = {
  label?: string;
  onPress?: () => void;
  color1?: number;
  color2?: number;
  styleButton?: any;
  styleText?: any;
  fontSize?: any;
};
const ButtonLinearProps = ({
  label,
  onPress,
  styleButton,
  styleText,
  fontSize,
}: Props) => {
  return (
    <LinearGradient
      colors={['#FFD265', '#FFB400']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{borderRadius: 333}}>
      <TouchableOpacity style={styleButton} onPress={onPress}>
        <TextNormal fontSize={fontSize} style={styleText}>
          {label}
        </TextNormal>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: moderateScale(14),
    color: '#242424',
    fontWeight: '600',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
});

export default ButtonLinearProps;
