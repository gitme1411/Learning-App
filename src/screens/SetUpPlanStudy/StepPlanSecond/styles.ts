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
    marginVertical: '24@ms',
  },

  nonTextDay: {
    color: '#242424',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '600',
  },

  viewContent: {
    paddingTop: moderateScale(12),
    alignItems: 'center',
    flex: 1,
  },

  viewTimeInDate: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16@ms',
    justifyContent: 'center',
    padding: '16@ms',
    width: '100%',
    height: 'auto',
    marginBottom: '8@ms',
  },
  viewBoxTime: {
    flexDirection: 'row',
    marginTop: '8@ms',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnHH_MM: {
    width: '110@ms',
    height: '50@ms',
    paddingHorizontal: '8@ms',
    borderWidth: 1,
    borderColor: '#D8D6DD',
    borderRadius: '333@ms',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txtHH_MM: {
    color: '#6D6B7A',
    marginRight: '10@ms',
    fontSize: moderateScale(14),
  },
});
