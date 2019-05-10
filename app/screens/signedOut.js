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

import Icono from 'react-native-vector-icons/Ionicons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import Toast, {DURATION} from 'react-native-easy-toast'
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { createStackNavigator, createAppContainer, NavigationActions, StackActions } from 'react-navigation';
import { API_URL, PORT_API_DIRECT, PORT_API, SETTINGS_LOCAL_DB_NAME, DB_BOOKS, LOCAL_DB_NAME } from 'react-native-dotenv'
import AppIntroSlider from 'react-native-app-intro-slider';
import LinearGradient from 'react-native-linear-gradient';
import { getLang, Languages } from '../static/languages';

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

const slides = [
                  {
                    key: 'somethun',
                    title: 'Empieza a leer ahora. \n Gratis.',
                    text: 'Explora un mundo de libros diferentes. Puedes leerlos offline cuando no tengas conexión.',
                    icon: 'ios-git-branch',
                    colors: ['#63E2FF', '#B066FE'],
                  },
                  {
                    key: 'somethun1',
                    title: 'Personalizable',
                    text: 'Customizá Typings para ingresar a una historia de perspectivas diferentes. Agrenda la letra, busca capítulos, swipeá o scrolleá para seguir leyendo.',
                    icon: 'ios-git-pull-request',
                    colors: ['#A3A1FF', '#3A3897'],
                  },
                  {
                    key: 'somethun2',
                    title: 'Construye tu libro',
                    text: 'Todo tu contenido estará en constante sincronización con la nube, con diferentes revisiones, asegurando que nunca pierdas nada.',
                    icon: 'ios-git-network',
                    colors: ['#29ABE2', '#4F00BC'],
                  },
                ];

export default class SignedOut extends Component<Props> {
  constructor() {
      super()
      this.state = {
         introText: '',
         username: null,
         password: null,
         auth: null,
         placeholder: Languages.Username[getLang()],
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

            API.getSession((err, response) => {
              console.log("Getting session", response)
                if (err) {
                  // network error
                } else if (!response.userCtx.name) {
                  // nobody's logged in
                } else {
                  API.getUser(response.userCtx.name).then(res => {

                     APILocalSettings.upsert('UserSettings', doc => {
                      
                        doc.logged_in = true;
                        doc.username = res.name;
                        doc.nombre = res.nombre;
                        doc.gender = res.gender;
                        doc.roles = res.roles;
                        doc.allow_push_notifications = res.allow_push_notifications;
                      
                      return doc;
                    }).then((res) => {
                    //  console.log("User settings saved!", res)
                      APILocalSettings.get('UserSettings').then(doc => {console.log("Get doc!", doc)})
                      //Go.navigate("SignedIn");
                      this.onContinueAs();
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                     // console.log("User settings error on saving", error)
                      // error
                    });

                  }).catch(err => { //console.log("Something went wrong getting the user")})
                 // console.log("Get user session", response)
                  // response.userCtx.name is the current user
                     });
                }
           this.setState({ isLoading: false })
          
        });
    }
            

   onContinueAs = () => {
        
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'SignedIn', params: {
                          onLogout: this._onLogout,
                          user: this.state.username
                        } })],
        });
      this.props.navigation.dispatch(resetAction);
   }

   onNext = () => {
      this.setState({introText: 'My Changed Text'})
   }
   _renderItem = props => (
      <LinearGradient
        style={[styles.mainContent, {
          width: props.width,
          height: props.height,
        }]}
        colors={props.colors}
        start={{x: 0, y: .1}} end={{x: .1, y: 1}}
      >
        <Icono style={{ backgroundColor: 'transparent' }} name={props.icon} size={150} color="white" />
        <View style={{marginTop: -240}}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.text}>{props.text}</Text>
        </View>
      </LinearGradient>
  );
   _onPress = () => {
     
      if(this.state.username == null && this.state.auth != null && this.state.auth != ""){
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
              {auth: "", placeholder: Languages.Password[getLang()], showPassword: true}, 
              function () {
              }
          )

        })
        .catch((err) => {
           // console.log("Err", err)
        })

         } else { 
           if(this.state.username != null){
             if(this.state.exist == true){
               API.logIn(this.state.username, this.state.auth).then(res => {
                  this.setState({color: '#36ca41'});
                  this.refs.toast.show('Bienvenido, '+ this.state.username, 2000);
                   //this.props.navigation.navigate("SignedIn")
                   API.getUser(this.state.username).then(res => {
                      APILocalSettings.upsert('UserSettings', doc => {
                          doc.logged_in = true;
                          doc.username = res.name;
                          doc.nombre = res.nombre;
                          doc.gender = res.gender;
                          doc.allow_push_notifications = res.allow_push_notifications;
                        
                        return doc;
                      }).then((res) => {
                        APILocalSettings.get('UserSettings').then(doc => {console.log("Get doc!", doc)})
                        //Go.navigate("SignedIn");
                          this.onContinueAs();
                        // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                      }).catch((error) => {
                        //console.log("User settings error on saving", error)
                        // error
                      });
                    }).catch((error) => {
                      //console.log("User getting user on login", error)
                      // error
                    });
                  /*return API.logOut();*/
                }).catch(err => {
                  this.setState({color: 'red'});
                    this.refs.toast.show("Error de inicio de sesión", 2000);
      
                  //console.log("Hubo un error de login")
                });
             } else {
               API.signUp(this.state.username, this.state.auth, {
                  metadata : {
                      email : 'somethingkeetup',
                      birthday : 'marzo 8',
                      likes : ['harry potter', 'la tregua', 'forrest gump\''],
                    }
               }).then(res => {
                 API.getUser(this.state.username).then(res => {
                      APILocalSettings.upsert('UserSettings', doc => {
                        
                          doc.logged_in = true;
                          doc.username = res.name;
                          doc.nombre = res.nombre;
                          doc.gender = res.gender;
                          doc.allow_push_notifications = res.allow_push_notifications;
                        
                        return doc;
                      }).then((res) => {
                        APILocalSettings.get('UserSettings').then(doc => {console.log("Get doc!", doc)})
                        //Go.navigate("SignedIn");
                        this.onContinueAs();
                        // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                      }).catch((error) => {
                       // console.log("User settings error on saving", error)
                        // error
                      });
                    }).catch((error) => {
                     // console.log("User getting user on login", error)
                      // error
                    });
                  this.setState({color: '#36ca41'});
                  this.refs.toast.show('Te has registrado con éxito. \n Bienvenido, '+ this.state.username, 2000);
                 
                  /*return API.logOut();*/
                }).catch(err => {
                  this.setState({color: 'red'});
                    this.refs.toast.show("Error de registro", 2000);
                //  console.log("Hubo un error de signup")
                });
             }
           } else {
               this.setState({color: 'red'})

             this.refs.toast.show('Type a username', 2000);
           }
             
           
      }



   }
    _onGoBackAuth = () => {
    
        this.state.username = this.state.auth;
        this.state.auth = null;
        this.state.placeholder = 'User';

        this.setState({auth: "", placeholder: "Username", showPassword: false, username: null});
     
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

      <AppIntroSlider
        slides={slides}
        renderItem={this._renderItem}
        paginationStyle={{bottom: 0}}
        showSkipButton={false}
        showPrevButton={false}
        showNextButton={false}
        showDoneButton={false}
      />


       <View style={styles.logInContainer}>
        <View style={{ flex: 10, paddingLeft: 10 }}>
          <TextInput
            style={styles.inputAuth}
            onChangeText={(text) => this.setState({auth: text})}
            value={this.state.auth}
            placeholder={this.state.placeholder}
            placeholderTextColor="#fff"
            password={true}
            secureTextEntry={this.state.showPassword}
            autoCapitalize = 'none'
          />
        </View>
        {this.state.showPassword && 
          <TouchableOpacity style={styles.buttonAuthBack} onPress={this._onGoBackAuth}>
          <Icono name="ios-arrow-dropleft" style={styles.pressLogIn} />
        </TouchableOpacity>}
        <TouchableOpacity style={styles.buttonAuth} onPress={this._onPress}>
          <Icono name="ios-arrow-dropright" style={styles.pressLogIn} />
        </TouchableOpacity>
          {Platform.OS == 'ios' && <KeyboardSpacer /> }
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


       
      </View>


    );
    }
  }
}
 
export class GoBackAuth extends SignedOut {
 
  render() {
    return (
      <TouchableOpacity style={styles.buttonAuthBack} onPress={this._onGoBackAuth}>
          <Icono name="ios-arrow-dropleft" style={styles.pressLogIn} />
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
    borderWidth: 1,
    color: '#f4f4f0'
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
    color: '#fff',
    borderWidth: 0,
  },
  buttonAuthBack: { 
     borderRadius: 30,
        width: 50,
        height: 50,
    backgroundColor: "#111",
    flex: 0,
    paddingLeft: 12,
    paddingTop: 1,
    marginRight: 5
  },
  buttonAuth: { 
     borderRadius: 30,
        width: 50,
        height: 50,
    backgroundColor: "#111",
    flex: 0,
    paddingLeft: 12,
    paddingTop: 1
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
  },
    mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  image: {
    width: 320,
    height: 320,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 16,
    fontSize: 17,
    paddingRight: 20,
    paddingLeft: 20
  },
  title: {
    fontSize: 26,
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    marginBottom: 16,
  }
});
