import React from 'react';
import {StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, ListViewComponent} from 'react-native';
import {ListItem, Card, Icon} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import MyHeader from '../components/header';

export default class MyTrades extends React.Component{
    constructor(){
        super();
        this.state={
            traderID: firebase.auth().currentUser.email,
            traderName: '',
            allDonations: []
        }
        this.requestref= null;
    }
    static navigationOptions = {header: null};
    getDonerDetails= (traderID)=>{
        db.collection('users').where("email", "==", traderID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    traderName: doc.data().firstName+" "+doc.data().lastName
                })
            })
        })
    }
    getAllDonations = ()=>{
        this.requestref = db.collection('allTrades').where("traderId", "==", this.state.traderID).onSnapshot((snapshot)=>{
            var allDonations=[];
            snapshot.docs.map((doc)=>{
                var donation = doc.data();
                donation["docId"]=doc.id;
                allDonations.push(donation)
            })
            this.setState({
                allDonations: allDonations
            })
        })
    }
    sendBook= (details)=>{
        if(details.request_status == "Book Sent"){
            var requestStatus = "Interested";
            db.collection('allTrades').doc(details.doc_id).update({
                requestStatus: "Interested"
            })
            this.sendNotification(details, requestStatus)
        }else{
            var requestStatus= "Item Sent";
            db.collection('allTrades').doc(details.doc_id).update({
                requestStatus: "Item Sent"
            })
            this.sendNotification(details, requestStatus)
        } 
    }
    sendNotification = (details, requestStatus)=>{
        var Id = details.Id;
        var traderID = details.traderID;
        db.collection('notifications').where("Id", "==", Id).where("trader", "==", traderID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var message = '';
                if(requestStatus=="Book Sent"){
                    message = this.state.traderName + ' has sent your item'
                }else{
                    message= this.state.traderName + ' is interested in trading'
                }
                db.collection("notifications").doc(doc.id).update({
                    message: message,
                    notificationStatus: 'unread',
                    date: firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        })
    }

    keyExtractor = (item, index)=>index.toString()
    renderItem = ({item, i})=>{
        <ListItem 
        key = {i}
        title = {item.bookName}
        subtitle= {"added by: "+ item.requestedBy+"\nStatus: "+ item.requestStatus}
        itemElement={<Icon name = "Book" type = "font-awesome" color = '#696969'></Icon>}
        titleStyle = {{color: 'black', fontWeight: 'bold'}}
        rightElement = {
            <TouchableOpacity style = {[styles.button,{backgroundColor: item.requestStatus == "Item Sent"? "green": "#ff5722"}]}
            onPress = {()=>{
                this.sendBook(item)
            }}>
                <Text style = {{color: "white"}}>{item.requestStatus == "Item Sent"? "Item Sent": "Send Item"}</Text>
            </TouchableOpacity>
        }
        bottomDivider
        >
        </ListItem>
    }
    componentDidMount(){
        this.getDonerDetails(this.state.traderID);
        this.getAllDonations();
    }
    componentWillUnmount(){
        this.requestref=null;
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <MyHeader navigation = {this.props.navigation} title = "My Trades"></MyHeader>
                <View style = {{flex:1}}>
                    {this.state.allDonations.length==0?(
                        <View style = {styles.subtitle}>
                            <Text style = {{fontSize: 20}}>All Trades</Text>
                        </View>
                    ): (
                        <FlatList keyExtractor = {this.keyExtractor}
                        data = {this.state.allDonations}
                        renderItem= {this.renderItem}></FlatList>
                    )}
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    subtitle: {
        flex: 1,
        justifyContent: 'center',
        fontSize: 20,
        alignItems: 'center'
    },
    button: {
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'orange',
        shadowColor: '#000',
        shadowOffset:{width: 0, height: 8},
        elevation: 16
    }
}) 