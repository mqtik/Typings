/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground} from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import PouchDBAuth from 'pouchdb-authentication'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API } from 'react-native-dotenv'
PouchDB.plugin(PouchDBAuth)
let url = "http://mqserv.com";
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};



export default class SignedIn extends Component<Props> {
  constructor() {
      super()
      this.state = {
         introText: '',
         username: null,
         password: null,
         auth: null,
         placeholder: 'Username',
         showPassword: false,
         color: 'red',
         exist: 'false'
      }
   }
   onNext = () => {
      this.setState({introText: 'My Changed Text'})
   }
   _onPress = () => {
     
   }
   
      /*<Text style={styles.instructions}>To get started, edit App.js</Text>*/
        /*<Text style={styles.instructions}>{instructions}</Text>*/

  render() {
    return (
        <View>
           <Text>Hola</Text>
         </View>
    );
  }
}
 
module.exports = SignedIn;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'rgba(255,255,255,.4)'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputAuth: {
    height: 50, 
    fontSize: 20,
    borderColor: 'transparent', 
     alignSelf: 'flex-start',
     width: '100%',
    borderWidth: 1
  },
  imgBackground: {
    justifyContent: 'center',
    alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1 
},
  pressLogIn: {
    fontSize: 30, 
    marginTop: 9,
    marginRight: 8,
    color: '#fff',
    alignSelf: 'flex-end',
    borderWidth: 0
  },
  buttonAuthBack: { 
    borderRadius: 30,
    width: 1,
    backgroundColor: "#111",
    flex: 2, 
    paddingRight: 10,
    marginRight: 10
  },
  buttonAuth: { 
        borderRadius: 30,
        width: 1,
    backgroundColor: "#111",
    flex: 2, 
    paddingRight: 10 
  },
  logInContainer: {
    position: 'absolute', 
    bottom:40, 
    flex: 1, 
    flexDirection: 'row',
    borderRadius: 33,
    padding: 10,
    borderWidth: 0.1,
    borderColor: 'rgba(255,255,255,.5)',
    backgroundColor: 'rgba(255,255,255,.3)',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 10,
    shadowOpacity: 1,
    width: '90%'
  }
});
