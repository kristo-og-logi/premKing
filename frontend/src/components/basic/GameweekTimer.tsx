import { useAppSelector } from '../../redux/hooks';
import { dateFormatter } from '../../utils/constants';
import PremText from './PremText';

interface Props {
  selectedGW: number;
}

const GameweekTimer = ({ selectedGW }: Props) => {
  const gameweekSlice = useAppSelector((state) => state.gameweek);
  const gameweek = gameweekSlice.allGameweeks[selectedGW - 1];

  let txt = '';
  let _target = '';

  if (!gameweek) txt = '...';
  else {
    const now = new Date();
    const opens = new Date(gameweek.opens);
    const closes = new Date(gameweek.closes);
    const finishes = new Date(gameweek.finishes);

    if (now < opens) {
      _target = gameweek.opens;
      txt = `Opens ${dateFormatter.format(opens)}`;
    } else if (now < closes) {
      _target = gameweek.closes;
      txt = `Closes ${dateFormatter.format(closes)}`;
    } else if (now < finishes) {
      _target = gameweek.finishes;
      txt = `Finishes ${dateFormatter.format(finishes)}`;
    } else if (finishes < now) txt = `Finished ${dateFormatter.format(finishes)}`;
  }

  return <PremText centered>{txt}</PremText>;
};

export default GameweekTimer;
