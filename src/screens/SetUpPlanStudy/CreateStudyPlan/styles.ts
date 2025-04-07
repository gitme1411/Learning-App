import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import {fullWidth, shadow} from '../../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    marginHorizontal: moderateScale(16),
    // backgroundColor: '#fff',
  },
  stylesButtonSkip: {
    color: '#0B9FF1',
    fontSize: '14@ms',
    lineHeight: '20@ms',
  },
  txtNumberStep: {
    color: '#6D6B7A',
    fontSize: '16@ms',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  txtContentIntro: {
    fontSize: '18@ms',
    fontStyle: 'normal',
    fontWeight: '600',
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#242424',
    paddingTop: 11,
    lineHeight: 28,
    marginBottom: 8,
  },
  img: {},

  viewContent: {
    paddingTop: moderateScale(12),
    alignItems: 'center',
    flex: 1,
  },
  viewChart: {
    width: '100%',
    height: hp('40%'),
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtDayUpdate: {
    fontSize: '16@ms',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    width: '270@s',
  },
  viewReminder: {
    width: '100%',
    height: hp('28%'),
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'flex-start',
    marginTop: 16,
    padding: 16,
  },
  flexRow: {
    flexDirection: 'row',
    width: '100%',
    height: '56@ms',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexRenderItem: {
    flexDirection: 'row',
    width: '100%',
    height: hp('7%'),
    justifyContent: 'space-between',
  },
  txtItemRight: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#242424',
    textAlign: 'right',
    marginRight: 10,
    width: 130,
  },
  txtNoIconRight: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#242424',
    textAlign: 'right',
    marginRight: 10,
    width: 115,
    paddingRight: 20,
  },
  txtItemLeft: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: '#6D6B7A',
  },
  viewJustify: {
    flexDirection: 'row',
    width: 75,
    justifyContent: 'flex-end',
  },
  stylesNumberLoad: {
    color: '#0B9FF1',
    fontSize: moderateScale(32),
    fontWeight: '600',
  },
  txtLoading: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    color: '#6D6B7A',
  },
  viewContentCreating: {
    width: '100%',
    height: hp('60%'),

    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAnimateNumber: {
    position: 'absolute',
    backgroundColor: '#FFF',
    width: moderateScale(110),
    height: moderateScale(90),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
});
