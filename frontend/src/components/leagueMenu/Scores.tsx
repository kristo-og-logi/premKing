import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useAppSelector } from '../../redux/hooks';
import type { BetState } from '../../redux/reducers/betReducer';
import type { GameweekState } from '../../redux/reducers/gameweekReducer';
import type { ScoreState } from '../../redux/reducers/scoreReducer';
import { colors, globalStyles } from '../../styles/styles';
import { GameweekStatus } from '../../types/Gameweek';
import { getGameweekStatus } from '../../utils/leagueUtils';
import PremText from '../basic/PremText';

interface Props {
  selectedGW: number;
}

const getMyScore = (
  scoreSlice: ScoreState,
  betSlice: BetState,
  gameweekSlice: GameweekState,
  selectedGW: number,
): string => {
  const gwStatus = getGameweekStatus(gameweekSlice.allGameweeks[selectedGW - 1]);
  const isCurrentGW = selectedGW === gameweekSlice.currentGameweek;

  // waiting for data..
  if (scoreSlice.isLoading || scoreSlice.scores[selectedGW - 1] === undefined || betSlice.isLoading) return '...';
  // gameweek has not yet finished
  if (selectedGW > gameweekSlice.currentGameweek || (isCurrentGW && gwStatus === GameweekStatus.OPEN)) return '??';
  // no bets were placed for past gameweek
  if (betSlice.bets[selectedGW - 1].bets.length === 0) return 'Missed';

  // default: bet placed for past gameweek
  return `x${scoreSlice.scores[selectedGW - 1].score.toFixed(2)}`;
};

const Scores = ({ selectedGW }: Props) => {
  const scoreSlice = useAppSelector((state) => state.scores);
  const betSlice = useAppSelector((state) => state.bets);
  const gameweekSlice = useAppSelector((state) => state.gameweek);

  return (
    <View style={[styles.gwScores]}>
      <View style={[styles.secondaryCard, globalStyles.shadow]}>
        <PremText order={4}>Total</PremText>
        <PremText>
          {scoreSlice.hasError
            ? 'error'
            : scoreSlice.isLoading
              ? '...'
              : `x${scoreSlice.scores[selectedGW - 1]?.total.toFixed(2) || '?.??'}`}
        </PremText>
      </View>

      <View style={[styles.mainCard, globalStyles.shadow]}>
        <PremText>My score</PremText>
        <PremText order={2}>{getMyScore(scoreSlice, betSlice, gameweekSlice, selectedGW)}</PremText>
      </View>
      {/* <View style={[styles.secondaryCard, globalStyles.shadow]}>
      <PremText order={4}>Max</PremText>
      <PremText order={3}>x12.19</PremText>
    </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  gwScores: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 12,
  },
  mainCard: {
    height: 72,
    width: 108,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[3],
    borderRadius: 4,
  },
  secondaryCard: {
    height: 60,
    width: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.charcoal[2],
    borderRadius: 4,
  },
});

export default Scores;
