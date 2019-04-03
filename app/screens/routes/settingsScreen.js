import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/settingsScreen.style';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker
} from "react-native-settings-components";

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
let APILocalSettings = PouchDB(SETTINGS_LOCAL_DB_NAME);
/*
db.putUser('robin', {
  metadata : {
    email : 'robin@boywonder.com',
    birthday : '1932-03-27T00:00:00.000Z',
    likes : ['acrobatics', 'short pants', 'sidekickin\''],
  }
}, function (err, response) {
  // etc.
});
*/
const colors = {
  white: "#FFFFFF",
  monza: "#e89ee5",
  switchEnabled: "#e89ee5",
  switchDisabled: "#efeff3",
  blueGem: "#e89ee5",
};

export default class SettingsScreen extends Component<Props>{
    constructor(props) {
	    super(props);
	    this.state = {
	      username: "",
	      name: "",
	      allowPushNotifications: false,
	      gender: ""
	    };
	    console.log("this props settings", this.props)
	    
	  }
	  componentDidMount() {
	  	APILocalSettings.get('UserSettings')
					        .then(resp => {
					          console.log("Settings of user!", resp);
					          this.setState({
					          	username: resp.username,
					          	name: resp.nombre,
					          	gender: resp.gender,
					          	allowPushNotifications: resp.allow_push_notifications
					          })
					        })
					        .catch(err => {
					          console.log("There's no settings in!", err)
					        })
	  }
	  _onLogout = () => {
	  	console.log("Log out!")
        API.logOut((err, response) => {
		  if (err) {
		    // network error
		    console.log("on error", err)
		    return null;
		  }
		  console.log("on response!", response)
		  APILocalSettings.destroy().then(res => {
		    APILocalSettings = new PouchDB(SETTINGS_LOCAL_DB_NAME);
		    console.log("apilocalsettings destroy!", res)
		    const resetAction = StackActions.reset({
                           index: 0,
                           actions: [NavigationActions.navigate({ routeName: 'SignedOut' })],
                       });
                       this.props.navigation.dispatch(resetAction);
		  });
		})
	  }
	  render(){
        return(
            <ScrollView
      style={{
        flex: 1,
        backgroundColor:
          Platform.OS === "ios" ? colors.iosSettingsBackground : colors.white
      }}
    >
       <SettingsCategoryHeader
        title={"My Account"}
        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
        style={{backgroundColor: '#e89ee5'}}
      />
      <SettingsDividerLong android={false} />
      <SettingsEditText
        title="Username"
        dialogDescription={"Enter your username."}
        valuePlaceholder="..."
        negativeButtonTitle={"Cancel"}
        positiveButtonTitle={"Save"}
        onValueChange={value => {
          console.log("username:", value);
          /*db.changeUsername('spiderman', 'batman', function(err) {
				  if (err) {
				    if (err.name === 'not_found') {
				      // typo, or you don't have the privileges to see this user
				    } else if (err.taken) {
				      // auth error, make sure that 'batman' isn't already in DB
				    } else {
				      // some other error
				    }
				  } else {
				    // succeeded
				  }
				})*/
          this.setState({
            username: value
          });
        }}
        value={this.state.username}        
      />
      <SettingsDividerShort />
      <SettingsEditText
        title="Name"
        dialogDescription={"Enter your name."}
        valuePlaceholder="..."
        negativeButtonTitle={"Cancel"}
        positiveButtonTitle={"Save"}
        onValueChange={value => {
          console.log("name:", value);
          APILocalSettings.upsert('UserSettings', doc => {
                      if (doc.logged_in) {
                        doc.nombre = value;
                      }
                      return doc;
                    }).then((res) => {
                    	APILocalSettings.get('UserSettings')
					        .then(resp => {
					          console.log("Settings of user!", resp);
					          API.putUser(resp.username, {
								  metadata : {
								    nombre: resp.nombre
								  }
								}).then((response) => {
								  // etc.
								  console.log("Respuesta save api", response)
								}).catch((err) => {
									console.log("Respuesta saveeeeee error!", err)
								});
					        })
					        .catch(err => {
					          console.log("There's no user logged in!", err)
					        })
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("User settings error on saving", error)
                      // error
                    });
          
          this.setState({
            name: value
          });
        }}
        value={this.state.name}        
      />
      <SettingsDividerShort />
      <SettingsPicker
        title="Gender"
        dialogDescription={"Choose your gender."}
        options={[
          { label: "male", value: "male" },
          { label: "female", value: "female" },
          { label: "other", value: "other" }
        ]}
        onValueChange={value => {
          console.log("gender:", value);
          APILocalSettings.upsert('UserSettings', doc => {
                      if (doc.logged_in) {
                        doc.gender = value;
                      }
                      return doc;
                    }).then((res) => {
                    	APILocalSettings.get('UserSettings')
					        .then(resp => {
					          console.log("Settings of user!", resp);
					          API.putUser(resp.username, {
								  metadata : {
								    gender: resp.gender
								  }
								}).then((response) => {
								  // etc.
								  console.log("Respuesta save api", response)
								}).catch((err) => {
									console.log("Respuesta saveeeeee error!", err)
								});
					        })
					        .catch(err => {
					          console.log("There's no user logged in!", err)
					        })
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("User settings error on saving", error)
                      // error
                    });

          this.setState({
            gender: value
          });
        }}
        value={this.state.gender}
        styleModalButtonsText={{ color: colors.monza }}
      />
      <SettingsDividerLong />
    	<TouchableOpacity style={styles.buttonStyle}
			onPress={() => this._onLogout()}
		  >
			 <Text style={styles.textStyle}>Sign out</Text>
		  </TouchableOpacity>

    	<SettingsCategoryHeader
	        title={"Application"}
	        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
	        style={{backgroundColor: '#999'}}
	      />
	    <SettingsDividerLong />
      <SettingsSwitch
        title={"Allow Push Notifications"}
        onValueChange={value => {
          console.log("allow push notifications:", value);
          APILocalSettings.upsert('UserSettings', doc => {
                      if (doc.logged_in) {
                        doc.allow_push_notifications = value;
                      }
                      return doc;
                    }).then((res) => {
                    	APILocalSettings.get('UserSettings')
					        .then(resp => {
					          console.log("Settings of user!", resp);
					          API.putUser(resp.username, {
								  metadata : {
								    allow_push_notifications: resp.allow_push_notifications
								  }
								}).then((response) => {
								  // etc.
								  console.log("Respuesta save api", response)
								}).catch((err) => {
									console.log("Respuesta saveeeeee error!", err)
								});
					        })
					        .catch(err => {
					          console.log("There's no user logged in!", err)
					        })
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("User settings error on saving", error)
                      // error
                    });
          this.setState({
            allowPushNotifications: value
          });
        }}
        value={this.state.allowPushNotifications}
        trackColor={{
          true: colors.switchEnabled,
          false: colors.switchDisabled,
        }}
      />
     
     
    </ScrollView>
        );
    }

}