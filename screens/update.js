import * as React from 'react';
import {View, ScrollView, TouchableOpacity, Text, TextInput, KeyboardAvoidingView, Alert, StyleSheet} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/header'

export default class Settings extends React.Component{
    constructor(){
        super();
        this.state = {
            email: '',
            address: '',
            firstName: '',
            lastName: '',
            contact: '',
            docID: ''
        }
    }
    getUserDetails = ()=>{
        var email = firebase.auth().currentUser.email;
        db.collection('users').where("email", "==", email).get().then(snapshot=>{
            snapshot.forEach(doc=>{
                var data = doc.data();
                this.setState({                 
                    email: data.email,
                    address: data.address,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    contact: data.contact,
                    docID: doc.id
                })
            })
        })
    }
    updateDetails = ()=>{
        db.collection('users').doc(this.state.docID).update({
            address: this.state.address,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            contact: this.state.contact,
        })
        Alert.alert('Profile Updated')
    }
    componentDidMount(){
        this.getUserDetails();
    }
    render(){
        return(
            <View>
                <MyHeader title = "Settings" navigation = {this.props.navigation}></MyHeader>
                    <ScrollView style = {{width: '100%'}}>
                        <KeyboardAvoidingView >
                            <Text style = {styles.modaltitle}>Update</Text>
                            <TextInput style = {styles.textinput} placeholder = {"first name"}
                            maxLength = {8} onChangeText = {(text)=>{
                                this.setState({
                                    firstName: text
                                })
                            }} 
                            value = {this.state.firstName}>
                            </TextInput>
                            <TextInput style = {styles.textinput} placeholder = {"last name"}
                            maxLength = {8} onChangeText = {(text)=>{
                                this.setState({
                                    lastName: text
                                })
                            }}
                            value = {this.state.lastName}>
                            </TextInput>
                            <TextInput style = {styles.textinput} placeholder = {"address"}
                            multiline = {true} onChangeText = {(text)=>{
                                this.setState({
                                    address: text
                                })
                            }}
                            value = {this.state.address}>
                            </TextInput>
                            <TextInput style = {styles.textinput} placeholder = {"contact"}
                            maxLength = {10} keyboardType= {'numeric'} onChangeText = {(text)=>{
                                this.setState({
                                    contact: text
                                })
                            }}
                            value = {this.state.contact}>
                            </TextInput>
                            <View>
                                <TouchableOpacity style = {styles.register} onPress = {()=>{
                                    this.updateDetails()
                                }}>
                                    <Text style = {styles.buttonText}>Update</Text>
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8be85',
    },
    buttonText:{
        color: 'black',
        fontSize: 20
    },
    keyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modaltitle: {
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: 30,
        color:'#ff5722',
        margin: 50
    },
    modalcontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'white',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 80,
        marginBottom: 80
    },
    textinput: {
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
    register: {
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ff5722',
        fontSize: 15,
        fontWeight: 'bold'
    },
    cancel: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        height: 30,
        marginTop: 5
    }

})