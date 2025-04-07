import {Text, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../../components/Text';

const Splash = () => {
  return (
    <View>
      <TextNormal fontSize={16}>Splash </TextNormal>
    </View>
  );
};

export default Splash;
