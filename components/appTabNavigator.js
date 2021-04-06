import * as React from 'react';
import {Image } from 'react-native';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import AddItem from '../screens/donate';
import HomeScreen from '../screens/home';

export const AppTabNavigator = createBottomTabNavigator({
    home: { screen: HomeScreen,
    navigationOptions: {
        tabBarLabel: "Barter Items"
    }},
    addItem: { screen: AddItem,
        navigationOptions: {
            tabBarLabel: "Add Items"
        }}
  });
