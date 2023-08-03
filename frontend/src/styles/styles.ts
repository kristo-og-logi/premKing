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
    padding: 8,
  },
});
