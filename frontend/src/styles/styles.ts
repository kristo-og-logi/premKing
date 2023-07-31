import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';

const headerStyles = {
  backgroundColor: '#0A475C',
};

export const headerOptions: NativeStackNavigationOptions = {
  headerBackTitleVisible: false,
  headerTintColor: '#fff',
  headerStyle: headerStyles,
  navigationBarColor: '#444444',
};

export const tabBarOptions: BottomTabNavigationOptions = {};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#072936',
  },
});
