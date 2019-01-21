/**
 * Dependences
 * Typings v0.1
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, AppRegistry} from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native';
import PouchDBAuth from 'pouchdb-authentication';
import { API_URL, PORT_API_DIRECT, PORT_API } from 'react-native-dotenv';
import { createStackNavigator, createAppContainer } from 'react-navigation';


/**
 * Screens
 * Navigation
 *
 * @format
 * @flow
 */
import SignedOut from './screens/signedOut.js';
import SignedIn from './screens/signedIn.js';

PouchDB.plugin(PouchDBAuth)
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let initRoute;



const Routes = createStackNavigator({
    SignedOut:{
        screen: SignedOut,
        navigationOptions: {
                 header: null//Will hide header for LoginStack 
           }
    },
    SignedIn:{
        screen: SignedIn,
        navigationOptions: {
             headerLeft: null,
             title: 'Typings',
             gesturesEnabled: false,
             headerStyle: {
              backgroundColor: '#333',
               },
             headerTintColor: '#fff',
             headerTitleStyle: {
               fontWeight: '200',
              },
       }
    }
}, {initialRouteName: initRoute});

const AppNavigator = createAppContainer(Routes);
module.exports = Routes;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = { navigation: Function }



export default class App extends Component<Props> {
  constructor(props) {
      super(props)
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


      /*<Text style={styles.instructions}>To get started, edit App.js</Text>*/
        /*<Text style={styles.instructions}>{instructions}</Text>*/

  render() {

    return (

        <AppNavigator style={{marginTop: 0, paddingTop: 0}} navigation={this.props.navigation}/>

    );
  }
}
 
module.exports = App;
AppRegistry.registerComponent('Navigation', () => Navigation);