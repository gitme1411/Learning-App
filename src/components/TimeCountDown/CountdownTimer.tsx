import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {styles} from './styles';
import Icons from '../Icon';
import {Icon} from '../../utils/icon';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';

interface TimeCountDownProps {
  initialTime: number;
  onFinish?: () => void;
}

const CountdownTimer: React.FC<TimeCountDownProps> = ({
  initialTime,
  onFinish,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onFinish) {
        onFinish();
      }
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, onFinish]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}  :  ${mins
      .toString()
      .padStart(2, '0')}  :  ${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icons icon={Icon.icTimer} size={24} />
        <TextNormal fontSize={15} style={styles.textTime}>
          {formatTime(timeLeft)}
        </TextNormal>
      </View>
    </View>
  );
};

export default CountdownTimer;
