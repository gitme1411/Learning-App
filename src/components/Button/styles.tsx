import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {fullWidth, shadow} from '../../theme';

export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '12@s',
    backgroundColor: '#fff',
  },
  buttonNext: {
    width: '100%',
    height: '44@vs',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtNext: {
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '600',
    color: '#FFF',
  },
});
