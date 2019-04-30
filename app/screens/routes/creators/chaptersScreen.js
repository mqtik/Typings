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
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import SortableList from 'react-native-sortable-list';
import Modal from 'react-native-modalbox';
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

export default class ChaptersScreen extends Component<Props>{
    constructor (props) {
        super(props);
        let doc = this.props.navigation.getParam('dataBook', false);
        
        this.state = {
            title: doc.title,
            _id: doc._id,
            title_chapter: null,
            isLoading: true,
            chapters: null,
            placeholder: Languages.addChapter[getLang()],
            placeholderEditTitle: Languages.editTitleChapter[getLang()],
            countChapters: 0,
            color: 'red',
            swipeToClose: true,
            isOpen: false
        };
        
    }
    componentDidMount() {
        this._renderAllChapter();
    }
    _renderAllChapter = () => {
        APILocalDrafts.get(this.state._id).then(doc => {
            console.log("Component did mount")
            console.log("ChapterScreen Props", this.props)
            APILocalChapters.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            console.log("Get all chapters")
            console.log(result);
            console.log("States", this.state._id)
            let books = result.rows.map(function (row) { return row.doc; });  

            console.log("Parse all chapters", books)
            /*let booksNow = _.filter(books, function(item){
                            return item.archive == false
                         }); */
            let chaptersFromBooks = _.filter(books, (item) =>{
                console.log("chapters items", item, this.state._id)
                            return item.bookId == this.state._id;
                         });
            console.log("chapers from books!", chaptersFromBooks)
            let chapterFromBooksOrdered = _.orderBy(chaptersFromBooks, ['index'],['asc']);
            
            this.setState({chapters: chapterFromBooksOrdered, countChapters: chapterFromBooksOrdered.length, isLoading: false})
            console.log("counter!", chapterFromBooksOrdered.length, this.state.countChapters)
          }).catch(err => {    
            console.log(err);
          
          });
          console.log(doc);
          
        });
    }
    _onCreate = () => {
        console.log("On create", this.state.countChapters)
            let bookId = uuid.v1();
            APILocalChapters.upsert(bookId, doc => {
                      doc.title = this.state.title_chapter;
                      doc.archive = false;
                      doc.bookId = this.state._id;
                      doc.index = this.state.countChapters + 1;
                      return doc;
                    }).then((res) => {

                      APILocalChapters.get(bookId)
                        .then(resp => {
                          console.log("New book", resp);

                         this.setState({title_chapter: null, countChapters: this.state.countChapters + 1, chapters: this.state.chapters.concat([resp])})
                        })
                        .catch(err => {
                          console.log("Error getting the new book", err)
                        })


                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
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

  _onMove = (chapters) => {
      console.log("on Move", chapters)
      let index = 0
      for(let index = 0; chapters.length > index; index++){
          console.log("Chapters Index", chapters[index])
          console.log("Index Chapter", index, chapters[index], this.state.chapters[chapters[index]].index, this.state.chapters[chapters[index]].title)
  
          APILocalChapters.upsert(this.state.chapters[chapters[index]]._id, doc => {
                      doc.index = index;
                      return doc;
                    }).then((res) => {

                      console.log("Chapters changed!", res)
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("Error creating book", error)
                      // error
                    });
      }
      /*this.state.chapters.map(function (row) {
          console.log("Map chapters!", row);
           APILocalChapters.upsert(row._id, doc => {
                      doc.index = chapters[index - 1];
                      return doc;
                    }).then((res) => {

                      console.log("Chapters changed!", res)
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                      console.log("Error creating book", error)
                      // error
                    });
                    console.log("Index!", index, chapters[index - 1])    
                    index++;
                    
        });  */
  }

  _checkIfNone = () => {

    console.log("check if none chapters", this.state.chapters.length)

    if(this.state.chapters.length == 0){
      return (
        <View style={{alignItems: 'center',justifyContent: 'center', flex: 1, marginTop: 100}}>
              <EntypoIcono name="book" style={{color: '#8b40d0', fontSize: 55}}></EntypoIcono>
              <Text style={{color: '#666', fontSize: 18, marginTop: 15, textAlign: 'center'}}>{Languages.noChaptersCreated[getLang()]}</Text>
        </View>
      );
    }
  }
  _onRenderRow = (book) => {
      return <Row data={book} active={book.active} onDelete={this._onDelete} navigation={this.props.navigation}/>
  }

  _onOpenModal = () => {
      console.log("Open!")
      console.log("Open modal!", this.props.navigation.state.params);
      
      this.setState({isOpen: true});

  }
  _onEdit = () => {
      this.props.navigation.state.params.onEdit(this.state._id, this.state.title);
      this.setState({isOpen: false});
  }

    render(){
        const {data, isLoading} = this.state;
        if (this.state.isLoading == true && this.state.chapters == null) {
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

                <TouchableHighlight style={{backgroundColor: '#111', width: 50, height: 50, margin: 10, padding: 12, borderRadius: 10}} onPress={() => this._onOpenModal()}>
                    <EntypoIcono name="edit" style={{color: '#ffffff', fontSize: 23}}></EntypoIcono>
                </TouchableHighlight>
                        <Text style={{color: '#222', position: 'absolute', top: 4, left: 55, fontSize: 20, margin: 20, fontWeight: 'bold', letterSpacing: 0.5, textAlign: 'left', alignItems: 'center'}}>
                            {this.state.title != null ? this.state.title : 'Untitled'}
                        </Text>

                </View>
                <View style={styles.container}>
                     {this._checkIfNone()}
           <SortableList
              style={{flex: 1}}
              //contentContainerStyle={styles.contentContainer}
              data={this.state.chapters}
              renderRow={this._onRenderRow}
              onChangeOrder={(nextOrder) => { this._onMove(nextOrder) }}
              onReleaseRow={(key) => { console.log("On Release Row", key) }} 
              
           />
               
           </View>
            
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
                        onChangeText={(text) => this.setState({title_chapter: text})}
                        value={this.state.title_chapter}
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
              <Modal style={[styles.modal, styles.modal4]} position={"top"} ref={"editBookTitle"} keyboardTopOffset={0} isOpen={this.state.isOpen} swipeToClose={this.state.swipeToClose}>
                 
                  <TextInput
                        onChangeText={(text) => this.setState({title: text})}
                        style={{ position: 'absolute', left: 18, fontSize: 18, width: ancho - 100, height: 50}}
                        value={this.state.title != null ? this.state.title : 'Untitled'}
                        placeholder={this.state.placeholderEditTitle}
                        placeholderTextColor="#999"
                        password={true}
                        secureTextEntry={false}
                        autoCapitalize = 'none'
                      />

                  <TouchableHighlight style={{backgroundColor: '#111', width: 50, height: 50, padding: 14, position: 'absolute', right: 18, borderRadius: 10}}  onPress={this._onEdit}>
                      <EntypoIcono style={{color: '#ffffff', fontSize: 20}} name="check"></EntypoIcono>
                  </TouchableHighlight>
                      
                </Modal>
                <Toast
                    ref="toast"
                    style={{backgroundColor:this.state.color}}
                    position='bottom'
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

class Row extends Component {

  constructor(props) {
    super(props);
    console.log("this props Row Chapters", this.props)
    this._active = new Animated.Value(0);
    const {data, active} = this.props;
    this.state = {
        title : data.data.title
    }
    this._style = {
      ...Platform.select({
        ios: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.1],
            }),
          }],
          shadowRadius: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 10],
          }),
        },

        android: {
          transform: [{
            scale: this._active.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 1.07],
            }),
          }],
          elevation: this._active.interpolate({
            inputRange: [0, 1],
            outputRange: [2, 6],
          }),
        },
      })
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.active !== nextProps.active) {
      Animated.timing(this._active, {
        duration: 300,
        easing: Easing.bounce,
        toValue: Number(nextProps.active),
      }).start();
    }
  }

  _onEditTitleChapter = (id, title) => {
      console.log("Title id", id, title)
      this.setState({title: title})
      APILocalChapters.upsert(id, doc => {
                      doc.title = title;
                      return doc;
                    }).then((res) => {
                        
                        console.log("Changed!", res) 

                        this.setState({color: '#36ca41'});
                        this.refs.toast.show('The title has been changed', 2000);
                      // success, res is {rev: '1-xxx', updated: true, id: 'myDocId'}
                    }).catch((error) => {
                        this.setState({color: 'red'});
                        this.refs.toast.show('Something went wrong', 2000);
                      console.log("Error creating book", error)
                      // error
                    });
  }

  _onPress = (book) => {
      console.log("Book", book)
    this.props.navigation.navigate('ChapterDetails',{
                                        dataChapter: book,
                                        onEditTitle: (id, title) => this._onEditTitleChapter(id, title)
                                      });
  }

  render() {
   const {data, active} = this.props;
   
    return (
      <Animated.View style={[
        styles.row,
        this._style,
      ]}>
          <View style={styles.standalone} key={data.data._id}>
          <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}
                >

                  <View style={styles.standaloneRowBack}>
                  <LinearGradient
                      colors={['#713671', '#d23d3d']}
                      style={{flex: 1, marginTop: 0, height:60, borderRadius: 10}}
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
                      <Text style={styles.TextArchive}>
                        <EntypoIcono name="dots-three-horizontal" style={{ color: '#fff', fontSize: 30, zIndex: 0}}/>
                      </Text>
                    <TouchableHighlight onPress={() => { this.props.onDelete(data.data);  }}>
                      <Text style={styles.TextDelete}>
                        <EntypoIcono name="trash" style={{ color: '#fff', fontSize: 30}}/>
                      </Text>
                    </TouchableHighlight>
                    </LinearGradient>
                  </View>

                  <TouchableHighlight style={{backgroundColor: 'transparent'}} onPress={() => { this._onPress(data.data);  }}>
                  <View style={styles.standaloneRowFront}>

                    <Text style={{position: 'absolute', color: '#111', left: 23, top: 20, fontWeight: 'bold', letterSpacing: 0.5, fontSize: 18, flexShrink: 1, width: ancho - 100}} ellipsizeMode='tail'>
                      {this.state.title.toUpperCase()}
                    </Text>
                  </View>
                  </TouchableHighlight>
                </SwipeRow>
                </View>
      </Animated.View>

    );
  }
}
/*<View style={styles.standalone} key={book._id}>
          <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}

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
                    <TouchableHighlight onPress={() => { this._onMove(book);  }}>
                      <Text style={styles.TextArchive}>
                        <EntypoIcono name="archive" style={{ color: '#fff', fontSize: 30}}/>
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => { this._onDelete(book);  }}>
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
                    <Text style={{position: 'absolute', color: '#111', left: 23, top: 20, fontSize: 25, fontWeight: '500', flexShrink: 1, width: ancho - 100}} ellipsizeMode='tail'>
                      {book.title}
                    </Text>
                  </View>
                  </TouchableHighlight>
                </SwipeRow>
                </View>*/
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
    height: 60,
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
    height: 60,
    borderRadius: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  TextArchive: {
    color: '#FFF',
    position: 'absolute',
    left: 20,
    top: 14
  },
  TextDelete: {
    position: 'absolute',
    right: 20,
    top: 14,
    color: '#FFF'
  },
  imageCover: {
    height: 40,
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
  editTitle: {
    margin: 10,
    backgroundColor: "#3B5998",
    color: "white",
    padding: 10
  },
   row: {
        height: 70,
  },
  modal4: {
    height: 100
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});