import * as AppleAuth from 'expo-apple-authentication';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import PremButton from './basic/PremButton';

import appleImage from '../../assets/apple-white.png';

interface Props {
    onPress: () => void;
}

const AppleButton = ({ onPress }: Props) => {
    return (
        <PremButton onPress={onPress} fullWidth Icon={<Image source={appleImage} style={{ height: 32, width: 32 }} />}>
            Sign in
        </PremButton>
        // <AppleAuth.AppleAuthenticationButton
        //     buttonType={AppleAuth.AppleAuthenticationButtonType.SIGN_IN}
        //     buttonStyle={AppleAuth.AppleAuthenticationButtonStyle.BLACK}
        //     onPress={onPress}
        //     cornerRadius={8}
        //     style={styles.button}
        // />
    );
};

// const styles = StyleSheet.create({
//     button: {
//         width: 'auto',
//         height: 48,
//         display: 'flex',
//         flexDirection: 'row',
//         gap: 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderRadius: 8,
//     },
// });

export default AppleButton;
