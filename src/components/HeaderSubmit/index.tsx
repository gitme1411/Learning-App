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
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';

type Props = {
  title: string;
  goBack: () => void;
  onBtnRight?: () => void;
  showBtnRight: boolean;
  onBtnSubmit?: () => void;
};

const HeaderSubmit = ({
  title,
  onBtnRight,
  goBack,
  showBtnRight,
  onBtnSubmit,
}: Props) => {
  let hasNotch = DeviceInfo.hasNotch();

  return (
    <View style={[styles.container, {marginTop: hasNotch ? 34 : 12}]}>
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
      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <TextNormal
          fontSize={18}
          style={{
            textAlign: 'center',
            fontWeight: '600',
            fontSize: moderateScale(18),
            color: '#ffffff',
          }}>
          {title}
        </TextNormal>
      </View>

      {showBtnRight ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View>
            <TouchableOpacity
              hitSlop={{top: 4, bottom: 4}}
              style={{
                backgroundColor: '#FFD265',
                height: 36,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                borderRadius: 12,
                paddingHorizontal: 8,
              }}
              onPress={onBtnSubmit}>
              <TextNormal fontSize={16}>Submit </TextNormal>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.right} />
      )}
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
    width: 70,
    height: '100%',
    marginLeft: 12,
    justifyContent: 'center',
    paddingStart: 4,
  },
});

export default HeaderSubmit;
