import React, {useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {moderateScale} from 'react-native-size-matters';

interface Question {
  id: number;
  checked: boolean;
}

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  questions: Question[];
  onSelectQuestion: (id: number) => void;
  scrollToIndex: (index: number) => void;
}

const ReviewQuestionModal: React.FC<ModalProps> = ({
  isVisible,
  onClose,
  questions,
  onSelectQuestion,
  scrollToIndex,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // Track selected index

  const handleSelectQuestion = (index: number) => {
    setSelectedIndex(index); // Set selected item
    onSelectQuestion(index);
    scrollToIndex(index);
    onClose();
  };

  const renderQuestion = ({item, index}: {item: any; index: number}) => {
    let backgroundColor;
    let textColor;

    // Determine background and text color based on state
    if (!item.checked) {
      backgroundColor = styles.inactive.backgroundColor; // Inactive (gray)
      textColor = styles.inactiveText.color;
    } else if (index === selectedIndex) {
      backgroundColor = styles.selected.backgroundColor; // Selected (blue)
      textColor = styles.selectedText.color; // White text for selected item
    } else {
      backgroundColor = styles.active.backgroundColor; // Active (white)
      textColor = styles.activeText.color;
    }
    const isSelected = index === selectedIndex;
    return (
      <View style={{padding: 6}}>
        {item.user_answers > -1 ? (
          <LinearGradient
            colors={['#00C2FF', '#0F90EB']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={[styles.questionButton, {borderWidth: 0}]}>
            <TouchableOpacity onPress={() => handleSelectQuestion(index)}>
              <Text style={styles.selectedText}>{index + 1}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            style={[styles.questionButton, styles.active]}
            // disabled={item.user_answers > -1}
            onPress={() => handleSelectQuestion(index)}>
            <Text style={styles.activeText}>{index + 1}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      backdropOpacity={0.2}
      useNativeDriver={true}
      style={styles.modalContainer}>
      <View style={styles.content}>
        <FlatList
          data={questions}
          renderItem={renderQuestion}
          keyExtractor={item => item.id.toString()}
          numColumns={5}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: moderateScale(350),
    height: moderateScale(250),
    alignItems: 'center',
    shadowColor: '#D3D3D3',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 12,
  },
  questionButton: {
    width: moderateScale(52),
    height: moderateScale(40),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D3D3D3',
  },
  active: {
    backgroundColor: 'white',
    borderColor: '#D3D3D3',
  },
  inactive: {
    backgroundColor: '#F0F0F0',
    borderColor: '#D3D3D3',
  },
  selected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  activeText: {
    color: 'black',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#A9A9A9',
  },
  selectedText: {
    color: 'white', // White text for selected item
    fontWeight: 'bold',
  },
});

export default ReviewQuestionModal;
