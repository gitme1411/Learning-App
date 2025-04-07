import {ScaledSheet, moderateScale, scale} from 'react-native-size-matters';
import {Colors, fullWidth, shadow} from '../../../../theme';

export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  closeDrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewFlatList: {
    backgroundColor: 'white',
    borderRadius: 16,
    height: scale(240),
    alignItems: 'center',
    shadowColor: '#D8D6DD',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
    paddingHorizontal: scale(16),
  },
  viewRenderItem: {
    width: scale(48),
    height: scale(36),
    borderRadius: 333,
    borderColor: '#D8D6DD',
    gap: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerModal: {
    backgroundColor: 'white',
  },
  text: {
    color: Colors.black,
    fontSize: moderateScale(14),
    lineHeight: 20,
    fontWeight: '600',
  },
  selectItem: {
    paddingHorizontal: 4,
    paddingVertical: 5,
  },
});
