import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, Dimensions, ListView, Animated, TouchableHighlight, RefreshControl } from 'react-native';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import APIUpsert from 'pouchdb-upsert'
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME, LOCAL_DB_DRAFTS } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import inStyle from '../../styles/creatorsScreen.style';
import uuid from 'react-native-uuid';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { getLang, Languages } from '../../static/languages';

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
PouchDB.plugin(APIUpsert);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME, {auto_compaction: true});

let APILocalDrafts = PouchDB(LOCAL_DB_DRAFTS);

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export default class CreatorsScreen extends Component<Props>{
    constructor(props) {
      super(props);
      this.state = {
         introText: '',
         title_book: null,
         placeholder: Languages.typeBookTitle[getLang()],
         color: 'red',
         exist: 'false',
         isLoading: true,
         listType: Languages.Drafts[getLang()],
         docs: null,
         refreshing: false
      }

     

   }

   componentDidMount(){
     this._renderDrafts();
   }
   _onRefresh = () => {
    this.setState({refreshing: true});
    this._renderDrafts();
  }

   _renderDrafts = () => {
          APILocalDrafts.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            
            let books = result.rows.map(function (row) { return row.doc; });  
            let booksNow = _.filter(books, function(item){
                            return item.archive == false
                         }); 
            let booksArchived = _.filter(books, function(item){
                            return item.archive == true
                         });
                        
            this.setState({docs: booksNow, archive: booksArchived, isLoading: false, refreshing: false})
            
          }).catch(err => {
            //console.log(err);
          
          });
   }


  _onCreate = () => {

    let bookId = uuid.v1();
    APILocalDrafts.upsert(bookId, doc => {
                      doc.title = this.state.title_book;
                      doc.archive = false;
                      return doc;
                    }).then((res) => {

                      APILocalDrafts.get(bookId)
                        .then(resp => {
                         this.setState({title_book: null, docs: this.state.docs.concat([resp])})
                        })
                        .catch(err => {
                          //console.log("Error getting the new book", err)
                        })


                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      //console.log("Error creating book", error)
                      // error
                    });
  }

  _onPress = (book) => {
    this.props.navigation.navigate('Chapters',{
                                        dataBook: book,
                                        onEdit: (id, title) => this._onEdit(id, title)
                                      });
  }

  _onEdit = (id, title) => {
      
      APILocalDrafts.upsert(id, doc => {
                      doc.title = title;
                      return doc;
                    }).then((res) => {
                        
                        //console.log("Changed!", res) 
                        this._renderDrafts();
                        this.setState({color: '#36ca41'});
                        this.refs.toast.show('The title has been changed', 2000);
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                        this.setState({color: 'red'});
                        this.refs.toast.show('Something went wrong', 2000);
                      //console.log("Error creating book", error)
                      // error
                    });
  }
 
  _onDelete = (book, section) => {
      let books;
      //console.log("section!", section)
      if(section == Languages.Drafts[getLang()]){
          books = this.state.docs;
        } else if (section == Languages.Archive[getLang()]) {
          books = this.state.archive;
        }
          Alert.alert(
            'Are you sure you want to delete this chapter?',
            'You won\' be able to recover it',
            [
              {
                text: 'Delete', 
                  onPress: () => {
                    APILocalDrafts.get(book._id).then((doc) => {
                      
                      
                      if(section == Languages.Drafts[getLang()]){
                        let newData = [...this.state.docs];
                        let prevIndex = this.state.docs.findIndex(item => item._id === book._id);
                        newData.splice(prevIndex, 1);
                          this.setState({docs: newData});
                        } else if (section == Languages.Archive[getLang()]) {
                          let newData = [...this.state.archive];
                          let prevIndex = this.state.archive.findIndex(item => item._id === book._id);
                          newData.splice(prevIndex, 1);
                          this.setState({archive: newData});
                        }
                      
                      return APILocalDrafts.remove(doc);
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

   _onArchive = (book, section) => {
      let books;
      if(section == Languages.Drafts[getLang()]){
          books = this.state.docs;
        } else if (section == Languages.Archive[getLang()]) {
          books = this.state.archive;
        }

                    APILocalDrafts.upsert(book._id, doc => {
                        doc.archive = !doc.archive;
                      return doc;
                    }).then((res) => {

                      if(section == Languages.Drafts[getLang()]){
                        let newData = [...this.state.docs];
                        let prevIndex = this.state.docs.findIndex(item => item._id === book._id);
                        newData.splice(prevIndex, 1);
                          this.setState({docs: newData});
                        } else if (section == Languages.Archive[getLang()]) {
                          let newData = [...this.state.archive];
                          let prevIndex = this.state.archive.findIndex(item => item._id === book._id);
                          newData.splice(prevIndex, 1);
                          this.setState({archive: newData});
                        }
                        this._renderDrafts()
                        this.forceUpdate()
                    });
  }

  _checkIfNone = () => {
    if(this.state.listType == Languages.Drafts[getLang()]){
      books = this.state.docs;
    } else if (this.state.listType == Languages.Archive[getLang()]) {
      books = this.state.archive;
    } 

    if(books.length == 0){
      return (
        <View style={{alignItems: 'center',justifyContent: 'center', flex: 1, marginTop: 100}}>
             <EntypoIcono name="colours" style={{color: '#ffffff', fontSize: 55}}></EntypoIcono>
              <Text style={{color: '#fff', fontSize: 18, marginTop: 15, textAlign: 'center'}}>{Languages.noBooksCreated[getLang()]}</Text>
       </View>
      );
    }
  }

  render(){
    let books;
    if(this.state.listType == Languages.Drafts[getLang()]){
      books = this.state.docs;
    } else if (this.state.listType == Languages.Archive[getLang()]) {
      books = this.state.archive;
    }  
      if(this.state.docs){
        return(
          <View style={{flex: 1}}>

            <View style={styles.controls}>
          <View style={styles.switchContainer}>
            { [Languages.Drafts[getLang()], Languages.Archive[getLang()]].map( type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.switch,
                  {backgroundColor: this.state.listType === type ? '#333' : '#3d3d3d'}
                ]}
                onPress={ _ => this.setState({listType: type}) }
              >
                <Text style={[{color: this.state.listType === type ? '#fff' : '#999'}]}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        
        </View>
            <ScrollView 
               style={{backgroundColor: '#222', height: alto}}
               refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }
            >
            {this._checkIfNone()}

            <View style={styles.container}>
            
              { books.map(book => ( 

                <View style={styles.standalone} key={book._id}>
                <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  onScrollEnabled={false}
                  closeOnScroll={false}
                >

                  <View style={styles.standaloneRowBack}>
                  <LinearGradient
                      colors={['#713671', '#d23d3d']}
                      style={{flex: 1, marginTop: 0, height: 100, borderRadius: 10}}
                      //  Linear Gradient 
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 0, y: 1 }}

                      // Linear Gradient Reversed
                      // start={{ x: 0, y: 1 }}
                      // end={{ x: 1, y: 0 }}

                      // Horizontal Gradient
                       //start={{ x: 0, y: 0 }}
                       //end={{ x: 1, y: 0 }}

                      // Diagonal Gradient
                       start={{ x: 0, y: 0 }}
                       end={{ x: 1, y: 1 }}
                    >
                    <TouchableHighlight onPress={() => { this._onArchive(book, this.state.listType);  }}>
                      <Text style={styles.TextArchive}>
                        <EntypoIcono name="archive" style={{ color: '#fff', fontSize: 30}}/>
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this._onDelete(book, this.state.listType);  }}>
                      <Text style={styles.TextDelete}>
                        <EntypoIcono name="trash" style={{ color: '#fff', fontSize: 30}}/>
                      </Text>
                    </TouchableHighlight>
                    </LinearGradient>
                  </View>

                  <TouchableHighlight style={{backgroundColor: 'transparent'}} onPress={() => { this._onPress(book);  }}>
                  <View style={styles.standaloneRowFront}>

                    <TouchableOpacity style={styles.imageCover}>
                      <EntypoIcono name="open-book" style={{ color: '#fff', fontSize: 30, marginLeft: 20, marginTop: 24}}/>
                    </TouchableOpacity>
                    <Text style={{position: 'absolute', color: '#f4f4f0', left: 23, top: 20, fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5, flexShrink: 1, width: ancho - 100}} ellipsizeMode='tail'>
                      {book.title != null ? book.title.toUpperCase() : 'Untitled'}
                    </Text>
                  </View>
                  </TouchableHighlight>
                </SwipeRow>
              </View>
            ))
            }
           </View>

            

                
                  
            </ScrollView>
            <LinearGradient
                      colors={['transparent', 'transparent', '#333','#222','#111']}
                      style={{flex: 1, position: 'absolute', bottom:0,alignSelf:'flex-end'}}
                      //  Linear Gradient 
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}

                      // Linear Gradient Reversed
                      // start={{ x: 0, y: 1 }}
                      // end={{ x: 1, y: 0 }}

                      // Horizontal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 0 }}

                      // Diagonal Gradient
                      // start={{ x: 0, y: 0 }}
                      // end={{ x: 1, y: 1 }}
                    >
             <View style={{alignSelf:'flex-end', width: ancho, justifyContent: 'center', alignItems: 'center'}}>
               

               <View style={styles.bookTitleContainer}>
                    <View style={{ flex: 10, paddingLeft: 10 }}>
                      <TextInput
                        style={styles.inputTitleBook}
                        onChangeText={(text) => this.setState({title_book: text})}
                        value={this.state.title_book}
                        placeholder={this.state.placeholder}
                        placeholderTextColor="#999"
                        password={true}
                        secureTextEntry={false}
                        autoCapitalize = 'none'
                      />
                    </View>
                    
                    <TouchableOpacity style={styles.buttonCreateBook} onPress={this._onCreate}>
                      <Icono name="ios-add-circle-outline" style={styles.pressCreateBook} />
                    </TouchableOpacity>
                     
                  </View>

                  
             </View>
             {Platform.OS == 'ios' && <KeyboardSpacer /> }
             
             </LinearGradient>
             </View>


        );
      } else {
          return (
            <ActivityIndicator
                style={styles.indicator}
                color="#000"
                size="large"
              />
          )
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
    alignItems: 'flex-end',
    backgroundColor: '#333',
    justifyContent: 'flex-end',
    height: 100,
    borderRadius: 10,
    shadowColor: '#000',
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
    borderColor: '#333',
    borderTopWidth: 0,
    borderLeftWidth: 0,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
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
  }
});
