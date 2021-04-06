import * as React from 'react';
import { render } from 'react-dom';
import { StyleSheet, Alert, View, Text} from 'react-native';
import {Header, Icon, Badge} from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';

export default class MyHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            value: '',
            user: firebase.auth().currentUser.email
        }
    }
    getNumberNotifications(){
        db.collection('notifications').where("notificationStatus", "==", "unread").where("targetUserId", "==", this.state.user).onSnapshot((snapshot)=>{
            var unread = snapshot.docs.map((doc)=>doc.data());
            this.setState({
                value: unread.length
            })
        })
    }
    componentDidMount(){
        this.getNumberNotifications()
    }
    BellIconWithBadge = ()=>{
    return(
      <View>
        <Icon name='bell' type='font-awesome' color='#696969' size={25}
          onPress={() =>this.props.navigation.navigate('Notifications')}/>
         <Badge
          value= {this.state.value}
         containerStyle={{ position: 'absolute', top: -4, right: -4 }}/>
      </View>
    )
  }
  render(){ 
    return(
        <Header 
        leftComponent = {<Icon name = 'bars' type = 'font-awesome' color = '#696969' onPress = {()=> this.props.navigation.toggleDrawer()}></Icon>}
        centerComponent = {{text: this.props.title}} style= {{
            color: '#90a5a9',
            fontSize: 20,
            fontWeight: "bold"}}
        rightComponent = {<this.BellIconWithBadge {...this.props}/>}
        backgroundColor = '#e8f8fe'></Header>
    )
}
}



  

