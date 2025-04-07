import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Colors, timing} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import TextNormal from '@/components/Text';

type PropsModalNormal = {
  modalVisible: boolean;
  onSubmit: () => void;
  onClose?: () => void;
  title: string;
  textSubmit: string;
  textClose?: string;
  textContent: string;
};

const ModalNormal = ({
  onClose,
  onSubmit,
  modalVisible,
  title,
  textSubmit,
  textClose,
  textContent,
}: PropsModalNormal) => {
  return (
    <Modal isVisible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextNormal
            fontSize={18}
            style={{fontWeight: '600', marginBottom: 8}}>
            {title}
          </TextNormal>
          <TextNormal fontSize={16} style={{marginTop: 2, marginBottom: 8}}>
            {textContent}
          </TextNormal>
          <View style={styles.viewButton}>
            {textClose && (
              <TouchableOpacity onPress={onClose}>
                <View style={styles.buttonClose}>
                  <TextNormal
                    fontSize={16}
                    style={{color: Colors.primaryMain, fontWeight: '500'}}>
                    {textClose}
                  </TextNormal>
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onSubmit}>
              <LinearGradient
                colors={['#00C2FF', '#0F90EB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.buttonSubmit}>
                <TextNormal
                  fontSize={16}
                  style={{color: '#fff', fontWeight: '500'}}>
                  {textSubmit}
                </TextNormal>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 310,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonClose: {
    height: 40,
    width: 126,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 333,
    borderColor: Colors.primaryMain,
    borderWidth: 1,
  },
  buttonSubmit: {
    height: 40,
    width: 126,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 333,
    marginLeft: 12,
  },
  viewButton: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
});

export default ModalNormal;
