import {
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {styles} from './styles';
import HeaderBackSkip from '../../../components/HeaderBackSkip';
import ButtonNext from '../../../components/Button/ButtonNext';
import Toast from 'react-native-simple-toast';
import TextNormal from '../../../components/Text';
type ItemData = {
  id: number;
  dayName: string;
  selected?: boolean;
};
type ItemProps = {
  navigation: any;
};

const StepPlanFirst: React.FC<ItemProps> = ({navigation}) => {
  const DATA: ItemData[] = [
    {
      id: 1,
      dayName: 'Mon',
      selected: true,
    },
    {
      id: 2,
      dayName: 'Tue',
      selected: true,
    },
    {
      id: 3,
      dayName: 'Wed',
      selected: true,
    },

    {
      id: 4,
      dayName: 'Thu',
      selected: true,
    },
    {
      id: 5,
      dayName: 'Fri',
      selected: true,
    },
    {
      id: 6,
      dayName: 'Sat',
      selected: true,
    },
    {
      id: 7,
      dayName: 'Sun',
      selected: true,
    },
  ];

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedDays, setSelectedDays] = useState(DATA);
  const {width, height} = Dimensions.get('window');
  const numColumns = 4;

  useEffect(() => {
    const newCheckedIndexes = selectedDays.reduce((arrIndex, item, index) => {
      if (item.selected) {
        arrIndex.push(index);
      }
      return arrIndex;
    }, []);
    setSelectedItems(newCheckedIndexes);
  }, [selectedDays]);

  const onNext = () => {
    if (selectedItems.length > 0) {
      navigation.navigate('StepPlanSecond', {selectedItems});
    } else {
      Toast.showWithGravity(
        'You must choose at least one day!',
        Toast.TOP,
        Toast.CENTER,
      );
    }
  };

  const _renderItemDays = ({
    item,
    index,
  }: {
    item: ItemData;
    index: ItemData;
  }) => {
    const onCheckBoxDays = (index: any) => {
      const newItems = [...selectedDays];
      newItems[index].selected = !newItems[index].selected;
      setSelectedDays(newItems);
    };

    return (
      <View style={styles.viewRender}>
        <TouchableOpacity
          style={item.selected ? styles.checkBoxDay : styles.nonCheckBoxDay}
          onPress={() => onCheckBoxDays(index)}>
          {item.selected ? (
            <Image
              source={require('../../../assets/images/ic_check.png')}
              style={[styles.marginLeft50]}
            />
          ) : null}

          <TextNormal
            fontSize={14}
            style={item.selected ? styles.stylesTextDay : styles.nonTextDay}>
            {item.dayName}
          </TextNormal>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBackSkip
        text={'Skip'}
        hideButton={true}
        stylesText={styles.stylesButtonSkip}
        fontSize={14}
        progress={2}
        onPressSkip={onNext}
        onPress={() => {}}
      />

      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      <View style={styles.viewContent}>
        <TextNormal fontSize={14} style={styles.txtNumberStep}>
          {'Step 1/3'}
        </TextNormal>
        <TextNormal fontSize={18} style={styles.txtContentIntro}>
          {'Choose days of the week \n to practice'}
        </TextNormal>
        <Image
          source={require('../../../assets/images/img-book.png')}
          style={[
            styles.img,
            {
              width: width * 0.8,
              height: height * 0.4,
              resizeMode: 'contain',
            },
          ]}
        />
        <FlatList
          scrollEnabled={false}
          renderItem={_renderItemDays}
          data={selectedDays}
          keyExtractor={(item: any) => item.id}
          numColumns={numColumns}
          style={styles.widthFlatList}
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
      </View>
      {/* </ScrollView> */}

      <ButtonNext onPressNext={onNext} text="Next" />
    </SafeAreaView>
  );
};

export default StepPlanFirst;
