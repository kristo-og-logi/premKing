import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

export const colors = {
  charcoal: ['#020E12', '#072936', '#093749', '#0A475C', '#0E6481', '#1281A5', '#169DCA'],
  red: '#FF1D15',
  green: '#3EC300',
  gray: ['#F8FAFC', '#E2E8F0', '#94A3B8', '#475569'],
};

const headerStyles = {
  backgroundColor: colors.charcoal[3],
};

export const headerOptions: NativeStackNavigationOptions = {
  headerBackTitleVisible: false,
  headerTintColor: colors.gray[0],
  headerStyle: headerStyles,
};

export const tabBarOptions: BottomTabNavigationOptions = {};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.charcoal[1],
    padding: 16,
  },
  premFont: {
    fontFamily: 'MusticaPro',
  },

  shadow: {
    shadowColor: colors.charcoal[0],
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  border: {
    borderWidth: 1,
  },
});

export const scoreboardWidths = StyleSheet.create({
  pointsWidth: {
    width: 70,
  },
  positionWidth: {
    width: 65,
  },
  under10Width: {
    width: 10,
  },
  between10and100Width: {
    width: 25,
  },
  under10WrapperWidth: {
    width: 52,
    marginRight: 8,
  },
  between10and100WrapperWidth: {
    width: 72,
    marginRight: 8,
  },
});
