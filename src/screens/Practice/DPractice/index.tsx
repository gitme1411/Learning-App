import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradientView from '../../../components/LinerGradient';
import Header from '../../../components/Header';
import ItemHome from '../../../components/ItemHome';
import {Icon} from '../../../utils/icon';
import {Colors, fullWidth, shadow, spacing} from '../../../theme';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {getHome} from '../../../services/api/api';
import {moderateScale} from 'react-native-size-matters';
import TextNormal from '../../../components/Text';

const DPractice = ({route, navigation}: any) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const dataPractice = useSelector(
    (state: RootState) => state.practice.dataPractice,
  );
  const [value, setValue] = useState(0);
  const [dataHome, setDataHome] = useState({
    practice: 0,
    final_test: 0,
    all_topic: 0,
  });

  useEffect(() => {
    // dispatch(setDataLocal({ dataTopics: dataTopicsLocal }))
    // getDataQuestions()
    sumResult();
    if (token) {
      getDataHome();
    }
  }, [dataPractice]);

  const getDataHome = async () => {
    const res = await getHome(dispatch);
    setDataHome(res.res);
  };

  const sumResult = () => {
    let sum = 0;
    dataPractice.map(e => {
      if (e.percentPass) sum = sum + e.percentPass;
    });
    setValue(sum / dataPractice.length);
  };

  return (
    <LinearGradientView>
      <Header
        title="Practice"
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
          {token && dataHome ? (
            <ItemHome
              value={dataHome.practice}
              title="Standard Practice"
              onPress={() => navigation.navigate('Standard')}
              radius={42}
            />
          ) : (
            <ItemHome
              value={value}
              title="Standard Practice"
              onPress={() => navigation.navigate('Standard')}
              radius={42}
            />
          )}

          <TouchableOpacity
            style={styles.wrapItem}
            onPress={() => navigation.navigate('SetupTest')}>
            <View style={styles.wrapIcon}>
              <Image
                source={Icon.icCandle}
                style={{tintColor: Colors.primaryMain}}
              />
            </View>
            <TextNormal fontSize={14} style={styles.title}>
              Custom Practice
            </TextNormal>
          </TouchableOpacity>
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

export default DPractice;
