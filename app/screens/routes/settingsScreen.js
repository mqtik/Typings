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
import { getLang, Languages } from '../../static/languages';

import {
  SettingsDividerShort,
  SettingsDividerLong,
  SettingsEditText,
  SettingsCategoryHeader,
  SettingsSwitch,
  SettingsPicker
} from "../../../libraries/settings";

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
PouchDB.plugin(APIUpsert);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME, {auto_compaction: true});

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
	      gender: "",
        enablePagination: true,
        offlineMode: false
	    };
	    //console.log("this props settings", this.props)
	    
	  }
	  componentDidMount() {
	  	APILocalSettings.get('UserSettings')
					        .then(resp => {
					          console.log("Settings of user!", resp);
					          this.setState({
					          	username: resp.username,
					          	name: resp.nombre,
					          	gender: resp.gender,
                      roles: resp.roles,
					          	allowPushNotifications: resp.allow_push_notifications,
                      offlineMode: resp.offline_mode,
                      enablePagination: resp.enable_pagination
					          })
					        })
					        .catch(err => {
					          //console.log("There's no settings in!", err)
					        })
           API.getSession((err, response) => {
              console.log("Getting session", response)
                if (err) {
                  // network error
                } else if (!response.userCtx.name) {
                  // nobody's logged in
                } else {
                  API.getUser(response.userCtx.name).then(res => {

                    //console.log("Get user from API", res)
                    APILocalSettings.upsert('UserSettings', doc => {
                     //console.log("User settings logged", res.nombre, doc)
                      
                        doc.logged_in = true;
                        doc.username = res.name;
                        doc.nombre = res.nombre;
                        doc.gender = res.gender;
                        doc.roles = res.roles;
                        doc.allow_push_notifications = res.allow_push_notifications;
                        doc.enable_pagination = res.enable_pagination;
                        doc.offline_mode = res.offline_mode;
                      
                      return doc;
                    }).then((res) => {
                      

                  }).catch(err => { console.log("Something went wrong getting the user")})
                  console.log("Get user session", response)
                    });
                  }
                });
	  }
	  _onLogout = () => {

	  	//console.log("Log out Settings!", this.props)
         
          this.props.screenProps.onLogout();
    
       
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
        title={Languages.myAccount[getLang()]}
        textStyle={Platform.OS === "android" ? { color: colors.monza } : null}
        style={{backgroundColor: '#e89ee5'}}
      />
      <SettingsDividerLong android={false} />
      <SettingsEditText
        title={Languages.Username[getLang()]}
        dialogDescription={Languages.enterUsername[getLang()]}
        valuePlaceholder="..."
        negativeButtonTitle={Languages.Cancel[getLang()]}
        positiveButtonTitle={Languages.Save[getLang()]}
        onValueChange={value => {
          //console.log("username:", value);
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
        title={Languages.Name[getLang()]}
        dialogDescription={Languages.enterName[getLang()]}
        valuePlaceholder="..."
        negativeButtonTitle={Languages.Cancel[getLang()]}
        positiveButtonTitle={Languages.Save[getLang()]}
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
        title={Languages.Gender[getLang()]}
        dialogDescription={Languages.chooseGender[getLang()]}
        options={[
          { label: Languages.Male[getLang()], value: Languages.Male[getLang()] },
          { label: Languages.Female[getLang()], value: Languages.Female[getLang()] },
          { label: Languages.Other[getLang()], value: Languages.Other[getLang()] }
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
        styleModalButtonsText={{ color: '#111' }}
      />
      <SettingsDividerLong />
    	<TouchableOpacity style={styles.buttonStyle}
			onPress={() => this._onLogout()}
		  >
			 <Text style={styles.textStyle}>{Languages.signOut[getLang()]}</Text>
		  </TouchableOpacity>

    	<SettingsCategoryHeader
	        title={Languages.Application[getLang()]}
	        textStyle={Platform.OS === "android" ? { color: '#111' } : null}
	        style={{backgroundColor: '#999'}}
	      />
	    <SettingsDividerLong />
      <SettingsSwitch
        title={Languages.AllowPushNotifications[getLang()]}
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

      <SettingsSwitch
        title={Languages.enablePagination[getLang()]}
        onValueChange={value => {
          //console.log("enable pagination:", value);
          APILocalSettings.upsert('UserSettings', doc => {
                      if (doc.logged_in) {
                        doc.enable_pagination = value;
                      }
                      return doc;
                    }).then((res) => {
                      APILocalSettings.get('UserSettings')
                  .then(resp => {
                    //console.log("Settings of user!", resp);
                    API.putUser(resp.username, {
                  metadata : {
                    enable_pagination: resp.enable_pagination
                  }
                }).then((response) => {
                  // etc.
                  //console.log("Respuesta save api", response)
                }).catch((err) => {
                  console.log("Respuesta saveeeeee error!", err)
                });
                  })
                  .catch(err => {
                    //console.log("There's no user logged in!", err)
                  })
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      //console.log("User settings error on saving", error)
                      // error
                    });
          this.setState({
            enablePagination: value
          });
        }}
        value={this.state.enablePagination}
        trackColor={{
          true: colors.switchEnabled,
          false: colors.switchDisabled,
        }}
      />

       <SettingsSwitch
        title={Languages.offlineMode[getLang()]}
        onValueChange={value => {
          //console.log("enable offline mode:", value);
          APILocalSettings.upsert('UserSettings', doc => {
                      if (doc.logged_in) {
                        doc.offline_mode = value;
                      }
                      return doc;
                    }).then((res) => {
                      APILocalSettings.get('UserSettings')
                  .then(resp => {
                    //console.log("Settings of user!", resp);
                    API.putUser(resp.username, {
                  metadata : {
                    offline_mode: resp.offline_mode
                  }
                }).then((response) => {
                  // etc.
                  //console.log("Respuesta save api", response)
                }).catch((err) => {
                  //console.log("Respuesta saveeeeee error!", err)
                });
                  })
                  .catch(err => {
                    //console.log("There's no user logged in!", err)
                  })
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      //console.log("User settings error on saving", error)
                      // error
                    });
          this.setState({
            offlineMode: value
          });
        }}
        value={this.state.offlineMode}
        trackColor={{
          true: colors.switchEnabled,
          false: colors.switchDisabled,
        }}
      />
     
     
    </ScrollView>
        );
    }

}