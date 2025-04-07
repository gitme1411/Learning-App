import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import ButtonNext from '../../Button/ButtonNext';
import {styles} from '../../../screens/Home/styles';
import {Colors, fullHeight} from '../../../theme';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {Controller} from 'react-hook-form';
import Icon from '../../Icon';
import LoadingModal from '../../Loading';
import {TextInput} from 'react-native-gesture-handler';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import TextNormal from '../../Text';
import Pdf from 'react-native-pdf';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import WebView from 'react-native-webview';
type Props = {
  onSwipeCompleteSignUp: () => void;
  onSwipeCompleteOtpCode: () => void;
  onSignUp: () => void;
  onVerifyCode: () => void;
  onBack: () => void;
  onReSendCode: () => void;
  onKeyDismiss: () => void;
  isShowSignUp: boolean;
  isShowOptCode: boolean;
  control: any;
  errors: any;
  nameEmail: any;
  nameVeryCode: string;
  validation: boolean;
  loading: boolean;
  txtEmail: string;
};

const ModalSignUp = ({
  onSwipeCompleteSignUp,
  onSwipeCompleteOtpCode,
  onSignUp,
  onVerifyCode,
  onBack,
  onReSendCode,
  onKeyDismiss,
  isShowOptCode,
  isShowSignUp,
  control,
  errors,
  validation,
  nameEmail,
  nameVeryCode,
  loading,
  txtEmail,
}: Props) => {
  const CELL_COUNT = 6;
  const [value, setValue] = useState('');
  const [loadingPrivacy, setLoadingPrivacy] = useState(false);
  const [isModalPrivacyVisible, setModalPrivacyVisible] = useState(false);
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const sourcePrivacy = {
    uri: 'https://www.jamesedutech.net/Privacy-Policy-AuTest.pdf',
    cache: true,
  };

  const _renderModalOtpCode = () => {
    return (
      <Modal
        swipeDirection={'down'}
        animationIn="slideInUp"
        animationInTiming={900}
        animationOut="slideOutRight"
        isVisible={isShowOptCode}
        hideModalContentWhileAnimating={true}
        onSwipeComplete={onSwipeCompleteOtpCode}
        style={styles.modalStyle}>
        <LoadingModal visible={loading} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1, justifyContent: 'flex-end'}}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
          <TouchableWithoutFeedback onPress={onKeyDismiss}>
            <View style={styles.viewModalContainer}>
              <Image source={require('../../../assets/images/line.png')} />
              <View style={styles.viewHeaderVerifyCode}>
                <TouchableOpacity onPress={onBack}>
                  <Icon
                    icon={require('../../../assets/images/arrow-left.png')}
                    size={moderateScale(24)}
                  />
                </TouchableOpacity>

                <TextNormal fontSize={20} style={[styles.txtTitleSignUp]}>
                  {'Sign in Account'}
                </TextNormal>
              </View>

              <TextNormal fontSize={14} style={[styles.txtContentSignUp]}>
                {'Please enter the confirmation code sent to email'}
              </TextNormal>
              <TextNormal fontSize={14} style={styles.txtParamEmail}>
                {txtEmail}
              </TextNormal>

              <View style={{marginBottom: 12}}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  name={nameVeryCode}
                  render={({field: {onChange, onBlur, value}}) => (
                    <CodeField
                      ref={ref}
                      onBlur={onBlur}
                      value={value}
                      onChangeText={onChange}
                      cellCount={CELL_COUNT}
                      inputMode="numeric"
                      rootStyle={styles.codeFieldRoot}
                      keyboardType="number-pad"
                      textContentType="oneTimeCode"
                      renderCell={({index, symbol, isFocused}) => (
                        <TextNormal
                          fontSize={24}
                          key={index}
                          style={[
                            styles.cell,
                            errors.verifyCode && styles.focusCell,
                          ]}
                          onLayout={getCellOnLayoutHandler(index)}>
                          {symbol ||
                            (isFocused ? (
                              <Cursor />
                            ) : (
                              <TextNormal fontSize={16}>-</TextNormal>
                            ))}
                        </TextNormal>
                      )}
                    />
                  )}
                />
                {errors.verifyCode && (
                  <TextNormal fontSize={14} style={styles.txtError}>
                    {'The authentication code is incorrect!'}
                  </TextNormal>
                )}
              </View>

              <ButtonNext onPressNext={onVerifyCode} text="Verify" />
              <View style={styles.viewTextBottom}>
                <TextNormal fontSize={14} style={styles.txtBuySignIn}>
                  {"Haven't received verification code."}
                </TextNormal>
                <TouchableOpacity onPress={onReSendCode}>
                  <TextNormal
                    fontSize={14}
                    dataDetectorType={'link'}
                    style={styles.txtUnderline}>
                    {'Send to'}
                  </TextNormal>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  const renderModalPrivacy = () => {
    return (
      <Modal isVisible={isModalPrivacyVisible} style={{padding: 0, margin: 0}}>
        <View style={{flex: 1}}>
          <View
            style={{
              height: 0.89 * fullHeight,
              width: '100%',
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingVertical: 12,
            }}>
            <WebView
              style={{
                flex: 1,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
              onLoadStart={() => setLoadingPrivacy(true)}
              onLoadEnd={() => setLoadingPrivacy(false)}
              source={{uri: 'https://jamesedutech.net/privacy'}}
            />
            {loadingPrivacy && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <LottieView
                  style={{width: 64, height: 64}}
                  source={require('@/assets/animation/loading3.json')}
                  autoPlay
                  loop
                />
              </View>
            )}

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity onPress={() => setModalPrivacyVisible(false)}>
                <LinearGradient
                  colors={['#00C2FF', '#0F90EB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    height: 44,
                    width: 150,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 333,
                    marginLeft: 12,
                  }}>
                  <TextNormal
                    fontSize={14}
                    style={{color: '#fff', fontWeight: '500'}}>
                    Close
                  </TextNormal>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      swipeDirection={'down'}
      animationIn="slideInUp"
      animationOut="slideOutUp"
      isVisible={isShowSignUp}
      hideModalContentWhileAnimating={true}
      onSwipeComplete={onSwipeCompleteSignUp}
      onBackdropPress={() => {
        Keyboard.dismiss();
      }}
      style={styles.modalStyle}>
      <LoadingModal visible={loading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1, justifyContent: 'flex-end'}}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.viewModalContainer}>
            <Image source={require('../../../assets/images/line.png')} />
            <TextNormal
              fontSize={20}
              style={[styles.txtTitleSignUp, {marginVertical: 12, padding: 8}]}>
              {'Sign in Account'}
            </TextNormal>
            <TextNormal fontSize={14} style={styles.txtContentSignUp}>
              {
                'Signing in with email saves your progress, and you can use your account with any device.'
              }
            </TextNormal>

            <View style={{marginVertical: 16}}>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                name={nameEmail}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    onBlur={onBlur}
                    style={styles.textinput}
                    value={value}
                    onChangeText={onChange}
                    placeholder={'Type your email'}
                    placeholderTextColor="#6D6B7A"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
                defaultValue=""
              />
              {validation ? (
                <TextNormal fontSize={14} style={styles.txtError}>
                  {'Email invalidate!'}
                </TextNormal>
              ) : (
                errors.email && (
                  <TextNormal fontSize={14} style={styles.txtError}>
                    {' Please enter your Email!'}
                  </TextNormal>
                )
              )}
            </View>

            <ButtonNext onPressNext={onSignUp} text="Submit" />
            <View style={styles.viewTextBottom}>
              <TextNormal fontSize={14} style={styles.txtBuySignIn}>
                {'By signing in, you accept our terms.'}
              </TextNormal>
              <TouchableOpacity onPress={() => setModalPrivacyVisible(true)}>
                <TextNormal
                  fontSize={14}
                  dataDetectorType={'link'}
                  style={styles.txtUnderline}>
                  {'Privacy policy'}
                </TextNormal>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      {_renderModalOtpCode()}
      {renderModalPrivacy()}
    </Modal>
  );
};

export default ModalSignUp;
