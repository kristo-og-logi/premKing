import { View } from 'react-native';
import PremText from '../../../components/basic/PremText';
import { globalStyles } from '../../../styles/styles';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFriendBets } from '../../../redux/reducers/betReducer';

const UserBet = () => {
    const { userId } = useLocalSearchParams();

    const dispatch = useAppDispatch();
    const authSlice = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (!userId) return;
        if (typeof userId !== 'string') return;

        console.log('using effect');
        dispatch(getFriendBets({ userId: userId, gw: 1, token: authSlice.token }));
    }, [userId]);

    return (
        <View style={globalStyles.container}>
            <Stack.Screen options={{ headerTitle: `${userId}` }} />
            <PremText>Hello</PremText>
        </View>
    );
};

export default UserBet;
