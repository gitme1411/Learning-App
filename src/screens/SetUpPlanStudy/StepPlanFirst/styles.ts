import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {fullWidth, shadow} from '../../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    // backgroundColor: '#fff',
  },
  stylesButtonSkip: {
    color: '#0B9FF1',
    fontSize: '14@ms',
    lineHeight: '20@ms',
  },
  txtNumberStep: {
    color: '#0B9FF1',
    fontSize: '14@ms',
    fontWeight: '400',
    textAlign: 'center',
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
  },
  img: {
    marginVertical: '0@ms',
  },

  checkBoxDay: {
    width: wp(21),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 33,
    borderWidth: 1,
    borderColor: '#00C2FF',
    margin: '4@ms',
    backgroundColor: '#FFFFFF',
  },
  nonCheckBoxDay: {
    width: wp(21),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 33,
    margin: '4@ms',
    backgroundColor: '#FFFFFF',
  },
  stylesTextDay: {
    color: '#0B9FF1',
    marginTop: moderateScale(-6),
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
  },
  nonTextDay: {
    color: '#242424',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
  },
  viewRender: {
    paddingBottom: '5@ms',
    paddingTop: '5@ms',
    alignItems: 'center',
  },
  viewContent: {
    paddingTop: 10,
    alignItems: 'center',
    flex: 1,
  },
  marginLeft50: {
    marginLeft: moderateScale(50),
    width: moderateScale(14),
    height: moderateScale(14),
  },
  widthFlatList: {
    width: '100%',
  },
});
