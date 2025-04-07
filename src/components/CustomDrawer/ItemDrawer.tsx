import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import React from 'react';
import {Icon} from '../../utils/icon';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../Text';
import {useSelector} from 'react-redux';
import {RootState} from '@/store';

type Props = {
  icon: ImageSourcePropType;
  onPress: () => void;
  title: string;
};

const ItemDrawer = ({onPress, icon, title}: Props) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image source={icon} style={styles.icon} />
        <TextNormal fontSize={14} style={styles.txt}>
          {title}
        </TextNormal>
      </View>
      <View>
        <Image source={Icon.icArrow} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  txt: {
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginLeft: 12,
  },
  icon: {
    tintColor: '#6D6B7A',
    width: 24,
    height: 24,
  },
});

export default ItemDrawer;
