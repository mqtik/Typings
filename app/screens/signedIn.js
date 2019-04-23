/**
 * Typings SignedIn
 * typings.co
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, Animated, Easing, NativeModules } from 'react-native';
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

// Routes
import DocScreen from './routes/docScreen.js';
import ReaderScreen from './routes/readerScreen.js';
import ExploreScreen from './routes/exploreScreen.js';
import CreatorsScreen from './routes/creatorsScreen.js';
import ChaptersScreen from './routes/creators/chaptersScreen.js';
import ChapterDetailsScreen from './routes/creators/chapterDetailsScreen.js';
import SettingsScreen from './routes/settingsScreen.js';

// Languages
import { getLang, Languages } from '../static/languages';


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
      console.log("Get language!", getLang())
      console.log("Languages started!", Languages.bottomBarCreators[getLang()])
   }

    _onLogout = () => {
      console.log("Siging out", this.props)
          API.logOut((err, response) => {
        if (err) {
          // network error
          console.log("on error", err)
          return null;
        }
        
        console.log("signedIn onLogout: ", response)
          APILocal.destroy().then(res => {
            APILocalSettings.destroy().then(resp => {
                APILocal = PouchDB(LOCAL_DB_NAME);
                APILocalSettings = new PouchDB(SETTINGS_LOCAL_DB_NAME);
                const resetAction = StackActions.reset({
                                      index: 0,
                                      actions: [NavigationActions.navigate({ routeName: 'SignedOut' })]
                                  });
                this.props.navigation.dispatch(resetAction);
            });
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
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                                 title: Languages.Details[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                                    ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                                 title: Languages.bottomBarCreators[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                                 title: Languages.Chapters[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                                 title: Languages.bottomBarSettings[getLang()],
                                 gesturesEnabled: true,
                                 headerStyle: {
                                  backgroundColor: '#333',
                                  ...Platform.select({
                                          android: {
                                            marginTop: 24,
                                          },
                                        })
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
                    tabBarLabel: Languages.bottomBarExplore[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <Icono name="ios-git-branch" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Creators: { 
              screen: CreatorsNavigator,
              navigationOptions: {
                    tabBarLabel:Languages.bottomBarCreators[getLang()],
                    tabBarIcon: ({ tintColor }) => (
                       <EntypoIcono name="flow-cascade" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Settings: { 
              screen: SettingsNavigator,
              navigationOptions: {
                    tabBarLabel:Languages.bottomBarSettings[getLang()],
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
            }
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

