import React, {useState} from 'react';
import {View, Text} from 'react-native';
import DropDownPicker, {ItemType} from 'react-native-dropdown-picker';
import {styles} from './styles';

interface DropDownProps {
  value: string;
  items: ItemType<string>[];
  onChange: (value: any) => void;
}

const DropDownMinutes: React.FC<DropDownProps> = ({value, items, onChange}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={onChange}
        containerStyle={styles.containerStyle}
        placeholder={value}
        style={styles.styleDropDown}
        dropDownContainerStyle={styles.dropDownContainerStyle}
        textStyle={styles.textDrop}
        showTickIcon={false}
        listMode="FLATLIST"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      />
    </View>
  );
};

export default DropDownMinutes;
