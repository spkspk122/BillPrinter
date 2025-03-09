import * as React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {NavigationContainer} from '@react-navigation/native';
import NavigationService from './navigationServices';
import {SCREENS} from './screens';
import screenNames from './screenNames';
import AuthNavigation from './authNavigation';

export const AppStack = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer ref={NavigationService.navigationRef}>
      <AuthNavigation />
    </NavigationContainer>
  );
};
