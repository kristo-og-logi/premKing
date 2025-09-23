import { Image } from 'react-native';
import googleImage from '../../assets/google.png';
import PremButton from './basic/PremButton';

interface Props {
  onPress: () => void;
}

const GoogleButton = ({ onPress }: Props) => {
  return (
    <PremButton onPress={onPress} fullWidth Icon={<Image source={googleImage} style={{ height: 28, width: 28 }} />}>
      Sign in with Google
    </PremButton>
  );
};

export default GoogleButton;
