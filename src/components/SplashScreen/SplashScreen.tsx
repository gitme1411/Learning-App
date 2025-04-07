import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {moderateScale} from 'react-native-size-matters';
import LottieView from 'lottie-react-native';

const SplashScreenComponent = ({loading}: {loading: boolean}) => {
  const opacity = useSharedValue(0);
  useEffect(() => {
    SplashScreen.hide();

    // Tạo animation fade-in
    opacity.value = withTiming(1, {
      duration: 2000, // Thời gian cho hiệu ứng fade-in (2 giây)
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });
  console.log('loading', loading);
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/splash_screen.png')}
        style={styles.image}
      />
      <Animated.Text style={[styles.text, animatedStyle]}>
        AU Test 2024
      </Animated.Text>
      {loading && (
        <View style={styles.viewLoading}>
          <LottieView
            style={{width: 56, height: 56}}
            source={require('@/assets/animation/loading3.json')}
            autoPlay
            loop
          />
          <Animated.Text style={[styles.textLoading, animatedStyle]}>
            Loading Data ...
          </Animated.Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Đặt nội dung (chữ) vào giữa theo chiều dọc
    alignItems: 'center', // Đặt nội dung (chữ) vào giữa theo chiều ngang
    backgroundColor: '#ffffff',
  },
  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: moderateScale(24),
    color: '#ffffff',
  },
  textLoading: {
    fontSize: moderateScale(15),
    color: '#ffffff',
  },
  viewLoading: {
    justifyContent: 'center', // Đặt nội dung (chữ) vào giữa theo chiều dọc
    alignItems: 'center', // Đặt nội dung (chữ) vào giữa theo chiều ngang
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 48,
  },
});

export default SplashScreenComponent;
