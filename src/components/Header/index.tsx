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
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';

type Props = {
  title: string;
  goBack?: () => void;
  onBtnRight?: () => void;
  showBtnRight: boolean;
};

const Header = ({title, onBtnRight, goBack, showBtnRight}: Props) => {
  let hasNotch = DeviceInfo.hasNotch();

  return (
    <View
      style={[
        styles.container,
        {marginTop: hasNotch ? moderateScale(36) : moderateScale(12)},
      ]}>
      <TouchableOpacity style={styles.right} onPress={goBack}>
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
          flex: 1,
        }}>
        <TextNormal
          fontSize={18}
          numberOfLines={2}
          style={{
            textAlign: 'center',
            fontWeight: '600',
            color: '#ffffff',
          }}>
          {title}
        </TextNormal>
      </View>

      <View style={styles.right} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  right: {
    width: 56,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Header;
