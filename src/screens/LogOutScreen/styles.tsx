import {moderateScale, scale, ScaledSheet} from 'react-native-size-matters';
import {Colors, fullWidth, shadow, spacing} from '../../theme';

export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
    backgroundColor: 'white',
  },
  image: {
    width: scale(150),
    height: scale(150),
    marginBottom: scale(25),
  },
  textTitel: {
    fontSize: moderateScale(35),
    marginTop: moderateScale(50),
    textAlign: 'center',
    color: Colors.white,
    fontWeight: '700',
  },
  textCancel: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: 'white',
  },
  textLogout: {
    fontSize: moderateScale(17),
    fontWeight: '600',
    color: '#0F90EB',
  },
  buttonContainer: {
    // justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    alignContent: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 35,
  },
  buttonCancel: {
    width: '100%',
    alignItems: 'center',
    height: scale(50),
    justifyContent: 'center',
    borderRadius: 50,
    marginBottom: scale(15),
    borderWidth: 0.5,
    borderColor: '#0F90EB',
  },
  buttonLogout: {
    backgroundColor: 'white',
    width: '100%',
    alignItems: 'center',
    height: moderateScale(50),
    justifyContent: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#0F90EB',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    resizeMode: 'stretch',
    height: '40%',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
