import React from 'react';
import type {Node} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Tabs from './navigation/Tabs'



const App: () => Node = () => {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
};

export default App;
