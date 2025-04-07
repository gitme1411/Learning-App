import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '../../components/LinerGradient';
import Header from '../../components/Header';
import {Colors, fullWidth} from '../../theme';
import {Icon} from '../../utils/icon';
import CircularProgress from 'react-native-circular-progress-indicator';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../store';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../components/Text';

const Level = ({route, navigation}: any) => {

  const {itemLevel, itemTopic} = route.params;
  const [titleHead, setTitleHead] = useState('');

  useEffect(() => {
    const str = itemLevel.name;
    const number = itemTopic.name.replace(/[^0-9]/g, '');
    const part = `Part ${number}`;
    const name = part + ' - ' + str;
    setTitleHead(name);
  }, []);

  const renderTarget = () => {
    return (
      <View style={styles.wrapTarget}>
        <View style={styles.wrapTxtTarget}>
          <Image source={Icon.icTarget} style={{}} />
          <TextNormal fontSize={16} style={styles.txtTarget}>
            Targeting
          </TextNormal>
        </View>
        <TextNormal fontSize={18} style={styles.number}>
          {itemTopic.id === 4 ? '100%' : '80%'}
        </TextNormal>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.wrapContent}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={styles.wrapItemContent}
            onPress={() =>
              navigation.navigate('FlashCard', {
                itemLevel: itemLevel,
                title: titleHead,
              })
            }>
            <View style={styles.wrapItemContent}>
              <View style={styles.wrapIconNote}>
                <Image source={Icon.icNote} />
              </View>
              <TextNormal fontSize={14} style={styles.txt}>
                Flash card
              </TextNormal>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.wrapItemContent}
            onPress={() =>
              navigation.navigate('Questions', {
                itemLevel: itemLevel,
                title: titleHead,
              })
            }>
            <CircularProgress
              value={itemLevel.percentPass || 0}
              radius={42}
              activeStrokeWidth={12}
              progressValueColor={
                itemLevel.is_passed
                  ? Colors.baseBold
                  : Colors.colorTextHeaderForm
              }
              inActiveStrokeColor="#E6F6FF"
              activeStrokeColor={Colors.primaryMain}
              valueSuffix={'%'}
              title={
                itemLevel.is_passed
                  ? 'Pass'
                  : itemLevel.percentPass === null ||
                    itemLevel.percentPass === undefined
                  ? ''
                  : 'Fail'
              }
              titleStyle={{
                fontSize: 18,
                color: itemLevel.is_passed
                  ? Colors.baseBold
                  : Colors.colorTextHeaderForm,
              }}
              progressValueStyle={{
                height: 28,
              }}
              progressValueFontSize={20}
              valueSuffixStyle={{
                fontSize: 18,
                color: itemLevel.is_passed
                  ? Colors.baseBold
                  : Colors.colorTextHeaderForm,
                paddingTop: Platform.OS === 'android' ? 1 : 2,
              }}
            />
            <TextNormal fontSize={14} style={styles.txt}>
              Questions
            </TextNormal>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <LinearGradientView>
      <Header
        title={titleHead}
        showBtnRight={false}
        goBack={() => navigation.goBack()}
      />
      {renderTarget()}
      {renderContent()}
    </LinearGradientView>
  );
};

const styles = StyleSheet.create({
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
    height: moderateScale(150),
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
    borderRadius: moderateScale(16),
    height: moderateScale(56),
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

export default Level;
