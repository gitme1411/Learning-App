import TextNormal from '@/components/Text';
import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ModalSync: React.FC<ModalProps> = ({isVisible, onClose}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.2}
      useNativeDriver={true}
      style={styles.modalContainer}>
      <View style={styles.content}>
        <TextNormal fontSize={16} style={{fontWeight: 'bold'}}>
          Syncing data...
        </TextNormal>
        <LottieView
          style={{width: 120, height: 120}}
          source={require('@/assets/animation/sync.json')}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: moderateScale(280),
    height: moderateScale(200),
    alignItems: 'center',
    shadowColor: '#D3D3D3',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: 'center',
  },
  questionButton: {
    width: moderateScale(52),
    height: moderateScale(40),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  active: {
    backgroundColor: 'white',
    borderColor: '#D3D3D3',
  },
  inactive: {
    backgroundColor: '#F0F0F0',
    borderColor: '#D3D3D3',
  },
  selected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  activeText: {
    color: 'black',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#A9A9A9',
  },
  selectedText: {
    color: 'white', // White text for selected item
    fontWeight: 'bold',
  },
});

export default ModalSync;
