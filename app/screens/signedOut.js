/**
 * Signed Out Component
 * Login & Register
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ActivityIndicator} from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, SETTINGS_LOCAL_DB_NAME, DB_BOOKS, LOCAL_DB_NAME } from 'react-native-dotenv'
PouchDB.plugin(APIAuth)
PouchDB.plugin(APIFind);
PouchDB.plugin(APIUpsert);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
let APILocalSettings = PouchDB(SETTINGS_LOCAL_DB_NAME);



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = { navigation: Function }



export default class SignedOut extends Component<Props> {
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
         exist: 'false',
         isLoading: true
      }
     

   }
   componentDidMount() {
      // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        let Go = this.props.navigation;
        
        APILocalSettings.get('UserSettings')
        .then(res => {
          console.log("User settings!!", res);
        })
        .catch(err => {
          console.log("There's no user logged in!", err)
        })
            API.getSession((err, response) => {

                if (err) {
                  // network error
                } else if (!response.userCtx.name) {
                  // nobody's logged in
                } else {
                  API.getUser(response.userCtx.name).then(res => {
                    console.log("Get user from API", res)
                    APILocalSettings.upsert('UserSettings', doc => {
                     console.log("User settings logged", res.nombre, doc)
                      
                        doc.logged_in = true;
                        doc.username = res.name;
                        doc.nombre = res.nombre;
                        doc.gender = res.gender;
                        doc.allow_push_notifications = res.allow_push_notifications;
                      
                      return doc;
                    }).then((res) => {
                      console.log("User settings saved!", res)
                      APILocalSettings.get('UserSettings').then(doc => {console.log("Get doc!", doc)})
                      Go.navigate("SignedIn");
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("User settings error on saving", error)
                      // error
                    });

                  }).catch(err => { console.log("Something went wrong getting the user")})
                  console.log("Get user session", response)
                  // response.userCtx.name is the current user
                   
                }
           this.setState({ isLoading: false })
          console.log(response,err)
        });
    }
            

   onNext = () => {
      this.setState({introText: 'My Changed Text'})
   }
   _onPress = () => {
     
       console.log("Username", this.state.username)
      if(this.state.username == null && this.state.auth != null && this.state.auth != ""){
        console.log("this go", this.state.auth)
         /*fetch('URL_GOES_HERE', { 
           method: 'post', 
           headers: new Headers({
             'Authorization': 'Basic '+btoa('username:password'), 
             'Content-Type': 'application/x-www-form-urlencoded'
           }), 
           body: 'A=1&B=2'
         });   fetch(API_URL+'/'+this.state.auth)
        .then((response) => response.json())
        .then((responseJson) => {
            return responseJson.movies;
        })*/
         
          fetch(API_URL+':'+PORT_API+'/users/'+this.state.auth.toLowerCase()+'/boolean')
        .then((response) => {
          console.log("Resp user", response)
          if(response._bodyInit == "true"){
              this.setState({color: '#36ca41'});
              this.refs.toast.show('The username exist. \n If it\'s yours, type your password', 2000);
              this.setState({exist: true});
        
          } else {
            this.setState({color: 'red'})  
              this.setState({exist: false});
             this.refs.toast.show('User does not exist. \nType password and create your account.', 2000);
      
          }
        this.setState({username: this.state.auth});
        this.setState(
              {auth: "", placeholder: "Password", showPassword: true}, 
              function () {
                console.log("Updated!", this.state.username)
              }
          )

        })
        .catch((err) => {
            console.log("Err", err)
        })

         } else { 
           if(this.state.username != null){
             console.log("password!", this.state.exist)
             if(this.state.exist == true){
               console.log("Logging in");
               API.logIn(this.state.username, this.state.auth).then(res => {
                  console.log("Logged in!", res);
                  this.setState({color: '#36ca41'});
                  this.refs.toast.show('Bienvenido, '+ this.state.username, 2000);
                   this.props.navigation.navigate("SignedIn")
                  /*return API.logOut();*/
                }).catch(err => {
                  this.setState({color: 'red'});
                    this.refs.toast.show("Error de inicio de sesión", 2000);
      
                  console.log("Hubo un error de login")
                });
             } else {
               console.log("Siging myself up", this.state.username, this.state.auth);
               API.signUp(this.state.username, this.state.auth, {
                  metadata : {
                      email : 'somethingkeetup',
                      birthday : 'marzo 8',
                      likes : ['harry potter', 'la tregua', 'forrest gump\''],
                    }
               }).then(res => {
                  console.log("Registered!", res);
                  this.setState({color: '#36ca41'});
                  this.refs.toast.show('Te has registrado con éxito. \n Bienvenido, '+ this.state.username, 2000);
                   this.props.navigation.navigate("SignedIn")
                  /*return API.logOut();*/
                }).catch(err => {
                  this.setState({color: 'red'});
                    this.refs.toast.show("Error de registro", 2000);
                  console.log("Hubo un error de signup")
                });
             }
           } else {
               this.setState({color: 'red'})

             this.refs.toast.show('Type a username', 2000);
           }
             
           
      }



   }
    _onGoBackAuth = () => {
      console.log("Go back!")

        this.state.username = this.state.auth;
        this.state.auth = null;
        this.state.placeholder = 'User';

        this.setState({auth: "", placeholder: "Username", showPassword: false, username: null});
        console.log(this.state.placeholder)

   }

      /*<Text style={styles.instructions}>To get started, edit App.js</Text>*/
        /*<Text style={styles.instructions}>{instructions}</Text>*/

  render() {
   
    if (this.state.isLoading == true) {
      return (
        <ActivityIndicator
            style={styles.indicator}
            color="#000"
            size="large"
          />
        )
    } else {
    return (
      

      <View style={styles.container}>
      <ImageBackground style={ styles.imgBackground } 
                 resizeMode='cover' 
                 source={require('../../assets/bg.jpg')}>
        <Text style={styles.welcome}>Typings</Text>
       <Text style={styles.welcome}>{this.state.introText}</Text>


       <View style={styles.logInContainer}>
        <View style={{ flex: 10, paddingLeft: 10 }}>
          <TextInput
            style={styles.inputAuth}
            onChangeText={(text) => this.setState({auth: text})}
            value={this.state.auth}
            placeholder={this.state.placeholder}
            placeholderTextColor="#999"
            password={true}
            secureTextEntry={this.state.showPassword}
            autoCapitalize = 'none'
          />
        </View>
        {this.state.showPassword && 
          <TouchableOpacity style={styles.buttonAuthBack} onPress={this._onGoBackAuth}>
          <Icon name="angle-double-left" style={styles.pressLogIn} />
        </TouchableOpacity>}
        <TouchableOpacity style={styles.buttonAuth} onPress={this._onPress}>
          <Icon name="angle-double-right" style={styles.pressLogIn} />
        </TouchableOpacity>
         
      </View>
      <Toast
                    ref="toast"
                    style={{backgroundColor:this.state.color}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1000}
                    opacity={0.8}
                    textStyle={{color:'white'}}
                />
      </ImageBackground>
      </View>

    );
    }
  }
}
 
export class GoBackAuth extends SignedOut {
 
  render() {
    return (
      <TouchableOpacity style={styles.buttonAuthBack} onPress={this._onGoBackAuth}>
          <Icon name="angle-double-left" style={styles.pressLogIn} />
        </TouchableOpacity>
    );
  }
}

module.exports = SignedOut;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
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
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});
