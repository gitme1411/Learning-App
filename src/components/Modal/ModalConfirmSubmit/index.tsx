import {View, TouchableOpacity, Modal} from 'react-native';
import React from 'react';
import {Colors} from '../../../theme';
import LinearGradient from 'react-native-linear-gradient';
import TextNormal from '../../Text';

type PropsModalConfirm = {
  modalVisible: boolean;
  onSubmit: () => void;
  onClose: () => void;
  numAns: number;
  numQues: number;
  isCustomQuestion?: boolean;
};

const ModalConfirmSubmit = ({
  onClose,
  onSubmit,
  modalVisible,
  numAns,
  numQues,
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
            width: 314,
            height: 184,
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 14,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TextNormal fontSize={18} style={{fontWeight: '600'}}>
            Confirm
          </TextNormal>
          <TextNormal fontSize={15} style={{marginTop: 4, textAlign: 'center'}}>
            {isCustomQuestion
              ? `You answered ${numAns} of ${numQues} question \non this test`
              : `You answered ${numAns} of ${numQues} question \non this test \nYour progress won’t be saved!`}
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
                  Review
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
                  Submit
                </TextNormal>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ModalConfirmSubmit;
