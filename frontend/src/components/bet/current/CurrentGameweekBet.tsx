
import { StyleSheet, View } from 'react-native';
import { useAppSelector } from '../../../redux/hooks';
import type { Bet, Ticket } from '../../../types/Bet';
import type Gameweek from '../../../types/Gameweek';
import { GameweekStatus } from '../../../types/Gameweek';
import { getGameweekStatus } from '../../../utils/leagueUtils';
import CurrentMatchUpBet from './CurrentMatchUpBet';

interface Props {
  bet: Bet[];
  setBet: (bet: Bet[]) => void;
}

const isDisabled = (ticket: Ticket, gw: Gameweek): boolean => {
  const gwStatus = getGameweekStatus(gw);

  return ticket.bets.length > 0 || gwStatus >= GameweekStatus.CLOSED;
};

const CurrentGameweekBet = ({ bet, setBet }: Props) => {
  const fixtureSlice = useAppSelector((state) => state.fixtures);
  const betSlice = useAppSelector((state) => state.bets);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  return (
    <View style={styles.fixtureList}>
      {fixtureSlice.fixtures.map((fixture) => (
        <CurrentMatchUpBet
          bet={bet}
          setBet={setBet}
          isDisabled={() =>
            isDisabled(betSlice.bets[betSlice.selectedGameweek - 1], gameweekSlice.allGameweeks[fixture.gameWeek - 1])
          }
          key={fixture.id}
          fixture={fixture}
        />
      ))}
    </View>
  );
};

export default CurrentGameweekBet;

const styles = StyleSheet.create({
  fixtureList: {
    gap: 12,
  },
});
