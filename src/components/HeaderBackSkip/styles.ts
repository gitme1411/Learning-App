import {ScaledSheet} from 'react-native-size-matters';
import {fullWidth, shadow} from '../../theme';

export const styles = ScaledSheet.create({
  viewHeader: {
    flexDirection: 'row',
    height: 56,
    width: '100%',
    alignItems: 'center',
    flexShrink: 0,
    gap: 8,
    justifyContent: 'space-between',
  },
  container: {
    height: 20,
    backgroundColor: '#ccc',
    borderRadius: 10,
    margin: 10,
  },
  bar: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    width: 30,
  },
  viewNone: {
    width: 30,
  },
});
