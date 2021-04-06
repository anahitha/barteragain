import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import WelcomeScreen from './screens/welcome';
import {AppDrawerNavigator} from './components/appDrawerNavig.js';

export default function App(){
  return (
    <AppContainer/>
  );}

const switchNavigator = createSwitchNavigator({
    FirstScreen: {screen: WelcomeScreen},
    Drawer: {screen: AppDrawerNavigator}
})

const AppContainer = createAppContainer(switchNavigator)