import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/FontAwesome';

type StarRatingProps = {
  maxStars?: number;
  onRatingSelected?: (rating: number) => void;
};

const StarRating: React.FC<StarRatingProps> = ({
  maxStars = 5,
  onRatingSelected,
}) => {
  const [rating, setRating] = useState(1);

  const handleRating = (star: number) => {
    setRating(star);
    if (onRatingSelected) {
      onRatingSelected(star);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({length: maxStars}, (_, index) => (
        <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
          <Icon
            name={index < rating ? 'star' : 'star-o'}
            size={moderateScale(32)}
            color="#FFD700"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  text: {
    marginLeft: 10,
    fontSize: moderateScale(16),
  },
});

export default StarRating;
