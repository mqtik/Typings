import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, ActivityIndicator, Dimensions, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView,
  AppRegistry,
  Animated,
  Modal } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import { Epub, Streamer } from 'epubjs-rn';
import BottomBar from '../../components/BookBottomBar';
import Nav from '../../components/BookNav';
import TopBar from '../../components/BookTopBar';
PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME, {auto_compaction: true});
let APILocalSettings = PouchDB(SETTINGS_LOCAL_DB_NAME);
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export default class ReaderScreen extends Component<Props>{
      static navigationOptions = ({ navigation }) => {
          console.log("navigation options!")
        return {
          title: navigation.getParam('Title', 'Reading...'),
          //Default Title of ActionBar
            //Background color of ActionBar

            headerBackTitle: null,
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

        
        let doc = this.props.navigation.getParam('dataDoc', false);
        
        this.state = {
            title: doc.data.title,
            author: doc.data.author,
            description: doc.data.description,
            cover: doc.data.cover,
            path: doc.data.path,
            _id: doc.data._id,
            isLoading: false,
            flow: "paginated", // paginated || scrolled-continuous
            location: doc.data.last_cfi || 0,
            url: API_STATIC+"/epub/"+doc.data.path,
            src: "",
            origin: "",
            title: "",
            toc: [],
            showBars: true,
            showNav: false,
            sliderDisabled: true,
            fontSize: '23px'
        };

        this.props.navigation.setParams({
          Title: doc.data.title,
          Location: this.state.location
        });

        this.streamer = new Streamer();
    }



    componentDidMount() {
        APILocalSettings.get('UserSettings')
                  .then(resp => {
                    if(resp.enable_pagination == false){
                        this.setState({flow: "scrolled-continuous"});
                      } else {
                        this.setState({flow: "paginated"});
                      }
                  })
                  .catch(err => {
                    //console.log("There's no user logged in!", err)
                  })
        APILocal.get(this.state._id).then(doc => {
          this.setState({ isLoading: false, location: doc.last_cfi || 0 })
        });

            this.streamer.start()
              .then((origin) => {
                console.log("streaming!", origin)
                this.setState({origin})
                return this.streamer.get(this.state.url);
              })
              .then((src) => {
                console.log("streaming src!", src)
                return this.setState({src});
              }).catch((err) => {
                console.log("error streaming!", err)
                //console.log("There was an error with the book!", err)
              });

            setTimeout(() => this.toggleBars(), 1000);
          }

    componentWillUnmount() {
      APILocal.upsert(this.state._id, doc => {
                      
                        doc.percentage = this.state.visibleLocation.start.percentage;
                        doc.last_page = this.state.visibleLocation.start.location;
                        doc.last_cfi = this.state.visibleLocation.start.cfi;
                        doc.offline = true;
                      return doc;
                    }).then((res) => {
                      //console.log("onLocationsReady", res)
                    }).catch((err) => {

                    });
        this.streamer.kill();
    }

    toggleBars() {
          this.setState({ showBars: !this.state.showBars });
          
     }

    render(){
        const {data, isLoading} = this.state;
        return(

              <View style={styles.container}>
        
        <Epub style={styles.reader}
              ref="epub"
              //src={"https://s3.amazonaws.com/epubjs/books/moby-dick.epub"}
              src={this.state.src}
              flow={this.state.flow}
              location={this.state.location}
              fontSize={this.state.fontSize}
              //width={ancho}
              //height={alto}
              onLocationChange={(visibleLocation)=> {
                console.log("locationChanged", visibleLocation)
                this.setState({visibleLocation});

                
                this.props.navigation.setParams({
                      Location: visibleLocation.start.location
                    });
              }}
              onLocationsReady={(locations)=> {
                // console.log("location total", locations.total);
                console.log("on location ready!", locations)
                this.props.navigation.setParams({
                      TotalPages: locations.total
                    });
                
                this.setState({sliderDisabled : false});
              }}
              onReady={(book)=> {
                // console.log("Metadata", book.package.metadata)
                // console.log("Table of Contents", book.toc)
                console.log("book ready!", book)
                this.setState({
                  title : book.package.metadata.title,
                  toc: book.navigation.toc
                });
              }}
              onPress={(cfi, position, rendition)=> {
                this.toggleBars();
                console.log("press", cfi);
              }}
              onLongPress={(cfi, rendition)=> {
                console.log("longpress", cfi);
              }}
              onViewAdded={(index) => {
                console.log("added", index)
              }}
              beforeViewRemoved={(index) => {
                console.log("removed", index)
              }}
              onSelected={(cfiRange, rendition) => {
                console.log("selected", cfiRange)
                // Add marker
                rendition.highlight(cfiRange, {});
              }}
              onMarkClicked={(cfiRange) => {
                console.log("mark clicked", cfiRange)
              }}
              themes={{
                   typings: {
                     body: {
                     "-webkit-user-select": "none",
                     "user-select": "none",
                     "background-color": "#f7ebe3",
                     "font-size": "32px"
                   }
                 }
               }}
               theme="typings"
               regenerateLocations={true}
              generateLocations={true}
              origin={this.state.origin}
              onError={(message) => {
                console.log("EPUBJS-Webview", message);
              }}
            />
            <View
              style={[styles.bar, { top:0 }]}>
              <TopBar
                title={this.state.title}
                shown={this.state.showBars}
                navigation={this.props.navigation}
                onLeftButtonPressed={() => this._nav.show()}
                onRightButtonPressed={
                  (value) => {
                    if (this.state.flow === "paginated") {
                      this.setState({flow: "scrolled-continuous"});
                    } else {
                      this.setState({flow: "paginated"});
                    }
                  }
                }
                onFontSmaller={
                  (value) => {
                    this.setState({fontSize: (parseInt(this.state.fontSize.replace(/px/,""))-1)+"px"});
                  }
                }
                onFontBigger={
                  (value) => {
                    this.setState({fontSize: (parseInt(this.state.fontSize.replace(/px/,""))+1)+"px"});
                  }
                }
               />
            </View>
            <View
              style={[styles.bar, { bottom:0 }]}>
              <BottomBar
                disabled= {this.state.sliderDisabled}
                value={this.state.visibleLocation ? this.state.visibleLocation.start.percentage : 0}
                shown={this.state.showBars}
                onSlidingComplete={
                  (value) => {
                    //console.log("Spinner!", value.toFixed(6))
                    this.setState({location: value.toFixed(6)})
                  }
                }/>
            </View>
            <View>
              <Nav ref={(nav) => this._nav = nav }
                display={(loc) => {
                  this.setState({ location: loc });
                }}
                toc={this.state.toc}
              />
            </View>
      </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e2d7'
  },
  reader: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#f7ebe3'
  },
  bar: {
    position:"absolute",
    left:0,
    right:0,
    height:55
  }
});