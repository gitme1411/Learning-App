import LottieView from 'lottie-react-native';
import React from 'react';
import {Modal, View, ActivityIndicator, TextInput} from 'react-native';

interface LoadingModalProps {
  visible: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({visible}) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 99,
        }}>
        {/* <ActivityIndicator size="large" color="#000" /> */}
        <LottieView
          style={{width: 64, height: 64}}
          source={require('@/assets/animation/loading3.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};

export default LoadingModal;
