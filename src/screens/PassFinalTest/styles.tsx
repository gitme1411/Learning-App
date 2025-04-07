import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {Colors, fullWidth, shadow} from '../../theme';
import {Platform} from 'react-native';

export const styles = ScaledSheet.create({
  container: {
    padding: 16,
    flex: 1,
    marginHorizontal: Platform.OS === 'ios' ? 16 : 0,
  },
  btnClose: {
    height: 10,
    justifyContent: 'center',
    paddingVertical: 8,
    width: '10%',
  },
  txtTitle: {
    width: '100%',
    fontSize: moderateScale(19),
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.white,
    paddingBottom: '18@ms',
    paddingHorizontal: 16,
    gap: 11,
  },
  img: {
    marginBottom: '12@ms',
  },

  stylesNumberLoad: {
    fontSize: 48,
    fontWeight: '700',
  },
  txtLoading: {
    fontSize: moderateScale(14),
    fontWeight: '400',
  },
  viewImageScore: {
    width: '100%',
    marginTop: '30@ms',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  viewAnimateNumber: {
    position: 'absolute',
    backgroundColor: Colors.white,
    width: '155@ms',
    height: '155@ms',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 155,
    borderWidth: 3.0,
    borderColor: '#A8D3D8',
  },

  txtNumberPass: {
    fontSize: moderateScale(20),
    color: '#FFCC00',
    fontWeight: '600',
  },
  txtRightAnswer: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    color: Colors.white,
    paddingHorizontal: 5,
  },
  viewRightAnswer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnRightAnswer: {
    flexDirection: 'row',
    height: moderateScale(54),
    borderWidth: 1,
    paddingHorizontal: moderateScale(12),
    borderColor: '#FFFFFF4D',
    borderRadius: moderateScale(16),
    alignItems: 'center',
    justifyContent: 'center',
    width: moderateScale(250),
    backgroundColor: '#FFFFFF1A',
  },
  btnTryAgain: {
    height: '46@ms',
    justifyContent: 'center',
    alignItems: 'center',
    width: fullWidth * 0.8,
  },
  txtColorBlack: {
    fontSize: moderateScale(14),
    color: Colors.black_text,
    fontWeight: '600',
  },
  viewButtonBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 2,
    paddingBottom: '10@ms',
  },
  viewIconButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
