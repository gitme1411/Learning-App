import React from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {Dimensions} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {styles} from './styles';
import Icons from '../Icon';
import {Icon} from '../../utils/icon';
import {moderateScale} from 'react-native-size-matters';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';
import TextNormal from '../Text';
interface ChartData {
  [key: string]: number;
}

interface Props {
  current: ChartData;
  target: ChartData;
  textDate: string;
  showCalender: () => void;
}

const ChartComponent: React.FC<Props> = ({
  current,
  target,
  textDate,
  showCalender,
}) => {
  const screenWidth = Dimensions.get('window').width;
  let labels: any[] = [];
  if (current) {
    labels = Object.keys(current).map((_, index) => `Day ${index + 1}`);
  }
  const currentData = Object.values(current);
  const targetData = Object.values(target);

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: currentData,
        color: (opacity = 1) => `#0F90EB`,
        strokeWidth: 3,
        withDots: true,
      },
      {
        data: targetData,
        color: (opacity = 1) => `#FFB400`,
        withDots: false,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: '4',
      strokeWidth: '3',
      stroke: '#0F90EB',
      fill: '#FFFFFF',
    },
    propsForBackgroundLines: {
      stroke: '#cccccc',
      strokeDasharray: '0',
      strokeWidth: 1,
    },
    propsForVerticalLines: {
      stroke: '#cccccc',
      strokeDasharray: '0',
      strokeWidth: 1,
    },
  };

  const chartWidth = labels.length > 6 ? labels.length * 60 : screenWidth;

  return (
    <View style={styles.viewChart}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        style={{
          width: '85%',
        }}>
        <LineChart
          data={chartData}
          width={chartWidth}
          height={hp('30%')}
          chartConfig={chartConfig}
          style={{
            marginVertical: 8,
            marginLeft: -30,
            marginRight: 20,
            marginTop: moderateScale(35),
            alignSelf: 'center',
          }}
          fromZero
          withShadow={false}
          withVerticalLines={true}
          withHorizontalLines={true}
          withOuterLines={true}
        />
      </ScrollView>
      <View style={styles.flexRow}>
        <TextNormal fontSize={16} style={styles.txtDayUpdate}>
          {textDate || ''}
        </TextNormal>
        {/* <TouchableOpacity onPress={showCalender}>
          <Icons icon={Icon.icEdit} size={20} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default ChartComponent;
