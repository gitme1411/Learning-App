import {View, Text} from 'react-native';
import React from 'react';
import {Calendar, DateData} from 'react-native-calendars';
import {StyleSheet} from 'react-native';

interface CalendarProps {
  onDayPress: (day: DateData) => void;
  markedDates: any;
  style?: object;
}

const CalendarComponent: React.FC<CalendarProps> = ({
  onDayPress,
  markedDates,
  style,
}) => {
  return (
    <Calendar
      enableSwipeMonths
      current={new Date().toISOString().split('T')[0]} // Updated to get the correct date format
      style={style}
      onDayPress={onDayPress}
      minDate={new Date().toISOString().split('T')[0]} // Updated to get the correct date format
      markingType="period"
      markedDates={markedDates}
    />
  );
};

export default CalendarComponent;
