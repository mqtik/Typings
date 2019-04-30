import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Button, Alert, TouchableOpacity, TouchableHighlight, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo, Dimensions } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import Icono from 'react-native-vector-icons/Ionicons';
import EntypoIcono from 'react-native-vector-icons/Entypo';
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../styles/SliderEntry.style';
import SliderEntry from '../../components/SliderEntry';
import styles, { colors } from '../../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../../static/entries';
import { scrollInterpolators, animatedStyles } from '../../utils/animations';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, HeaderBackButton } from 'react-navigation';
import { getLang, Languages } from '../../static/languages';
import * as Progress from 'react-native-progress';
import SearchScreen from './searchScreen.js';

import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';
import Modal from 'react-native-modalbox';
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME, {auto_compaction: true});
const SLIDER_1_FIRST_ITEM = 1;
const IS_ANDROID = Platform.OS === 'android';

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

   
export default class ExploreScreen extends Component<Props> {
  static navigationOptions = ({ navigation }) => {
          const { params = {} } = navigation.state;
          var value = null;
        return {
          //Default Title of ActionBar
            //Background color of ActionBar
            headerTitle: (
              <TouchableOpacity
                onPress={() => params.handleSearch()}
                underlayColor={'#fff'}
                style={{position: 'absolute', left: 20, top: 10, flex: 1}}>
                <Icono name="ios-search" style={styles.searchIconHeader} />
                <TextInput
                        style={{marginTop: -33, color: '#fff', marginLeft: 20, fontSize: 16, width: ancho - 70}}
                        onChangeText={(text) => params.handleSearch(text)}
                        placeholder={Languages.onSearch[getLang()]}
                        placeholderTextColor="#999"
                        password={false}
                        secureTextEntry={false}
                        onPress={() => params.handleSearch()}
                        autoCapitalize = 'none'
                        selectTextOnFocus={false}
                        returnKeyType='search'
                        autoFocus={false}
                        onSubmitEditing={params.SearchNow}
                        onFocus={params.openSearch}
                        clearButtonMode="while-editing"
                        editable={true}
                      />
                      
                      {params.searchCancel === true && 
                          <Icono name="ios-close-circle" style={{color: '#fff', fontSize: 20, position: 'absolute', left: ancho-50}} onPress={() => params.closeSearch()}/>
                      }
                    </TouchableOpacity>

              )

          //Text color of ActionBar
        };
      };
   constructor (props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            indexName: null,
            docs: null,
            isLoading: true,
            booksOffline: null,
            connection_Status : "online",
            modalVisible: false,
            smartLoading: true
        };
        this._onDocPress = this._onDocPress.bind(this);
        this._renderDocs = this._renderDocs.bind(this);
    }
    componentDidMount(){
      // Create Index
      this.props.navigation.setParams({ handleSearch: this._onSearch });
      this.props.navigation.setParams({ SearchNow: this._SearchNow });
      this.props.navigation.setParams({ openSearch: this._openSearch });
      this.props.navigation.setParams({ closeSearch: this._onCloseSearch });
      this.props.navigation.setParams({ searchCancel: false });
      this._syncDocs();
      this._renderDocs();
      _this = this;
       NetInfo.isConnected.addEventListener(
            'connectionChange',
            this._handleConnectivityChange
     
        );
       
        NetInfo.isConnected.fetch().done((isConnected) => {
          if(isConnected == true)
          {
            this.setState({connection_Status : "online"})
          }
          else
          {
            this.setState({connection_Status : "offline"})
          }
     
        });
    }

  componentWillUnmount() {
 
    NetInfo.isConnected.removeEventListener(
        'connectionChange',
        this._handleConnectivityChange
 
    );
 
  }
   _handleConnectivityChange = (isConnected) => {
    if(isConnected == true)
      {
        this.setState({connection_Status : "online"})
      }
      else
      {
        this.setState({connection_Status : "offline"})
      }
  };

    _syncDocs = event => {
      APIBooks.replicate.to(APILocal, {
        filter: function (doc) {
          return doc.public === true && doc.language == getLang();
        }
      }).then(res => {
          APILocal.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            var doks = result.rows.map(function (row) { return row.doc; });  
            
            /*AsyncStorage.getAllKeys((err, keys) => {
                  AsyncStorage.multiGet(keys, (error, stores) => {
                    stores.map((result, i, store) => {
                      console.log({ [store[i][0]]: store[i][1] });
                      return true;
                    });
                  });
                });*/

            this._renderDocs();
          }).catch(err => {
            console.log(err);
          
          });
          
      });
      
      
    }

    _onSearch = (text) => {
      // event to open search
      console.log("ON SEARCH!", text);
      this.setState({ textShearch: text });
    }
    _openSearch = () => {
      // event to open search
      this.refs.searchBlur.open();
    }
    _SearchNow = () => {
      // event to fire search

      this.searchComponent._searchBooks();
    }
    _onCloseSearch = () => {
      this.props.navigation.setParams({ searchCancel: false });
      this.refs.searchBlur.close();
    }
    _onOpenSearch = () => {
      this.props.navigation.setParams({ searchCancel: true});
    }
    _renderDocs = event => {

         APILocal.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            let doks = result.rows.map(function (row) { return row.doc; });  
            let tags = "";
            let covers = [];
            for(let x = 0; x < doks.length; x++){
              covers.push(doks[x].cover);
              tags += doks[x].tags+', ';
            }
            
            this.setState({covers: covers})
            let booksOffline = _.filter(doks, function(item){
                            if(item.offline){
                                             return item.offline == true;
                                         }
                         });

            let counts = tags.split(', ').reduce(function(map, word){
                            if(word != null && word != 'undefined' && word != ''){

                              map[word] = (map[word]||0)+1;
                            }
                            return map;
                          }, Object.create(null));
            this.setState({ docs: doks, offlineBooks: booksOffline, smartLoad: counts, smartLoadCounts: _.keys(counts).length, isLoading: false})
            

          
          }).catch(err => {
            console.log(err);
              return null;
          });
        /*APIBooks.createIndex({
                  index: {
                    ddoc: 'BooksIndex',
                    fields: ['_id', 'title', 'description', 'public', 'author', 'language', 'published_at', 'created_at', 'updated_at', 'path', 'cover']
                  }
                }).then(result => {
                  console.log("index result", result.id)
                   APIBooks.find({
                        selector: {_id: {"$gte": null}, public: {'$exists': true}},
                        fields: ['_id', 'title', 'description', 'public', 'author', 'language', 'published_at', 'created_at', 'updated_at', 'path', 'cover'],
                        use_index: result.id
                    }).then(res => {
                        //console.log('find - result ' + result);
                        //console.log(JSON.stringify(res));

                       // console.log('JSON' + JSON.stringify(result, undefined, 2));

                        //console.log(res);
                        this.setState({docs: res.docs})

                    }).catch(err => {
                        console.log('find - err ', err);
                    });

                  
                }).catch(errIndex => {
                  // ouch, an error
                  console.log("The index had a problem creating", errIndex);
                }); */
    }


    _onDocPress  = () => {
      this.props.navigation.navigate('Settings');
    }
    _renderItem = ({item, index}) => {
        return (
            <SliderEntry data={item} even={(index + 1) % 2 === 0}  navigation={this.props.navigation} />
            );
    }


    _renderItemWithParallax = ({item, index}, parallaxProps) => {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallaxProps={parallaxProps}
              navigation={this.props.navigation}
            />
        );
    }

    _renderLightItem = ({item, index}) => {
        return (
            <SliderEntry data={item} even={false} navigation={this.props.navigation} />
            );
    }

    _renderDarkItem = ({item, index}) =>  {
        return  (
            <SliderEntry data={item} even={true} navigation={this.props.navigation}/>
            );
    }

    mainExample (books, number, title) {
        const { slider1ActiveSlide, docs } = this.state;
        const isEven = number % 2 === 0;
        if(books && books.length){
                //console.log("Docs!", docs)
                //console.log("docs length", this.state.docs.length)
              
        return (
            <View style={[styles.exampleContainer, isEven ? styles.exampleContainerDark : styles.exampleContainerLight]} key={title}>
                <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{`${title}`}</Text>
                <Text style={[styles.subtitle, isEven ? {} : styles.subtitleDark]}>{books.length} {Languages.booksFound[getLang()]}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={books}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={false}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={1}
                  inactiveSlideOpacity={0.7}
                  useScrollView={true}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  autoplay={false}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                {/*<Pagination
                  dotsLength={this.state.docs.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />*/}
            </View>
        );
      }
    }

    momentumExample (number, title) {
        if(this.state.fiction && this.state.fiction.length){
        return (

            <View style={styles.exampleContainer}>
                <Text style={styles.title}>{`Gratuitos - ${number}`}</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Carousel
                  data={this.state.fiction}
                  renderItem={this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  inactiveSlideScale={0.95}
                  inactiveSlideOpacity={1}
                  enableMomentum={true}
                  activeSlideAlignment={'start'}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  activeAnimationType={'spring'}
                  activeAnimationOptions={{
                      friction: 4,
                      tension: 40
                  }}
                />
            </View>
        );
    }
    }

    layoutExample (number, title, type) {
        if(this.state.fiction && this.state.fiction.length){
        const isTinder = type === 'tinder';
        return (
            <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Text style={[styles.title, isTinder ? {} : styles.titleDark]}>{`Recomendados ${number}`}</Text>
                <Text style={[styles.subtitle, isTinder ? {} : styles.titleDark]}>{title}</Text>
                <Carousel
                  data={isTinder ? this.state.fiction : this.state.fiction}
                  renderItem={isTinder ? this._renderLightItem : this._renderItem}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  layout={type}
                  loop={true}
                />
            </View>
        );
        }
    }

    customExample (number, title, refNumber, renderItemFunc) {
        if(this.state.docs && this.state.docs.length){
        const isEven = refNumber % 2 === 0;

        // Do not render examples on Android; because of the zIndex bug, they won't work as is
        return !IS_ANDROID ? (
            <View style={[styles.exampleContainer, isEven ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{`${title}`}</Text>
                
                <Carousel
                  data={isEven ? this.state.docs : this.state.docs}
                  renderItem={renderItemFunc}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  scrollInterpolator={scrollInterpolators[`scrollInterpolator${refNumber}`]}
                  slideInterpolatedStyle={animatedStyles[`animatedStyles${refNumber}`]}
                  useScrollView={true}
                />
            </View>
        ) : false;
    }
    }

    

    get gradient () {
        return (
            <LinearGradient
              colors={[colors.background1, colors.background1, colors.background2]}
              startPoint={{ x: 1, y: 0 }}
              endPoint={{ x: 0, y: 1 }}
              style={styles.gradient}
            />
        );
    }
    _renderOffline = () => {
      if(this.state.offlineBooks != null){
        this.setState({smartLoading: false});
        return this.mainExample(this.state.offlineBooks, '1', 'Offline');
      }

    }
    _renderOnline = () => {
 
        let x = 0;
        let example = [];
        for(let key in this.state.smartLoad){
          if(this.state.smartLoad[key] > 5){
            let docresult = _.filter(this.state.docs, function(doc){
              if(doc.tags){
                return doc.tags.toLowerCase().includes(key.trim().toLowerCase()) == true;
              }
             });
            example.push({[key.trim()]:docresult});
          }    
        }

        return (
          <View>
          {this.state.offlineBooks != null && this.mainExample(this.state.offlineBooks, '0', Languages.continueReading[getLang()])}
          <View style={{backgroundColor: '#fff', flex: 1, color: '#000'}}>
            {this.mainExample(this.state.docs, '1', Languages.lastBooks[getLang()])}
            </View>

          {example.map((key, i) => {
                          for(let k in key){
                            return (

                            this.mainExample(key[k], i, k)
                            )
                          }
                          this.setState({smartLoading: false});
                        })}


          </View>
          )
    }
    
    render () {
     if(this.state.connection_Status == 'offline'){

        NetInfo.isConnected.fetch().done((isConnected) => {
          if(isConnected == true)
          {
            this.setState({connection_Status : "online"})
          }
        });

     }

    if (this.state.isLoading == true && this.state.docs != null) {
      return (
        <ActivityIndicator
            style={styles.indicator}
            animating={true}
            color="#000"
            size="large"
          />
        )
    } else {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.container}>

                    <StatusBar
                      translucent={true}
                      backgroundColor={'#333'}
                      barStyle={'light-content'}
                    />
                    { this.gradient }
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                      {this.state.smartLoading === true && 
                      <Progress.Circle
                          style={{position: 'absolute', top: 10, right: 10}}
                          color={'rgba(255,255,255,.6)'}
                          indeterminate={true}
                        />
                      }
                      {this.state.connection_Status === 'online' && this._renderOnline()}
                        {this.state.connection_Status === 'offline' && this._renderOffline()}
                        {this.state.connection_Status === 'offline' && 
                          <View style={{margin: 20}}>
                          <Icono name="ios-radio" style={{color: '#fff', fontSize: 40, textAlign: 'left', marginTop: 10}} />
                          <Text style={{fontSize: 20, color: '#fff', textAlign: 'left', marginLeft: 50, marginTop: -40}}>{Languages.noInternetConnection[getLang()]}</Text>
                          <Text style={{fontSize: 16, color: '#999', textAlign: 'left', marginLeft: 50, marginTop: 0}}>{Languages.noInternetConnectionSubtitle[getLang()]}</Text>
                         </View>
                        }
          
                       
                    </ScrollView>
                </View>
                <Modal style={{backgroundColor: '#111', flex: 1}} position={"top"} ref={"searchBlur"} keyboardTopOffset={0} isOpen={this.state.isOpen} swipeToClose={false} onClosed={this._onCloseSearch} onOpened={this._onOpenSearch}>
                   
                   <SearchScreen 
                     SearchNow={this.state.SearchNow} 
                     onSearch={this.state.textShearch} 
                     allBooks={this.state.docs} 
                     tags={this.state.smartLoad} 
                     ref={instance => { this.searchComponent = instance; }}
                     navigation={this.props.navigation}
                     />
                </Modal>
            </SafeAreaView>
        );
    }
    }
}