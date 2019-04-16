/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, Animated, Easing } from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';

import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../utils/animations';

import { createBottomTabNavigator, createStackNavigator, createAppContainer, HeaderBackButton, NavigationActions, StackActions } from 'react-navigation';
import DocScreen from './routes/docScreen.js';
import ReaderScreen from './routes/readerScreen.js';
import ExploreScreen from './routes/exploreScreen.js';
import CreatorsScreen from './routes/creatorsScreen.js';
import ChaptersScreen from './routes/creators/chaptersScreen.js';
import ChapterDetailsScreen from './routes/creators/chapterDetailsScreen.js';
import SettingsScreen from './routes/settingsScreen.js';


PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
let APILocalSettings = PouchDB(SETTINGS_LOCAL_DB_NAME);

const IS_ANDROID = Platform.OS === 'android';
console.log("path", API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS)

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = { navigation: Function }



/*  db.sync('https://'userID':'userPASS'@'serverIP':6984/DBname', {
      live: true
    }).on('change', function (change) {
      console.log(change);
    }).on('error', function (err) {
      console.log(err);
    }).on('complete', function (info) {
      console.log(info);
    });
  }*/

export default class SignedIn extends React.Component {
  constructor(props) {
      super(props);
      console.log("this props signed IN!", this.props);
   }

    _onLogout = () => {
      console.log("Siging out")
          API.logOut((err, response) => {
        if (err) {
          // network error
          console.log("on error", err)
          return null;
        }
        console.log("signedIn onLogout: ", response)
        APILocalSettings.destroy().then(res => {
          APILocalSettings = new PouchDB(SETTINGS_LOCAL_DB_NAME);
          console.log("signedIn: Destroying settings of user!", res)
          const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'SignedOut' })],
            });
          this.props.navigation.dispatch(resetAction);

        });
      })
    }
    render() {
      const HomeNavigator = createStackNavigator({
                        Explore:{
                            screen: ExploreScreen,
                            navigationOptions: {
                                 headerLeft: null,
                                 title: 'Typings',
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        Details:{
                            screen: DocScreen,
                            navigationOptions: {
                                 title: 'Details',
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        Reader:{
                            screen: ReaderScreen,
                            navigationOptions: {
                                 gesturesEnabled: true,
                                 headerStyle: {
                                    backgroundColor: '#333',
                                 },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        }
                    }, {initialRouteName: 'Explore'});

      const CreatorsNavigator = createStackNavigator({
                        Create:{
                            screen: CreatorsScreen,
                            navigationOptions: {
                                 headerLeft: null,
                                 title: 'Creators',
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        Chapters:{
                            screen: ChaptersScreen,
                            navigationOptions: {
                                 title: 'Chapters',
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        },
                        ChapterDetails:{
                            screen: ChapterDetailsScreen,
                            navigationOptions: {
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           }
                        }
                    }, {initialRouteName: 'Create'});

      const SettingsNavigator = createStackNavigator({
                        Account:{
                            screen: SettingsScreen,
                            navigationOptions: {
                                 headerLeft: null,
                                 title: 'Settings',
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                   },
                                 headerTintColor: '#fff',
                                 headerTitleStyle: {
                                   fontWeight: '200',
                                  },
                           },

                        }
                    }, {initialRouteName: 'Account'});

        const TabNavigation = createBottomTabNavigator({
            Library: {
             screen: HomeNavigator,
                 navigationOptions: {
                    tabBarLabel:"Explore",
                    tabBarIcon: ({ tintColor }) => (
                       <Icono name="ios-git-branch" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Creators: { 
              screen: CreatorsNavigator,
              navigationOptions: {
                    tabBarLabel:"Creators",
                    tabBarIcon: ({ tintColor }) => (
                       <EntypoIcono name="flow-cascade" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Settings: { 
              screen: SettingsNavigator,
              navigationOptions: {
                    tabBarLabel:"Settings",
                    tabBarIcon: ({ tintColor }) => (
                       <Icono name="ios-git-compare" size={20} style={{color: tintColor}} />
                    )
                  }, 
             }
        },{
            swipeEnabled: true,
            animationEnabled: true,
            tabBarOptions: {
              activeBackgroundColor: '#111',
              inactiveBackgroundColor: '#111',
              activeTintColor: '#fff',
              inactiveTintColor: '#666',
              style: {
                backgroundColor: '#111',
              }
            },
            onLogout: this._onLogout
        });
        const MainNavigator = createAppContainer(TabNavigation);
        // return (
        //     <View style={styles.container}>
        //       <MainNavigator/>
        //     </View>
        // );

        return <MainNavigator screenProps={{ onLogout: this._onLogout }}/>
    }
}




module.exports = SignedIn;

