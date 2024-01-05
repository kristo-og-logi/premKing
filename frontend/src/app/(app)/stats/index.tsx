import React from 'react';
import { View } from 'react-native';
import { globalStyles } from '../../../styles/styles';
import PremText from '../../../components/basic/PremText';
import PremButton from '../../../components/basic/PremButton';

import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { clearUser } from '../../../redux/reducers/userReducer';

const Stats = () => {
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  return (
    <View style={globalStyles.container}>
      <PremText>Some stats</PremText>
      <PremText>{`You are: ${userSlice.user?.Name}`}</PremText>
      <PremButton
        onPress={() => {
          dispatch(clearUser());
        }}
      >
        Logout
      </PremButton>
    </View>
  );
};

export default Stats;
