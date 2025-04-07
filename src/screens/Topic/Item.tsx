import TextNormal from '@/components/Text';
import {RootState} from '@/store';
import {Colors, fullWidth} from '@/theme';
import {useNavigation} from '@react-navigation/native';
import {memo} from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';

const ItemTopic = memo(
  ({item, index, indexTopic}: {item: any; index: number; indexTopic: any}) => {
    const navigation = useNavigation();
    const dataTopics = useSelector(
      (state: RootState) => state.topics.dataTopics,
    );
    return (
      <TouchableOpacity
        style={styles.wrapItem}
        onPress={() => {
          navigation.navigate('Level', {
            itemLevel: dataTopics[indexTopic].data_level[index],
            itemTopic: dataTopics[indexTopic],
          });
        }}>
        <CircularProgress
          value={item.percentPass || 0}
          radius={moderateScale(28)}
          activeStrokeWidth={10}
          progressValueColor={
            item.is_passed ? Colors.baseBold : Colors.colorTextHeaderForm
          }
          inActiveStrokeColor="#E6F6FF"
          activeStrokeColor={Colors.primaryMain}
          valueSuffix={'%'}
          title={
            item.is_passed ? 'Pass' : item.percentPass === null ? '' : 'Fail'
          }
          titleStyle={{
            fontSize: 11,
            color: item.is_passed
              ? Colors.baseBold
              : Colors.colorTextHeaderForm,
          }}
          progressValueStyle={{
            height: 18,
          }}
          progressValueFontSize={13}
          valueSuffixStyle={{
            fontSize: 11,
            color: item.is_passed
              ? Colors.baseBold
              : Colors.colorTextHeaderForm,
            paddingTop: Platform.OS === 'android' ? 1 : 2,
          }}
        />
        <TextNormal fontSize={12} style={styles.txt}>
          {item.name}
        </TextNormal>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.item.percentPass === nextProps.item.percentPass;
  },
);

const styles = StyleSheet.create({
  right: {
    width: 56,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapList: {
    marginTop: 16,
    flex: 1,
    backgroundColor: '#fbfbfb',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  wrapItem: {
    width: (fullWidth * 1) / 3 - 64 / 3,
    height: moderateScale(100),
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: 'rgba(0, 0, 0, 0.08)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 30,
    shadowRadius: 3.84,
    marginLeft: 16,
    elevation: 4,
    // flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  space: {
    height: 16,
    width: '100%',
  },
  wrapIcLock: {
    width: 48,
    height: 48,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: '#E6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    marginLeft: 8,
    marginTop: 8,
    fontSize: moderateScale(12),
  },
});

export default ItemTopic;
