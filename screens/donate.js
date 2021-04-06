import React from 'react';
import {StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Button, ScrollView, Image} from 'react-native';
import db from '../config';
import {Input} from 'react-native-elements';
import MyHeader from '../components/header';
import firebase from 'firebase';
import {BookSearch} from 'react-native-google-books';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import {RFValue} from 'react-native-responsive-fontsize'

export default class RequestScreen extends React.Component {
    constructor(){
        super();
        this.state = {
            userID: firebase.auth().currentUser.email,
            item: '',
            description: '',
            isBookRequestActive: '',
            requestedBookName: '',
            bookStatus: '',
            requestId: '',
            userDocId: '',
            docId:'',
            showFlatList: false,
            datasource: '',
        }
    }
    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }
    
    getBookRequest= async()=>{
        var bookRequest = db.collection('allTrades').where('addedBy', '==', this.state.userID).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().requestStatus != 'received'){
                    this.setState({
                        requestId: doc.data().Id,
                        requestedBookName: doc.data().item,
                        bookStatus: doc.data().requestStatus,
                        docId: doc.id
                    })
                }
            })
        })
    }
    receivedBooks=(item)=>{
        var userId = this.state.userID
        var requestId=  this.state.requestId
        db.collection('allTrades').doc(this.state.docId).update({
            requestStatus: 'received',
        })
    }
    getIsBookRequestActive=()=>{
        db.collection('users').where('emailId', '==', this.state.userID).onSnapshot(querySnapshot=>{
            querySnapshot.forEach((doc)=>{
                this.setState({
                    isBookRequestActive: doc.data().isBookRequestActive,
                    userDocId: doc.id
                })
            })
        })
    }
    sendNotification = ()=>{
        db.collection('users').where('emailId', '==', this.state.userID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name= doc.data().firstName;
                var lname= doc.data().lastName;
                db.collection('notifications').where('requestId', '==', this.state.requestId).get().then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        var donorId = doc.data().donorId;
                        var item= doc.data().item;
                        db.collection('notifications').add({
                            targetUserId: donorId,
                            message: name+' '+lname+ ' has received '+ item,
                            notificationStatus: 'unread',
                            date: firebase.firestore.FieldValue.serverTimestamp(),
                            item: item,
                            donor: donorId
                        })
                    })
                })
            })
        })
    }
    addRequest = async(item, request)=>{
        var userID = this.state.userID;
        var requestId = this.createUniqueId();
        db.collection('items').add({
            "userId": userID,
            "item": item,
            "description": request,
            "ID": requestId
        })
        await this.getBookRequest();
        db.collection('users').where("emailId", "==", userID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({isBookRequestActive: true})
            })
        })
        this.setState({
            item: '',
            description: '' 
        })
        return Alert.alert("Book Requested");
    }
    updateBookRequestStatus = ()=>{
        db.collection('users').where('emailId', '==', this.state.userID).get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    isBookRequestActive: 'false'
                })
            })
        })
    }
    componentDidMount(){
        this.getBookRequest();
        this.getIsBookRequestActive();
    }
    renderItem= ({item, i})=>{
        return(
            <TouchableHighlight style = {styles.highlight} activeOpacity={0.6} underlayColor= '#808080' onPress={()=> {
                this.setState({
                    showFlatList: false,
                    item: item.volumeInfo.item
                })}} bottomDivider>
                    <Text> {item.volumeInfo.item}</Text>
                </TouchableHighlight>
        )
    }
    render(){
        if(this.state.isBookRequestActive == true){
            <View style = {{flex: 1}}>
                <MyHeader item = "Add Item"></MyHeader>
            <View style = {{flex: 1, justifyContent: 'center'}}>
                <View style = {{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <Text>Item</Text>
                    <Text>{this.state.requestedBookName}</Text>
                </View>
                <View style = {{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
                    <Text>Status</Text>
                    <Text>{this.state.bookStatus}</Text>
                </View>
                <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
                onPress= {()=>{
                    this.sendNotification()
                    this.updateBookRequestStatus();
                    this.receivedBooks(this.state.requestedBookName);
                }}>
                    <Text>I have received the book</Text>
                </TouchableOpacity>
            </View>
            </View>
        }else{
        return(
            <View style = {{flex: 1}}>
                <MyHeader item = "Request Book"></MyHeader>
                <KeyboardAvoidingView style = {styles.keyView}>
                    <Input style = {styles.input} placeholder = {"item"} label = {"item"} 
                    value = {this.state.item}></Input>
                    {this.state.showFlatList? (
                        <FlatList data = {this.state.datasource} renderItem = {this.renderItem} style = {{marginTop:10}} keyExtractor= {(item, index)=>index.toString()}></FlatList>
                    ) : (
                        <View>
                        <TextInput style = {styles.input} placeholder = {"description"}
                        onChangeText = {(text)=>{this.setState({
                            description: text
                        })}} value = {this.state.description}></TextInput>
                        <TouchableOpacity style = {styles.button} onPress = {()=>{
                            this.addRequest(this.state.item, this.state.description)
                        }}>
                            <Text style = {styles.buttonText}>Add Item</Text>
                        </TouchableOpacity>
                        </View>
                    )}
                </KeyboardAvoidingView>
            </View>
        )}
    }
}

const styles = StyleSheet.create({
    keyView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    highlight:{
        alignItems: 'center',
        backgroundColor: '#808080',
        padding: 10,
        width: '70%'
    },
    button: {
        width: 300,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff9800',
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.30,
        shadowRadius: 10.32,
        elevation: 16,
        marginTop: 20
    },
    input: {
        width: '75%',
        height: 30,
        borderBottomWidth: 1.5,
        borderColor: '#ff8a65',
        fontSize: 12,
        marginTop: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        alignSelf: 'center'
    },
    buttonText:{
        color: 'black',
        fontSize: 20
    }
})