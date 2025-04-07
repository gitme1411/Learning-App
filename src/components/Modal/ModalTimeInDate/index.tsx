import React, {useState} from 'react';
import {View, Button, Modal, StyleSheet, Platform} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface TimePickerProps {
  visible: boolean;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = React.useState<Date>(new Date());

  const handleTimeChange = (_: any, date: Date | undefined) => {
    if (date) {
      setSelectedTime(date);
    }
  };
  const handleConfirm = () => {
    onConfirm(selectedTime);
    onCancel();
  };
  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      onCancel();
      return;
    }
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (event.type === 'set' && currentDate) {
      onConfirm(currentDate);
    }
  };

  return (
    <View>
      {Platform.OS === 'ios' ? (
        <Modal
          visible={visible}
          transparent={true}
          animationType="fade"
          onRequestClose={onCancel}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                onChange={handleTimeChange}
                is24Hour={false}
                display="spinner"
              />
              <View style={styles.buttonContainer}>
                <Button title="Confirm" onPress={handleConfirm} />
                <Button title="Cancel" onPress={onCancel} />
              </View>
            </View>
          </View>
        </Modal>
      ) : (
        <View>
          {visible ? (
            <DateTimePicker
              value={date || new Date()}
              mode="time"
              onChange={onChange}
              is24Hour={false}
              display="spinner"
            />
          ) : null}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    width: '70%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default TimePicker;
