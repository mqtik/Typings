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
            title_chapter: null,
            isLoading: true,
            chapters: null,
            placeholder: 'Add chapter',
            countChapters: 0
        };
        this.props.navigation.setParams({
          Title: doc.title
        });
    }
    componentDidMount() {
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
              
        
                <View>
                        <Text style={{color: '#222', fontSize: 26, margin: 20, fontWeight: '500', textAlign: 'left', alignItems: 'center'}}>
                            {this.state.title}
                        </Text>
                        
                </View>
                
            
           
          </View>
        );
    }
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  standalone: {
    margin: 10,
    marginBottom: 0
  },
  standaloneRowFront: {
    backgroundColor: '#fff',
    height: 100,
    borderRadius: 10,
    shadowColor: '#4b2a69',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,  
    elevation: 5
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flex: 1,
    flexDirection: 'row',
    padding: 0,
    height: 100,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  TextArchive: {
    color: '#FFF',
    position: 'absolute',
    left: 20,
    top: 34
  },
  TextDelete: {
    position: 'absolute',
    right: 20,
    top: 34,
    color: '#FFF'
  },
  imageCover: {
    height: 150,
    width: 70,
    backgroundColor: '#111',
    borderRadius: 10,
    flex: 1, 
    flexDirection: 'row', justifyContent: 'flex-start',
    margin: 10
  },
  controls: {
    alignItems: 'center',
    marginBottom: 0
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 0,
    backgroundColor: '#713671'
  },
  switch: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d2d2d2',
    paddingVertical: 10,
    width: Dimensions.get('window').width / 2,
  },

  inputTitleBook: {
    height: 50, 
    fontSize: 20,
    borderColor: 'transparent', 
     alignSelf: 'flex-start',
     width: '100%',
    borderWidth: 1
  },
  imgBackground: {
    justifyContent: 'center',
    alignItems: 'center',
        width: '100%',
        height: '100%',
        flex: 1
},
  pressCreateBook: {
    fontSize: 30, 
    marginTop: 9,
    marginRight: 10,
    color: '#fff',
    borderWidth: 0,
  },
  buttonCreateBookBack: { 
    borderRadius: 30,
    width: 10,
    backgroundColor: "#111",
    flex: 1, 
    paddingRight: 10,
    marginRight: 10
  },
  buttonCreateBook: { 
        borderRadius: 30,
        width: 50,
        height: 50,
    backgroundColor: "#111",
    flex: 0,
    paddingLeft: 12,
    paddingTop: 1
  },
  bookTitleContainer: {
      flex: 1, 
      flexDirection: 'row',
    borderRadius: 33,
    padding: 10,
    borderWidth: 0.1,
    borderColor: 'white',
    backgroundColor: 'white',
    shadowColor: 'rgba(0,0,0,0.3)',
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
   row: {
        height: 120,
  },
});