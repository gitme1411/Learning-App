// ReminderDetails.tsx
import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import Icons from '../Icon';
import {Icon} from '../../utils/icon';
import {format} from 'date-fns';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
interface ReminderDetailsProps {
  // dataStepPlan: any;
  selectedTime: Date | null;
  showTimePicker: () => void;
  formatTime: (date: Date | null) => string;
  textReminder: any;
  minutes: number;
  isShowIcon: boolean;
  question: any;
}

const ReminderDetails: React.FC<ReminderDetailsProps> = ({
  selectedTime,
  showTimePicker,
  formatTime,
  textReminder,
  minutes,
  isShowIcon,
  question,
}) => {
  return (
    <View style={styles.viewReminder}>
      <View style={styles.flexRenderItem}>
        <TextNormal fontSize={14} style={[styles.txtItemLeft]}>
          Reminder
        </TextNormal>
        <View style={styles.viewJustify}>
          <TextNormal fontSize={14} style={[styles.txtItemRight]}>
            {textReminder}
          </TextNormal>
          {isShowIcon ? (
            <TouchableOpacity onPress={showTimePicker}>
              <Icons icon={Icon.icEdit} size={20} />
            </TouchableOpacity>
          ) : (
            <View style={{paddingRight: 20}}></View>
          )}
        </View>
      </View>
      <View style={styles.flexRenderItem}>
        <TextNormal fontSize={14} style={[styles.txtItemLeft]}>
          Duration
        </TextNormal>
        <View style={styles.viewJustify}>
          <TextNormal fontSize={14} style={[styles.txtItemRight]}>
            {/* {dataStepPlan?.minutes + ' mins/day'} */}
            {minutes + ' mins/day'}
          </TextNormal>
          {isShowIcon ? (
            <TouchableOpacity>
              <Icons icon={Icon.icEdit} size={20} />
            </TouchableOpacity>
          ) : (
            <View style={{paddingRight: 20}}></View>
          )}
        </View>
      </View>
      <View style={styles.flexRenderItem}>
        <TextNormal fontSize={14} style={[styles.txtItemLeft]}>
          Questions
        </TextNormal>
        <TextNormal fontSize={14} style={[styles.txtNoIconRight]}>
          {question ? question + '/day' : 0 + '/day'}
        </TextNormal>
      </View>
      <View style={styles.flexRenderItem}>
        <TextNormal fontSize={14} style={[styles.txtItemLeft]}>
          Goals Scope
        </TextNormal>
        <TextNormal fontSize={14} style={[styles.txtNoIconRight]}>
          80%
        </TextNormal>
      </View>
    </View>
  );
};

export default ReminderDetails;
