import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {Colors, timing} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import TextNormal from '../../Text';

type PropsModalConfirm = {
  modalVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
  title: string;
};

const ModalConfirmApp = ({
  onClose,
  onSubmit,
  modalVisible,
  title,
}: PropsModalConfirm) => {
  return (
    <Modal isVisible={modalVisible}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: 310,
            height: 184,
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextNormal
            fontSize={18}
            style={{fontWeight: '600', marginBottom: 12}}>
            Confirm
          </TextNormal>
          <TextNormal fontSize={16} style={{marginTop: 4}}>
            {title}
          </TextNormal>
          <View
            style={{
              marginTop: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
            }}>
            <TouchableOpacity onPress={onClose}>
              <View
                style={{
                  height: 44,
                  width: 126,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 333,
                  borderColor: Colors.primaryMain,
                  borderWidth: 1,
                }}>
                <TextNormal
                  fontSize={16}
                  style={{color: Colors.primaryMain, fontWeight: '500'}}>
                  No
                </TextNormal>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit}>
              <LinearGradient
                colors={['#00C2FF', '#0F90EB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={{
                  height: 44,
                  width: 126,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 333,
                  marginLeft: 12,
                }}>
                <TextNormal
                  fontSize={16}
                  style={{color: '#fff', fontWeight: '500'}}>
                  Yes
                </TextNormal>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirmApp;
