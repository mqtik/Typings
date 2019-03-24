import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/docScreen.style';

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);

export default class DocScreen extends Component<Props>{
    constructor (props) {
        super(props);
        let doc = this.props.navigation.getParam('dataDoc', false);
        this.state = {
            title: doc.data.title,
            author: doc.data.author,
            description: doc.data.description,
            cover: doc.data.cover,
            path: doc.data.path,
            _id: doc.data._id,
            isLoading: true
        };
    }
    componentDidMount() {
        APILocal.get(this.state._id).then(doc => {
            console.log("Component did mount")
          console.log(doc);
          this.setState({ isLoading: false })
        });
    }
    render(){
        const {data, isLoading} = this.state;
      console.log("this props render profile!", this.props.navigation.getParam('dataDoc', false))
        return(

            <ScrollView>
                {isLoading && (
          <ActivityIndicator
            style={{ height: 80 }}
            color="#000"
            size="large"
          />
        )}
                {!isLoading && (
                   
                    <ImageBackground style={styles.container}  source={{uri: API_STATIC+'/covers/'+this.state.cover}}>
                          <LinearGradient
                            colors={['rgba(0, 0, 0,0.2)', 'rgba(0, 0, 0,0.1)', 'rgb(255, 255, 255)']}
                            style={styles.contentContainer}
                          >
                        </LinearGradient>
                        </ImageBackground>
                        )}

                <TouchableOpacity style={styles.readDoc}> 
                 <Icon name="eye" style={styles.readDocIcon} /> 
                 <Icon name="circle-o" style={styles.readDocIconCircle} /> 
                        <Text style={{color: '#e89ee5', fontSize: 20, fontWeight: '500', textAlign: 'center', margin: 13, marginLeft: 30}}>
                            READ
                        </Text>
                </TouchableOpacity>

                <View>
                        <Text style={{color: '#222', fontSize: 26, fontWeight: 'bold', textAlign: 'center', alignItems: 'center'}}>
                            {this.state.title}
                        </Text>
                        <Text style={{color: '#999', fontSize: 14, marginTop: 10, padding: 25, textAlign: 'left'}}>
                             {this.state.description}
                        </Text>
                </View>
            </ScrollView>
        );
    }
}