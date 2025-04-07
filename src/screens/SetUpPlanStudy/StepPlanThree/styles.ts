import {moderateScale, ScaledSheet} from 'react-native-size-matters';
import {fullWidth, shadow} from '../../../theme';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const styles = ScaledSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    // backgroundColor: '#fff',
  },
  flexRow: {
    flexDirection: 'row',
  },
  viewContent: {
    paddingTop: moderateScale(12),
  },

  stylesButtonSkip: {
    color: '#0B9FF1',
    fontSize: '14@ms',
    lineHeight: '20@ms',
  },
  txtNumberStep: {
    color: '#0B9FF1',
    fontSize: '14@ms',
    fontWeight: '400',
    textAlign: 'center',
  },
  txtContentIntro: {
    fontSize: '18@ms',
    fontStyle: 'normal',
    fontWeight: '600',
    alignSelf: 'stretch',
    textAlign: 'center',
    color: '#242424',
    paddingTop: 11,
    lineHeight: 28,
  },
  img: {
    marginVertical: '24@ms',
  },
  viewCalendar: {
    borderRadius: '16@ms',
    borderColor: 'gray',
    height: '75%',
    width: '330@ms',
    marginVertical: '16@vs',
    paddingBottom: 30,
  },
  viewDateTime: {
    borderRadius: '16@ms',
    borderColor: 'gray',
    height: '80@ms',
    width: '330@ms',
    backgroundColor: '#FFF',
    marginTop: '16@ms',
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: '16@ms',
    paddingVertical: '9@vs',
    justifyContent: 'space-between',
  },
  txtDate: {
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '400',
  },
  txtDays: {
    color: '#242424',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '600',
  },
  viewDaysLeft: {
    borderRadius: 16,
    backgroundColor: '#F0F0F4',
    alignItems: 'center',
    paddingHorizontal: '16@ms',
    paddingVertical: '8@vs',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingHorizontal: '16@ms',
    paddingVertical: '24@vs',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexShrink: 0,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  viewContentNotiModal: {
    borderRadius: '16@ms',
    borderColor: 'gray',
    height: '132@ms',
    width: '100%',
    backgroundColor: '#F0F0F4',
    marginTop: '24@ms',
    padding: '16@ms',
    marginBottom: '20@ms',
  },
  btnContinue: {
    width: '100%',
    marginBottom: moderateScale(-15),
  },
  stylesCalendar: {
    borderRadius: '16@ms',
    borderColor: 'gray',
    height: '75%',
    width: moderateScale(330),
    marginVertical: '16@vs',
    paddingBottom: 30,
  },
});
