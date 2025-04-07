import {ScaledSheet, moderateScale} from 'react-native-size-matters';
import {Colors, fullWidth} from '../../theme';

export const styles = ScaledSheet.create({
  wrapTab: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: '333@s',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: moderateScale(20),
    marginHorizontal: moderateScale(20),
  },
  image: {
    width: '20@s',
    height: '20@s',
    resizeMode: 'contain',
  },
  tab: {
    height: '100%',
    // marginHorizontal: "12@s",
    // backgroundColor: "red",
    alignItems: 'center',
    justifyContent: 'center',
    width: ((fullWidth - 52) * 1) / 3,
  },
  wrapIconTab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});
