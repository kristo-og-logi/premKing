import { View } from 'react-native';
import PremText from '../../../components/basic/PremText';
import { globalStyles } from '../../../styles/styles';
import { Stack, useLocalSearchParams } from 'expo-router';

const UserBet = () => {
  const { userId } = useLocalSearchParams();

  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{ headerTitle: `${userId}` }} />
      <PremText>Hello</PremText>
    </View>
  );
};

export default UserBet;
