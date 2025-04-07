import {View, TouchableOpacity, Modal} from 'react-native';
import React from 'react';
import {Colors} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import TextNormal from '../../Text';

type PropsModalConfirm = {
  modalVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
  isCustomQuestion?: boolean;
};

const ModalConfirm = ({
  onClose,
  onSubmit,
  modalVisible,
  isCustomQuestion,
}: PropsModalConfirm) => {
  return (
    <Modal visible={modalVisible} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#00000050',
        }}>
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
            style={{fontSize: 18, fontWeight: '600', marginBottom: 12}}>
            Confirm
          </TextNormal>
          <TextNormal
            fontSize={16}
            style={{marginTop: 4}}>
            {isCustomQuestion
              ? 'Are you sure to exit this test?'
              : 'Exit this test will not be saved in the process.'}
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

export default ModalConfirm;
