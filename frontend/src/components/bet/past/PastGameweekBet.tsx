
import { StyleSheet, View } from 'react-native';
import type { Bet } from '../../../types/Bet';
import type Fixture from '../../../types/Fixture';
import PastMatchUp from './PastMatchUp';

interface Props {
  fixtures: Fixture[];
  bets: Bet[];
}
const PastGameweekBet = ({ fixtures, bets }: Props) => {
  return (
    <View style={[styles.fixtureList]}>
      {fixtures.map((fixture) => (
        <PastMatchUp bet={bets.find((b) => b.fixtureId === fixture.id)} key={fixture.id} fixture={fixture} />
      ))}
    </View>
  );
};

export default PastGameweekBet;

const styles = StyleSheet.create({
  fixtureList: {
    gap: 12,
  },
});
