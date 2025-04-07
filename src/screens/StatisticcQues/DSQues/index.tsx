import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LinearGradientView from '../../../components/LinerGradient';
import Header from '../../../components/Header';
import {Icon} from '../../../utils/icon';
import {Colors, fullWidth, shadow, spacing} from '../../../theme';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../../components/Text';
const DSQues = ({navigation}: any) => {
  const renderItem = (icon, title, onPress) => {
    return (
      <TouchableOpacity style={styles.wrapItem} onPress={onPress}>
        <View style={styles.wrapIcon}>
          <Image source={icon} style={{tintColor: Colors.primaryMain}} />
        </View>
        <TextNormal fontSize={14} style={styles.title}>
          {title}
        </TextNormal>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradientView>
      <Header
        title="Statistics for Questions"
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}>
        <View style={styles.wrapItemContent}>
          {renderItem(Icon.icXCircle, 'Wrong question', () => {})}
          {renderItem(Icon.icBrain, 'Hardest questions', () => {})}
        </View>
        <View style={styles.wrapItemContent}>
          {renderItem(Icon.icDanger, 'Weak questions', () => {})}
          {renderItem(Icon.icHeartBig, 'Favorite questions', () => {})}
        </View>
      </View>
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
  wrapItemContent: {
    marginTop: spacing.mainSpacing,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: spacing.mainSpacing,
  },
  wrapItem: {
    width: (fullWidth - 48) * 0.5,
    height: 154,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    ...shadow,
  },
  wrapIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.blurMain,
    borderWidth: 8,
  },
  title: {
    color: '#242424',
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginTop: 12,
  },
});

export default DSQues;
