import React, {useEffect, useState} from 'react';
import {Text, TextProps} from 'react-native';
import {RootState} from '@/store';
import {useSelector} from 'react-redux';
type Props = TextProps & {
  fontSize: number;
};

const TextNormal = ({fontSize, ...props}: Props) => {
  const settingFont = useSelector(
    (state: RootState) => state.config.settingFont,
  );
  // const [font, setFont] = useState(fontSize);
  // useEffect(() => {
  //   switch (settingFont) {
  //     case 'Medium':
  //       setFont(fontSize);
  //       break;
  //     case 'Very Small':
  //       setFont(fontSize - 2);
  //       break;
  //     case 'Small':
  //       setFont(fontSize - 1);
  //       break;
  //     case 'Large':
  //       setFont(fontSize + 1);
  //       break;
  //     case 'Very Large':
  //       setFont(fontSize + 2);
  //       break;
  //     default:
  //       setFont(fontSize);
  //   }
  // }, [settingFont, fontSize]);
  const getFont = () => {
    switch (settingFont) {
      case 'Medium':
        return fontSize;
      case 'Very Small':
        return fontSize - 2;
      case 'Small':
        return fontSize - 1;
      case 'Large':
        return fontSize + 1;
      case 'Very Large':
        return fontSize + 2;
      default:
        return fontSize;
    }
  };
  return (
    <Text {...props} style={[props.style, {fontSize: getFont()}]}>
      {props.children}
    </Text>
  );
};

export default TextNormal;
