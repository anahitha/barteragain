import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {AppTabNavigator} from './appTabNavigator';
import CustomMenu from './CustomMenu';
import Settings from '../screens/update';
import NotificationScreen from '../screens/notification';
import MyTrades from '../screens/myTrades';


export const AppDrawerNavigator = createDrawerNavigator({
    Home: {screen: AppTabNavigator},
    Settings: {screen: Settings},
    MyTrades: {screen: MyTrades},
    Notifications: {screen: NotificationScreen}
},{
    contentComponent: CustomMenu
},{
    initialRouteName: 'Home'
}
)