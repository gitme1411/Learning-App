import {View, Text, TouchableOpacity, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './styles';

import Icons from '../Icon';
import ProgressBar from '../ProgressBar';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
type Props = {
  onPress: () => void;
  text?: string;
  hideButton?: boolean;
  stylesText?: any;
  colorText?: String;
  onPressSkip: () => void;
  progress?: any;
  fontSize?: any;
};
const HeaderBackSkip = ({
  onPress,
  onPressSkip,
  stylesText,
  text,
  hideButton,
  progress,
  fontSize,
  ...props
}: Props) => {
  const [hideButtonBack, setButton] = useState(false);

  return (
    <View style={styles.viewHeader}>
      {hideButtonBack === hideButton ? (
        <TouchableOpacity onPress={onPress} {...props}>
          <Icons
            icon={require('../../assets/images/arrow-left.png')}
            size={24}
          />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}

      <ProgressBar widthPct={progress} />

      {/* <View style={styles.container}>
        <Animated.View style={[styles.bar, {width: progressPercent}]} />
      </View> */}
      {text ? (
        <TouchableOpacity onPress={onPressSkip}>
          <TextNormal fontSize={fontSize} style={stylesText}>
            {text}
          </TextNormal>
        </TouchableOpacity>
      ) : (
        <View style={styles.viewNone}></View>
      )}
    </View>
  );
};

export default HeaderBackSkip;
