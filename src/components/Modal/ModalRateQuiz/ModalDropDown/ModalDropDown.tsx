import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {styles} from './styles';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store';
import TextNormal from '@/components/Text';

type PropsModalDrops = {
  onRequestClose: () => void;
  keyExtractor: () => void;
  modalVisible: boolean;
  onClose: () => void;
  data: [];
  onSelect: (item: any) => void;
  disabled: boolean;
};

const ModalDropDown = ({
  onClose,
  onRequestClose,
  onSelect,
  modalVisible,
  data,
  disabled,
}: PropsModalDrops) => {
  const [selected, setSelected] = useState(false);

  const renderItem = ({item}: any) => (
    <TouchableOpacity
      style={styles.selectItem}
      disabled={disabled}
      onPress={() => {
        onSelect(item);
        onClose();
        setSelected(item?.id);
      }}>
      <View
        style={[
          styles.viewRenderItem,
          {
            backgroundColor: selected === item?.id ? '#00C2FF' : 'white',
          },
        ]}>
        <TextNormal
          fontSize={14}
          style={[
            styles.text,
            {color: selected === item?.id ? 'white' : 'black'},
          ]}>
          {item.id}
        </TextNormal>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      style={styles.container}
      onRequestClose={onRequestClose}>
      <TouchableOpacity
        style={styles.closeDrop}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.viewFlatList}>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={5}
            ListHeaderComponent={() => {
              return <View style={{paddingTop: 20}} />;
            }}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ModalDropDown;
