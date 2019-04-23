import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/docScreen.style';
import { getLang, Languages } from '../../static/languages';
import { StretchyHeader } from '../../../libraries/stretchy';

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);

export default class DocScreen extends Component<Props>{
    constructor (props) {
        super(props);
        let doc = this.props.navigation.getParam('dataDoc', false);
        console.log("Doc data!", doc)
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
    onReadPress = () => {
        let doc = this.props.navigation.getParam('dataDoc', false);
        console.log("doc", doc)
        this.props.navigation.navigate('Reader',{
                                        dataDoc: doc
                                      });
   }
   _openButton = () => {
       return (
           <View style={{flex: 1, alignItems: 'center'}}>
           <TouchableOpacity style={styles.readDoc} onPress={() => { this.onReadPress(this.props);  }}> 
                 
                 <Icono name="ios-git-commit" style={styles.readDocIconCircle} /> 
                        <Text style={{color: 'rgba(255, 255, 255, 0.8)', fontSize: 20, fontWeight: '500', textAlign: 'center', margin: 13, marginLeft: 50}}>
                            {Languages.readStart[getLang()]}
                        </Text>
                </TouchableOpacity>
                </View>
              );
   }
    render(){
        const {data, isLoading} = this.state;
        if (this.state.isLoading == true) {
      return (
        <ActivityIndicator
            style={styles.indicator}
            color="#000"
            size="large"
          />
        )
    } else {
        console.log("this state author", this.state.author)
        return(
            <StretchyHeader
              image={{uri: API_STATIC+'/covers/'+this.state.cover}}
              gradientColors={["#000", "transparent", "#000"]}
              imageHeight={450}
              foreground={this._openButton()}
              onScroll={(position, scrollReachesToBottomOfHeader) => console.log(position, scrollReachesToBottomOfHeader)}
          >

              <Text numberOfLines={1} style={styles.titleContainer}>{this.state.title}</Text>
              <View style={styles.statsContainer}>

             
              
                   <Text style={{color: 'rgba(0, 0, 0, 0.8)', fontSize: 20, fontWeight: '500', textAlign: 'left', marginLeft: 10, marginTop: 0}}>
                            {this.state.author}
                        </Text>
                   <Text style={{color: 'rgba(0, 0, 0, 0.5)', fontSize: 15, fontWeight: '500', textAlign: 'left', marginLeft: 10, marginTop: -1}}>
                             {Languages.writtenBy[getLang()]}
                        </Text>
                   <Text style={{color: '#111', fontSize: 15, fontWeight: '500', textAlign: 'right'}}>
                             {this.state.published_at}
                        </Text>
                  
               </View>

              <Text style={styles.descriptionContainer}>{this.state.description}</Text>
          </StretchyHeader>

        );
    }
    }
}