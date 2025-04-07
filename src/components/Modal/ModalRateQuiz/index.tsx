import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import ReactNativeModal from 'react-native-modal';
import {styles} from './styles';
import {Icon} from '../../../utils/icon';
import {TextInput} from 'react-native-element-textinput';
import ButtonNext from '../../Button/ButtonNext';
import {Colors, fullWidth} from '../../../theme';
import StarRating from './StarRating';
import LoadingModal from '../../Loading';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';
import TextNormal from '@/components/Text';
type Props = {
  isVisible?: boolean;
  note: string;
  visibleLoading?: any;
  onSwipeComplete: () => void;
  onRatingSelected?: (rating: number) => void;
  onSendRate: () => void;
  onChangeText?: (text: string) => void;
};

const ModalRateQuiz = ({
  isVisible,
  onSwipeComplete,
  onRatingSelected,
  onSendRate,
  onChangeText,
  note,
  visibleLoading,
}: Props) => {
  return (
    <ReactNativeModal
      animationIn={'slideInUp'}
      isVisible={isVisible}
      hideModalContentWhileAnimating={true}
      swipeDirection={['down']}
      onSwipeComplete={onSwipeComplete}
      style={{justifyContent: 'flex-end', margin: 0}}>
      <LoadingModal visible={visibleLoading} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.viewModalContainer}>
        <Image source={Icon.icLine} style={{marginTop: 5}} />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{alignItems: 'center', flexGrow: 1}}
          scrollEnabled={true}
          nestedScrollEnabled
          showsVerticalScrollIndicator={true}>
          <Image
            source={Icon.imgBusTicket}
            style={{
              marginVertical: 16,
            }}
          />
          <TextNormal
            fontSize={20}
            style={[styles.txtHowToQuiz, {marginTop: 16}]}>
            {'How to rate this quiz?'}
          </TextNormal>
          <StarRating maxStars={5} onRatingSelected={onRatingSelected} />
          <View style={styles.viewPaddingHorizontal}>
            <TextInput
              style={styles.txtInputNote}
              placeholder="Additional information"
              value={note}
              onChangeText={onChangeText}
              placeholderTextColor="#6D6B7A"
              placeholderStyle={{
                fontSize: moderateScale(14),
                fontWeight: '900',
              }}
            />
            <ButtonNext text="Send" onPressNext={onSendRate} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ReactNativeModal>
  );
};

export default ModalRateQuiz;
