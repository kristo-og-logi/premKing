import { StyleSheet, View } from 'react-native';

import type { Ticket } from '../../types/Bet';
import PremText from './PremText';

interface Props {
  ticket: Ticket;
}

const GameweekScorer = ({ ticket }: Props) => {
  if (ticket.bets.length == 0) return;

  return (
    <View style={[styles.score]}>
      <PremText centered order={2}>{`score: x${ticket.score.toFixed(2)}`}</PremText>
    </View>
  );
};

const styles = StyleSheet.create({
  score: {
    marginTop: 4,
  },
});

export default GameweekScorer;
