/**
 * Dependences
 * Typings v0.1
 *
 * @format
 * @flow
 */
import React, {Component} from 'react';
import {Platform, AppRegistry, ActivityIndicator, StyleSheet, Animated, Easing} from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native';
import APIAuth from 'pouchdb-authentication';
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import {  API_URL, 
          PORT_API_DIRECT, 
          PORT_API, 
          DB_BOOKS, 
          INDEX_NAME, 
          LOCAL_DB_NAME, 
          API_STATIC, 
          SETTINGS_LOCAL_DB_NAME 
  } from 'react-native-dotenv'
import { createStackNavigator, createAppContainer, NavigationActions } from 'react-navigation';

/**
 * Screens
 * Navigation
 *
 * @format
 * @flow
 */
import SignedOut from './screens/signedOut.js';
import SignedIn from './screens/signedIn.js';

PouchDB.plugin(APIAuth)
PouchDB.plugin(APIFind);
PouchDB.plugin(APIUpsert);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
let APILocalSettings = PouchDB(SETTINGS_LOCAL_DB_NAME);


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
              header: null
             /*headerLeft: null,
             title: 'Typings',
             gesturesEnabled: false,
             headerStyle: {
              backgroundColor: '#333',
               },
             headerTintColor: '#fff',
             headerTitleStyle: {
               fontWeight: '200',
              },*/
       }
    }
}, { initialRouteName: initRoute });

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
         isLoading: true,
         isLoggedIn: false
      }

   }
   componentDidMount() {
     APILocalSettings.get('UserSettings')
        .then(res => {
          console.log("get user settings app.js", res)
          if(res.username != null){
             console.log("User settings APPP!!", res);
             this.setState({ isLoading: false, isLoggedIn: true });
          } else {
            this.setState({ isLoading: false });
         }

            
        })
        .catch(err => {
          this.setState({ isLoading: false });
        })
     
   }
   onNext = () => {
      this.setState({introText: 'My Changed Text'})
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
        if(this.state.isLoggedIn == true) {
          console.log("is logged in!")
          return (
            <SignedIn style={{marginTop: 0, paddingTop: 0}} 
            navigation={this.props.navigation}/>
          );
        } else {
          console.log("is not logged in!")
          return (
            <AppNavigator style={{marginTop: 0, paddingTop: 0}} navigation={this.props.navigation}/>
          );
        }
    }
  }
}

module.exports = App;

const styles = StyleSheet.create({
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});

AppRegistry.registerComponent('Navigation', () => Navigation);