import React from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
type Props = {
  label: string;
  onPress: () => void;
};
const BtnLinear = ({label, onPress}: Props) => {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress}>
      <LinearGradient
        colors={['#53E88B', '#15BE77']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{borderRadius: 15}}>
        <TextNormal fontSize={16} style={styles.txt}>
          {label}
        </TextNormal>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: moderateScale(16),
    color: '#fff',
    margin: 12,
    marginHorizontal: 36,
    fontWeight: 'bold',
  },
});

export default BtnLinear;
