import React from 'react';
import { Text } from 'react-native';

type Props = {
  order?: 1 | 2 | 3 | 4;
  children: string;
};

const getSize = (order: 1 | 2 | 3 | 4) => {
  switch (order) {
    case 1:
      return 30;
    case 2:
      return 24;
    case 3:
      return 20;
    case 4:
      return 12;
  }
};

const PremText = ({ order = 3, children }: Props) => {
  const size = getSize(order);
  return (
    <Text style={{ fontFamily: 'MusticaPro', fontSize: size, color: '#fff' }}>{children}</Text>
  );
};

// const styles = StyleSheet.create(())

export default PremText;
