import {ScaledSheet, moderateScale, scale} from 'react-native-size-matters';
import {Colors, fullWidth, shadow} from '../../theme';

export const styles = ScaledSheet.create({
  flexEnd: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  txtTitleSignUp: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.mainText,
    textAlign: 'center',
    width: '90%',
  },
  txtContentSignUp: {
    fontSize: moderateScale(14),
    color: '#6D6B7A',
    fontWeight: '400',
    textAlign: 'center',
  },
  txtParamEmail: {
    fontSize: moderateScale(14),
    color: Colors.mainText,
    fontWeight: '600',
    textAlign: 'center',
    padding: moderateScale(5),
  },
  txtError: {
    color: 'red',
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: moderateScale(14),
  },
  txtBuySignIn: {
    color: Colors.mainText,
    fontSize: moderateScale(14),
  },
  viewTextBottom: {
    flexDirection: 'row',
    marginTop: 16,
    paddingBottom: 16,
  },
  txtUnderline: {
    textDecorationLine: 'underline',
    textDecorationColor: Colors.primaryMain,
    color: Colors.primaryMain,
    paddingLeft: 5,
    fontSize: moderateScale(14),
  },
  viewHeaderVerifyCode: {
    width: '100%',
    flexDirection: 'row',
    height: moderateScale(40),
    alignItems: 'center',
    paddingHorizontal: 8,
    marginVertical: 12,
  },
  viewModalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  textinput: {
    backgroundColor: 'white',
    width: fullWidth - 30,
    marginTop: moderateScale(10),
    height: moderateScale(52),
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(17),
    borderRadius: 333,
    borderWidth: 1,
    borderColor: Colors.colorBorder,
    color: Colors.black_text,
    fontSize: moderateScale(14),
  },
  inputStyle: {fontSize: moderateScale(16)},
  labelStyle: {fontSize: moderateScale(14)},
  placeholderStyle: {fontSize: moderateScale(16)},
  textErrorStyle: {fontSize: moderateScale(14), marginBottom: 10},

  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: moderateScale(45),
    height: moderateScale(60),
    lineHeight: moderateScale(40),
    fontSize: moderateScale(24),
    borderWidth: 1,
    borderColor: Colors.colorBorder,
    textAlign: 'center',
    borderRadius: moderateScale(22),
    paddingVertical: moderateScale(7),
    margin: moderateScale(5),
    color: 'black',
  },
  focusCell: {
    width: moderateScale(45),
    height: moderateScale(60),
    lineHeight: moderateScale(40),
    fontSize: moderateScale(24),
    borderWidth: 1,
    borderColor: 'red',
    textAlign: 'center',
    borderRadius: moderateScale(22),
    paddingVertical: moderateScale(7),
    margin: moderateScale(5),
    color: 'black',
  },

  wrapHeader: {
    height: 56,
    paddingHorizontal: 24,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapMenu: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    borderRadius: 333,
    backgroundColor: '#00000040',
  },
  icMenu: {
    width: 24,
    height: 24,
  },
  appName: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '600',
  },
  wrapTime: {
    height: 52,
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 12,
  },
  icProfile: {
    width: 44,
    height: 44,
    borderRadius: 333,
    resizeMode: 'cover',
  },
  wrapItem: {
    width: (fullWidth - 72) * 0.5,
    height: 154,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7EEFF',
    borderRadius: 16,
  },
  wrapIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: '#E3D3F0',
    borderWidth: 8,
  },
  title: {
    color: Colors.mainText,
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginTop: 12,
  },
  wrapTimeDown: {
    flex: 1,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  viewWrapTime: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeCountDown: {
    color: '#723000',
    fontSize: moderateScale(18),
    fontWeight: '700',
    textAlign: 'center',
  },
  wraplotte: {
    width: 36,
    height: 36,
  },
  wrapContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    alignItems: 'center',
  },
  wrapPsRate: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 56,
    borderRadius: 16,
    width: fullWidth - 48,
    backgroundColor: '#D8FBFF',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  txtPassRate: {
    color: Colors.mainText,
    fontWeight: '500',
    fontSize: moderateScale(16),
    marginLeft: 16,
  },
  rate: {
    fontWeight: '700',
    fontSize: moderateScale(20),
    color: '#34C759',
  },
  wrapItemContent: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 24,
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
