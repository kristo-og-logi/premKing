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
      <PremText order={2} centered>
        Some stats
      </PremText>
      <PremText>{`name: ${userSlice.user?.name}`}</PremText>
      {userSlice.user?.email && <PremText>{`email: ${userSlice.user?.email}`}</PremText>}
      <View style={globalStyles.centered}>
        <PremButton
          onPress={() => {
            dispatch(clearUser());
          }}
        >
          Logout
        </PremButton>
      </View>
    </View>
  );
};

export default Stats;
