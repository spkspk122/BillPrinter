import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import {SCREENS} from '../screens';
import screenNames from '../screenNames';

const AuthNavigation = () => {
  const Stack = createNativeStackNavigator();

  const authScreens = [
    {
      id: 1,
      name: SCREENS?.SPLASH,
      component: screenNames?.Splash,
      animation:'default'
    },
    {
      id: 2,
      name: SCREENS?.LOGIN,
      component: screenNames?.Login,
      animation:'fade'
    },
    {
      id: 3,
      name: SCREENS?.BOTTOMTAB,
      component: screenNames?.AppTabs,
      animation:'fade'
    },
    {
      id: 4,
      name: SCREENS?.INVESTEDAMOUNT,
      component: screenNames?.Investment,
      animation:'fade'
    },
      {
      id: 5,
      name: SCREENS?.ORDERLIST,
      component: screenNames?.OrderList,
      animation:'fade'
    },
      {
      id: 6,
      name: SCREENS?.HOME,
      component: screenNames?.Home,
      animation:'fade'
    },
       {
      id: 7,
      name: SCREENS?.OREDERTAKING,
      component: screenNames?.CartScreen,
      animation:'fade'
    },

       {
      id: 8,
      name: SCREENS?.PRINT,
      component: screenNames?.CheckoutScreen,
      animation:'fade'
    },
    {
      id:9,
        name: SCREENS?.Report,
      component: screenNames?.SalesReportScreen,
      animation:'fade'
    }
    
  ];
  return (
    <Stack.Navigator initialRouteName={SCREENS.SPLASH}>
      {authScreens?.map((item, i) => (
        <Stack.Screen
          name={item?.name}
          component={item?.component}
          options={{headerShown: false,animation:item?.animation}}
          key={i}
          
        />
      ))}
    </Stack.Navigator>
  );
};

export default AuthNavigation;
