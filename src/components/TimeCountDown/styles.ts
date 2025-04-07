import {ScaledSheet, moderateScale, scale} from 'react-native-size-matters';
import {Colors, fullWidth, shadow} from '../../theme';

export const styles = ScaledSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    width: scale(150),
    height: scale(40),
    paddingHorizontal: scale(16),
  },
  stylesCountDown: {
    backgroundColor: 'white',
    gap: scale(4),
    borderRadius: 16,
  },
  textTime: {
    color: '#0B9FF1',
    fontSize: moderateScale(15),
    fontWeight: '700',
    paddingLeft: 10,
  },
});
