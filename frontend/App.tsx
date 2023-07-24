import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import FooterTabs from './src/components/global/FooterTabs';

const App = () => {
  return (
    <NavigationContainer>
      <FooterTabs />
    </NavigationContainer>
  );
};

export default App;
