import React from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import {Icon} from '../../utils/icon';
import DeviceInfo from 'react-native-device-info';
import {fullWidth} from '../../theme';
import Subtitles from '../Subtitles';
import {setLanguage} from '../../store/user';
import {useDispatch, useSelector} from 'react-redux';
import {moderateScale} from 'react-native-size-matters';
import {RootState} from '../../store';
import TextNormal from '../Text';

type Props = {
  title: string;
  goBack?: () => void;
  onBtnRight?: () => void;
  showBtnRight: boolean;
};

const HeaderSub = ({title, onBtnRight, goBack, showBtnRight}: Props) => {
  let hasNotch = DeviceInfo.hasNotch();
  const dispatch = useDispatch();

  const onSelect = (selectedItem, indexDrop) => {
    // setIdLeng(indexDrop)
    dispatch(setLanguage(indexDrop));
  };

  return (
    <View style={[styles.container, {marginTop: hasNotch ? 34 : 12}]}>
      <TouchableOpacity
        hitSlop={{top: 5, right: 5, left: 5, bottom: 5}}
        style={styles.right}
        onPress={goBack}>
        <Image
          source={Icon.icBack}
          style={{
            width: moderateScale(24),
            height: moderateScale(24),
            tintColor: '#ffffff',
          }}
        />
      </TouchableOpacity>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        <TextNormal
          fontSize={18}
          numberOfLines={1}
          style={{
            textAlign: 'center',
            fontWeight: '600',
            fontSize: moderateScale(18),
            color: '#ffffff',
            width: fullWidth - 72 - 95,
          }}>
          {title}
        </TextNormal>
      </View>

      <View style={{marginRight: 12}}>
        <Subtitles
          onSelect={onSelect}
          widthDropdown={110}
          rowTextStyle={{fontSize: 13}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    width: 56,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex:10
  },
});

export default HeaderSub;
