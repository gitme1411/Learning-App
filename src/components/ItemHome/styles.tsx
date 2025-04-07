import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {Colors, fullWidth, shadow} from '../../theme';

export const styles = ScaledSheet.create({
  container: {
    width: (fullWidth - 72) * 0.5,
    height: 154,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    ...shadow,
  },
  txt: {
    color: Colors.mainText,
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginTop: 12,
  },
});
