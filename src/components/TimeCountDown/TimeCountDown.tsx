import {AppState, Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import Countdown from 'react-native-countdown-component';
import {Icon} from '../../utils/icon';
import Icons from '../Icon';
import {styles} from './styles';

type PropsTime = {
  untilTime?: number;
  onFinish?: () => void;
};

const TimeCountDown = ({untilTime, onFinish}: PropsTime) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icons icon={Icon.icTimer} size={24} />
        <Countdown
          until={untilTime} //3600 la 1h
          onFinish={onFinish}
          size={15}
          digitStyle={{
            backgroundColor: '#FFF',
          }}
          digitTxtStyle={{color: '#0B9FF1'}}
          timeToShow={['H', 'M', 'S']}
          separatorStyle={{color: '#0B9FF1'}}
          timeLabelStyle={{color: '#0B9FF1', fontWeight: 'bold'}}
          timeLabels={{h: '', m: '', s: ''}}
          showSeparator
          style={styles.stylesCountDown}
        />
      </View>
    </View>
  );
};

export default TimeCountDown;
