import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import {Colors, fullWidth, shadow} from '../../theme';
import {Icon} from '../../utils/icon';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';
import LinearGradient from 'react-native-linear-gradient';
import ModalNormal from '@/components/Modal/ModalNormal';
import {useDispatch, useSelector} from 'react-redux';
import {setIsWaitRemoveAccount} from '@/store/config';
import {RootState} from '@/store';
import {removeAccount} from '@/services/api/api';

const DeleteAccount = ({route, navigation}: any) => {
  const [isModalSubmit, setIsModalSubmit] = useState(false);
  const dispatch = useDispatch();
  const isWaitRemoveAccount = useSelector(
    (state: RootState) => state.config.isWaitRemoveAccount,
  );
  const onClose = () => {
    setIsModalSubmit(false);
  };

  const onOpen = () => {
    setIsModalSubmit(true);
  };
  const onDeleteAccount = async () => {
    await removeAccount();
    setIsModalSubmit(false);
    dispatch(setIsWaitRemoveAccount(true));
  };
  return (
    <LinearGradientView>
      <Header
        title={'Delete Account'}
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
      {isWaitRemoveAccount ? (
        <View style={styles.wrapList}>
          <TextNormal
            style={{lineHeight: 26, textAlign: 'center', marginBottom: 12}}
            fontSize={20}>
            Check your email
          </TextNormal>
          <TextNormal style={{lineHeight: 26}} fontSize={16}>
            Check your email You will soon receive an email confirming the
            request. If you change your mind, please ignore this email and keep
            studying!
          </TextNormal>
        </View>
      ) : (
        <View style={styles.wrapList}>
          <TextNormal style={{lineHeight: 26}} fontSize={16}>
            Press the delete account button to delete your 2024 Au Citizenship
            Test account and all your personal data on our system. You will lose
            all data about your learning process as well as achievements. Once
            you're done deleting, you won't be able to undo it. Please note:
            account deletion does NOT mean the cancellation of your current 2024
            Au Citizenship Test subscription. Please cancel your subscription on
            Apple Store
          </TextNormal>

          <TouchableOpacity
            style={{position: 'absolute', bottom: moderateScale(28), left: 24}}
            onPress={onOpen}>
            <LinearGradient
              colors={['#00C2FF', '#0F90EB']}
              start={{x: 1, y: 0}}
              end={{x: 0, y: 0}}
              style={{
                height: 44,
                width: fullWidth - 48,
                borderRadius: 333,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TextNormal
                fontSize={14}
                style={{
                  color: '#fff',
                  fontWeight: '600',
                }}>
                Delete Account
              </TextNormal>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      <ModalNormal
        modalVisible={isModalSubmit}
        onClose={onClose}
        onSubmit={onDeleteAccount}
        title="Delete Account"
        textContent="Do you want to delete your account?"
        textClose="Cancel"
        textSubmit="Delete"
      />
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
  wrapList: {
    marginTop: 16,
    flex: 1,
    backgroundColor: '#fbfbfb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  wrapItem: {
    width: (fullWidth - 72) * 0.5,
    height: 154,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blurMain,
    borderRadius: 16,
    ...shadow,
  },
  wrapIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.primaryMain,
    borderWidth: 8,
  },
  title: {
    color: Colors.mainText,
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginTop: 12,
  },
  wrapContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fbfbfb',
    marginTop: 16,
    padding: 16,
  },
  wrapItemContent: {
    width: (fullWidth - 58) * 0.5,
    height: 154,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 30,
    shadowRadius: 3.84,
    elevation: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: Colors.mainText,
    fontWeight: '400',
    fontSize: moderateScale(14),
    marginTop: 12,
  },
  wrapIconNote: {
    height: 90,
    width: 90,
    borderWidth: 7,
    borderRadius: 180,
    borderColor: '#E6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapTarget: {
    width: fullWidth - 32,
    marginTop: 12,
    borderRadius: 16,
    height: 56,
    backgroundColor: '#fff',
    marginLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  wrapTxtTarget: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTarget: {
    color: Colors.mainText,
    fontWeight: '600',
    fontSize: moderateScale(16),
    marginLeft: 12,
  },
  number: {
    color: '#34C759',
    fontWeight: '700',
    fontSize: moderateScale(18),
  },
});

export default DeleteAccount;
