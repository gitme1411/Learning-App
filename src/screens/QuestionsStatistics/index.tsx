import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import {Colors, fullWidth, shadow} from '../../theme';
import {Icon} from '../../utils/icon';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';

const QuestionsStatistics = ({route, navigation}: any) => {
  return (
    <LinearGradientView>
      <Header
        title={'Statistics for Questions'}
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
      <View style={styles.wrapList}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 24,
          }}>
          <TouchableOpacity
            style={styles.wrapItem}
            onPress={() => navigation.navigate('WrongQuestions')}>
            <View style={styles.wrapIcon}>
              <Image
                style={{tintColor: Colors.primaryMain}}
                source={Icon.icXCircle}
              />
            </View>
            <TextNormal fontSize={14} style={styles.title}>
              Wrong questions
            </TextNormal>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.wrapItem}
            onPress={() => navigation.navigate('FavoriteQuestions')}>
            <View style={styles.wrapIcon}>
              <Image
                style={{tintColor: Colors.primaryMain}}
                source={Icon.icHeartBig}
              />
            </View>
            <TextNormal fontSize={14} style={styles.title}>
              Favorite questions
            </TextNormal>
          </TouchableOpacity>
        </View>
        {/* <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 24 }}>
                    <TouchableOpacity style={styles.wrapItem} onPress={() => navigation.navigate("WeakQuestions")}>
                        <View style={styles.wrapIcon}>
                            <Image
                                style={{ tintColor: Colors.primaryMain }}
                                source={Icon.icDanger}
                            />
                        </View>
                        <TextNormal fontSize={} style={styles.title}>Weak questions    </TextNormal>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.wrapItem} onPress={() => navigation.navigate("HardestQuestions")}>
                        <View style={styles.wrapIcon}>
                            <Image
                                style={{ tintColor: Colors.primaryMain }}
                                source={Icon.icBrain}
                            />
                        </View>
                        <TextNormal fontSize={} style={styles.title}>Hardest questions    </TextNormal>
                    </TouchableOpacity>
                </View> */}
      </View>
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
  wrapList: {
    marginTop: 16,
    flex: 1,
    backgroundColor: '#fbfbfb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  wrapItem: {
    width: (fullWidth - 72) * 0.5,
    height: 154,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blurMain,
    borderRadius: 16,
    ...shadow,
  },
  wrapIcon: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: Colors.primaryMain,
    borderWidth: 8,
  },
  title: {
    color: Colors.mainText,
    fontSize: moderateScale(14),
    fontWeight: '400',
    marginTop: 12,
  },
  wrapContent: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#fbfbfb',
    marginTop: 16,
    padding: 16,
  },
  wrapItemContent: {
    width: (fullWidth - 58) * 0.5,
    height: 154,
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 30,
    shadowRadius: 3.84,
    elevation: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    color: Colors.mainText,
    fontWeight: '400',
    fontSize: moderateScale(14),
    marginTop: 12,
  },
  wrapIconNote: {
    height: 90,
    width: 90,
    borderWidth: 7,
    borderRadius: 180,
    borderColor: '#E6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapTarget: {
    width: fullWidth - 32,
    marginTop: 12,
    borderRadius: 16,
    height: 56,
    backgroundColor: '#fff',
    marginLeft: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  wrapTxtTarget: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtTarget: {
    color: Colors.mainText,
    fontWeight: '600',
    fontSize: moderateScale(16),
    marginLeft: 12,
  },
  number: {
    color: '#34C759',
    fontWeight: '700',
    fontSize: moderateScale(18),
  },
});

export default QuestionsStatistics;
