import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    // backgroundColor: '#fff',
  },

  viewCalendar: {
    borderRadius: '16@ms',
    borderColor: 'gray',
    height: '75%',
    width: moderateScale(330),
    marginVertical: '16@vs',
    paddingBottom: 30,
  },
});
