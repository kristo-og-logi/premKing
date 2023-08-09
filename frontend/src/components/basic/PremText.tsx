import React from 'react';
import { Text } from 'react-native';
import { colors } from '../../styles/styles';

type Props = {
  order?: 1 | 2 | 3 | 4;
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

const PremText = ({ order = 3, children }: Props) => {
  const size = getSize(order);
  return (
    <Text style={{ fontFamily: 'MusticaPro', fontSize: size, color: colors.gray[0] }}>
      {children}
    </Text>
  );
};

export default PremText;
