import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {fullWidth, shadow} from '../../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  styleDropDown: {
    backgroundColor: '#fff',
    borderColor: '#D8D6DD',
    borderRadius: moderateScale(30),
    height: moderateScale(50),
  },
  dropDownContainerStyle: {
    borderColor: '#D8D6DD',
    height: '120@ms',
    borderRadius: 10,
  },
  textDrop: {
    color: '#6D6B7A',
    paddingLeft: 5,
    fontSize: moderateScale(14),
  },
  containerStyle: {
    width: '105@ms',
  },
});
