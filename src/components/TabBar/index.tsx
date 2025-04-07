import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {
  TabNavigationState,
  NavigationHelpers,
  ParamListBase,
} from '@react-navigation/native';
import {BottomTabNavigationEventMap} from '@react-navigation/bottom-tabs';
import {Colors, fullWidth} from '../../theme';
import {styles} from './styles';
import {Icon} from '../../utils/icon';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
type Props = {
  state: TabNavigationState<ParamListBase>;
  descriptors: any;
  navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>;
};

const TabBarCustom = ({state, descriptors, navigation}: any) => {
  return (
    <View
      style={{
        width: '100%',
        height: moderateScale(84),
        backgroundColor: '#fff',
      }}>
      <View style={styles.wrapTab}>
        {state.routes.map((route: any, index: any) => {
          const {options} = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              key={index}>
              <View style={styles.tab}>
                <View>
                  <Image
                    source={returnImageTab(index)}
                    style={[
                      styles.image,
                      {
                        tintColor: isFocused
                          ? Colors.primaryMain
                          : Colors.neutralText,
                      },
                    ]}
                  />
                </View>
                <TextNormal
                  fontSize={14}
                  style={{
                    color: isFocused ? Colors.primaryMain : Colors.neutralText,
                    marginTop: 4,
                  }}>
                  {label}
                </TextNormal>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const returnImageTab = (_index: number) => {
  switch (_index) {
    case 0:
      return Icon.icStudy;
    case 1:
      return Icon.icStPlan;
    case 2:
      return Icon.icStatistics;
    default:
      break;
  }
};

export default TabBarCustom;
