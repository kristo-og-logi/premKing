import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import GameweekScorer from '../../../../components/basic/GameweekScorer';
import GameweekShifter from '../../../../components/basic/GameweekShifter';
import PremText from '../../../../components/basic/PremText';
import PastGameweekBet from '../../../../components/bet/past/PastGameweekBet';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import type { BetState } from '../../../../redux/reducers/betReducer';
import { getFriendBets } from '../../../../redux/reducers/betReducer';
import { getFixtures } from '../../../../redux/reducers/fixtureReducer';
import { globalStyles } from '../../../../styles/styles';
import { GameweekStatus } from '../../../../types/Gameweek';
import { getGameweekStatus } from '../../../../utils/leagueUtils';
import { useTimeUntil } from '../../../../utils/timer';

const findHeaderTitle = (betSlice: BetState) => {
  if (betSlice.friendBetsIsLoading) return 'Loading...';
  if (betSlice.friendBetsHasError) return ':(';

  const name = betSlice.friendBets?.friend.name || '';

  const firstName = name.split(' ')[0];
  return `${firstName}'s bets`;
};
const UserBet = () => {
  const { userId, gw } = useLocalSearchParams();

  const gwNum = typeof gw === 'string' ? Number(gw) : NaN;
  const gwError = !Number.isFinite(gwNum);

  // ensure all hooks are unconditional for some reason
  const dispatch = useAppDispatch();
  const authSlice = useAppSelector((state) => state.auth);
  const betSlice = useAppSelector((state) => state.bets);
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  const [selectedGW, setSelectedGW] = useState<number | null>(Number.isFinite(gwNum) ? gwNum : null);
  const [timeUntil, _] = useTimeUntil(gameweekSlice.allGameweeks[(selectedGW || 1) - 1].closes);

  useEffect(() => {
    dispatch(getFixtures(selectedGW || 0));
  }, [selectedGW]);

  useEffect(() => {
    if (!userId) return;
    if (typeof userId !== 'string') return;

    dispatch(getFriendBets({ userId: userId, gw: 1, token: authSlice.token }));
  }, [userId]);

  if (gwError || selectedGW === null) {
    return <PremText>Gameweek error </PremText>;
  }

  const renderGameweekBet = () => {
    const gwStatus = getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]);

    // if the gameweek is not closed, we will not display any bets
    if (
      selectedGW > gameweekSlice.currentGameweek ||
      (selectedGW === gameweekSlice.currentGameweek && gwStatus === GameweekStatus.OPEN)
    )
      return (
        <View>
          {false && <PremText centered order={2}>{`closes in ${timeUntil}`}</PremText>}
          <PremText
            order={3}
            centered
            padding={16}
          >{`You can view ${findHeaderTitle(betSlice)} once GW${selectedGW} closes`}</PremText>
        </View>
      );

    return (
      <PastGameweekBet
        fixtures={fixtureSlice.fixtures}
        bets={betSlice.friendBets?.tickets[selectedGW - 1].bets || []}
      />
    );
  };

  return (
    <View style={globalStyles.container}>
      <Stack.Screen options={{ headerTitle: findHeaderTitle(betSlice) }} />
      {betSlice.friendBetsIsLoading ? (
        <PremText>Loading...</PremText>
      ) : betSlice.friendBetsHasError ? (
        <PremText>Error loading bets</PremText>
      ) : (
        <>
          <GameweekShifter
            selectedGW={selectedGW}
            setSelectedGameweek={(newGw) => {
              setSelectedGW(newGw);
            }}
          />
          {betSlice.friendBets && <GameweekScorer ticket={betSlice.friendBets.tickets[selectedGW - 1]} />}
          <ScrollView>
            {fixtureSlice.isLoading ? (
              <PremText>loading...</PremText>
            ) : fixtureSlice.hasError ? (
              <PremText>Error</PremText>
            ) : (
              renderGameweekBet()
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default UserBet;
