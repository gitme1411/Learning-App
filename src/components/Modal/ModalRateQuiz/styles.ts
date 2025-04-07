import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {Colors, fullWidth, shadow} from '../../../theme';

export const styles = ScaledSheet.create({
  container: {
    padding: '16@ms',
    flex: 1,
  },
  viewModalContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
    marginTop: 80,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
  },
  txtHowToQuiz: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: Colors.mainText,
    textAlign: 'center',
  },
  viewCheckBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 48,
  },
  txtLabelCheckBox: {
    fontWeight: '400',
    fontSize: moderateScale(14),
    lineHeight: 20,
    color: Colors.mainText,
  },
  txtInputNote: {
    width: '100%',
    height: moderateScale(60),
    padding: 10,
    borderWidth: 1,
    borderColor: '#D8D6DD',
    borderRadius: moderateScale(16),
    marginBottom: '24@ms',
    marginTop: '10@ms',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  borderCheck: {
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  imgLine: {
    marginVertical: '10@ms',
    width: '100%',
    height: 8,
  },
  scrollView: {
    width: '100%',
    paddingBottom: '10@ms',
  },
  viewPaddingHorizontal: {
    paddingHorizontal: '16@ms',
    width: '100%',
    justifyContent: 'flex-end',
  },
});
