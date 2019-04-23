import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, Dimensions, TouchableHighlight, Animated, Easing } from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import uuid from 'react-native-uuid';
import APIUpsert from 'pouchdb-upsert'
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, LOCAL_DB_DRAFTS, LOCAL_DB_CHAPTERS } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { getLang, Languages } from '../../../static/languages';

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
PouchDB.plugin(APIUpsert);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
let APILocalDrafts = PouchDB(LOCAL_DB_DRAFTS);
let APILocalChapters = PouchDB(LOCAL_DB_CHAPTERS);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export default class ChapterDetailsScreen extends Component<Props>{
  static navigationOptions = ({ navigation }) => {
          console.log("navigation options!")
        return {
          title: navigation.getParam('Title', 'Edit'),
          //Default Title of ActionBar
            //Background color of ActionBar
          headerRight: (
              <TouchableOpacity onPress={() => this._nav.show()}>
                  <Text style={{color: 'transparent'}}>
                    {navigation.getParam('Location', '5')}
                  </Text>
              </TouchableOpacity>
            ),
          //Text color of ActionBar
        };
      };
    constructor (props) {
        super(props);
        let doc = this.props.navigation.getParam('dataChapter', false);
        console.log("DOC CHAPTER", doc)
        this.state = {
            title: doc.title,
            _id: doc._id,
            content: doc.content,
            title_chapter: null,
            isLoading: true,
            chapters: null,
            placeholder: 'Add chapter',
            countChapters: 0,
            color: 'red',
            placeholderEditTitle: Languages.placeholderEditTitle[getLang()]
        };
        this._onChangeTextDelayed = _.debounce(this._onChangeText, 2000);
        this.props.navigation.setParams({
          Title: doc.title
        });
    }
    componentDidMount() {
        this._renderChapter();
    }
    _renderChapter = () => {
      APILocalChapters.get(this.state._id).then(doc => {
            
            console.log("Get chapter")
            console.log(doc);
            console.log("States", this.state._id)
            this.setState({chapter: doc})
            /*let booksNow = _.filter(books, function(item){
                            return item.archive == false
                         }); */
           
          console.log(doc);
          
        });
    }
    _onChangeText = (text) => {
      console.log("debouncing", text, this.state._id);
            APILocalChapters.upsert(this.state._id, doc => {
                      doc.content = this.state.content;
                      return doc;
                    }).then((res) => {
                        
                        console.log("Changed!", res) 
                        this.setState({color: '#36ca41'});
                        this.refs.toast.show('Saved', 1000);
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                        this.setState({color: 'red'});
                        this.refs.toast.show('Something went wrong', 2000);
                      console.log("Error creating book", error)
                      // error
                    });
    }
     _onDelete = (book) => {
      console.log("Book to delete:", book)
          Alert.alert(
            'Are you sure you want to delete this chapter?',
            'You won\' be able to recover it',
            [
              {
                text: 'Delete', 
                  onPress: () => {
                    APILocalChapters.get(book._id).then((doc) => {
                      console.log("doc!", doc)
                      
                        console.log("deleting")
                        let newData = [...this.state.chapters];
                        let prevIndex = this.state.chapters.findIndex(item => item._id === book._id);
                        newData.splice(prevIndex, 1);
                          this.setState({chapters: newData, countChapters: this.state.countChapters - 1});
                       
                      
                      return APILocalChapters.remove(doc);
                    });
                  }
                },
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              }
            ],
            {cancelable: false},
          );
  }

  _onEditTitle = () => {
    console.log("edit text!", this.props.navigation.state.params)
    this.props.navigation.state.params.onEditTitle(this.state._id, this.state.title);
  }
  
    render(){
        const {data, isLoading} = this.state;
        if (this.state.isLoading == true && this.state.chapter == null) {
      return (
        <ActivityIndicator
            style={styles.indicator}
            color="#000"
            size="large"
          />
        )
    } else {
        console.log("Chapters Render", this.state.chapters)
        return(
           <View style={{flex: 1}}>
              
        
                <View style={styles.editTitleContainer}>
                    <TextInput
                            onChangeText={(text) => this.setState({title: text})}
                            style={{ position: 'absolute', left: 18, fontSize: 18, width: ancho - 100, height: 50, marginTop: 10}}
                            value={this.state.title != null ? this.state.title : 'Untitled'}
                            placeholder={this.state.placeholderEditTitle}
                            placeholderTextColor="#999"
                            password={true}
                            secureTextEntry={false}
                            autoCapitalize = 'none'
                          />

                      <TouchableHighlight style={{backgroundColor: '#111', width: 50, height: 50, padding: 14, marginTop: 10, position: 'absolute', right: 18, borderRadius: 10}}  onPress={this._onEditTitle}>
                          <EntypoIcono style={{color: '#ffffff', fontSize: 20}} name="check"></EntypoIcono>
                      </TouchableHighlight>    
                </View>
                
                <View style={styles.textAreaContainer} >
                    <TextInput
                      style={styles.textArea}
                      underlineColorAndroid="transparent"
                      placeholder={Languages.typeSomething[getLang()]}
                      placeholderTextColor="grey"
                      numberOfLines={10}
                      value={this.state.content}
                      multiline={true}
                      onChangeText={(text) => { this.setState({content: text}); this._onChangeTextDelayed();}}
                      
                    />
                  </View>
           <Toast
                    ref="toast"
                    style={{backgroundColor:this.state.color}}
                    position='top'
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  editTitleContainer: {
    borderBottomWidth: 1,
    height: 72,
    backgroundColor: '#ddd',
    borderColor: '#eaeaea' 
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
    textAreaContainer: {
    borderColor: '#eaeaea',
    borderWidth: 0,
    padding: 15,
    height: alto
  },
  textArea: {
    fontSize: 19,
    height:alto - 270,
    justifyContent: "flex-start"
  }
});