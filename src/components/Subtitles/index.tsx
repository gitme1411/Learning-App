import {Image, StyleProp, Text, TextStyle, View} from 'react-native';
import React, {Component, useState} from 'react';
import {Icon} from '../../utils/icon';
import SelectDropdown from 'react-native-select-dropdown';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
type Props = {
  onSelect: (selectedItem: any, indexDrop: any) => void;
  widthDropdown?: number;
  rowTextStyle?: StyleProp<TextStyle>;
};

const Subtitles = ({onSelect, widthDropdown, rowTextStyle}: Props) => {
  const [leng, setLeng] = useState('English');

  return (
    <SelectDropdown
      statusBarTranslucent={true}
      onChangeSearchInputText={() => console.log('onChangeSearchInputText')}
      data={['English', 'Vietnamese', 'Chinese']}
      onSelect={(selectedItem, indexDrop) => {
        onSelect(selectedItem, indexDrop);
        // onChangeAmountUnit(selectedItem, indexDrop)
      }}
      renderCustomizedButtonChild={() => (
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#F0F0F4',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 8,
            borderRadius: 8,
            flexGrow: 0,
            alignSelf: 'baseline',
            height: 28,
          }}>
          <TextNormal fontSize={16}>Subtitles </TextNormal>
          <Image style={{marginLeft: 4}} source={Icon.icDrop} />
        </View>
      )}
      dropdownStyle={{width: widthDropdown || 150}}
      buttonStyle={{
        height: 28,
        margin: 0,
        borderRadius: 8,
        width: null,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
        zIndex: 3,
      }}
      rowStyle={{
        height: 40,
      }}
      rowTextStyle={rowTextStyle}
      buttonTextAfterSelection={(selectedItem, index) => {
        // text represented after item is selected
        // if data array is an array of objects then return selectedItem.property to render after item is selected
        return selectedItem;
      }}
      rowTextForSelection={(value, indexDrop) => {
        // text represented for each item in dropdown
        // if data array is an array of objects then return item.property to represent item in dropdown
        return value;
      }}
    />
  );
};

export default Subtitles;
