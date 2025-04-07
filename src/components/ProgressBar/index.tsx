import React, {FunctionComponent, useEffect} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

const {width} = Dimensions.get('screen');

const ProgressBar: FunctionComponent<{widthPct: number}> = ({widthPct}) => {
  const barWidth = React.useRef(new Animated.Value(10)).current;

  const finalWidth = (width * widthPct) / 10;

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: finalWidth,
      useNativeDriver: false,
      delay: widthPct * 120,
    }).start();
  }, []);

  return (
    <View style={[style.barContainer]}>
      <Animated.View style={[style.progressBar, {width: barWidth}]} />
    </View>
  );
};

const style = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
  },
  barContainer: {
    height: 10,
    width: '49%',

    borderRadius: 30,
    justifyContent: 'center',
    backgroundColor: '#D8D6DD',
  },
  progressBar: {
    backgroundColor: '#04B3F9',
    height: 10,
    borderRadius: 15,
  },
});

export default ProgressBar;
