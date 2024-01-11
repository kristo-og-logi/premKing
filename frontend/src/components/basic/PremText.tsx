import React from 'react';
import { Text, TextStyle } from 'react-native';
import { colors } from '../../styles/styles';

type Props = {
  order?: 1 | 2 | 3 | 4;
  centered?: boolean;
  padding?: number;
  color?: string;
  overflowing?: boolean;
  children: string | number;
};

const getSize = (order: 1 | 2 | 3 | 4) => {
  switch (order) {
    case 1:
      return 30;
    case 2:
      return 24;
    case 3:
      return 18;
    case 4:
      return 12;
  }
};

const PremText = ({
  order = 3,
  centered = false,
  padding = 0,
  color,
  overflowing = false,
  children,
}: Props) => {
  const size = getSize(order);

  const styles: TextStyle = {
    ...{
      fontFamily: 'MusticaPro',
      fontSize: size,
      color: color ?? colors.gray[0],
      padding: padding,
    },
    ...(overflowing ? { overflow: 'hidden' } : {}),
    ...(centered ? { textAlign: 'center', alignSelf: 'center' } : {}),
  };

  return (
    <Text
      style={styles}
      numberOfLines={overflowing ? 1 : undefined}
      ellipsizeMode={overflowing ? 'tail' : undefined}
    >
      {children}
    </Text>
  );
};

export default PremText;
