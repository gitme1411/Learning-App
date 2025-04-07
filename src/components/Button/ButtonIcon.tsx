import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  Image,
  View,
  Text,
  ImageSourcePropType,
} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../Text';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
type Props = TouchableOpacityProps & {
  icon: ImageSourcePropType;
  onPress: () => void;
  title: string;
};

const ButtonIcon = ({icon, onPress, title, ...props}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Image
          style={{width: moderateScale(24), height: moderateScale(24)}}
          source={icon}
        />
        <TextNormal
          fontSize={14}
          style={{
            marginLeft: 12,
            fontSize: moderateScale(14),
            fontWeight: 'bold',
          }}>
          {title}
        </TextNormal>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonIcon;
