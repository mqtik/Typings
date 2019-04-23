import React, {Component} from 'react';
import {Platform, StyleSheet, AsyncStorage, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator, NetInfo } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import APIAuth from 'pouchdb-authentication'
import APIFind from 'pouchdb-find'
import _ from 'lodash'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME, LOCAL_DB_NAME, API_STATIC, SETTINGS_LOCAL_DB_NAME } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../styles/SliderEntry.style';
import SliderEntry from '../../components/SliderEntry';
//import NetworkInfo from '../../components/NetworkInfo';
import styles, { colors } from '../../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../../static/entries';
import { scrollInterpolators, animatedStyles } from '../../utils/animations';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, HeaderBackButton } from 'react-navigation';
import { getLang, Languages } from '../../static/languages';
import {
    CachedImage,
    ImageCacheProvider
} from 'react-native-cached-image';

PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
const SLIDER_1_FIRST_ITEM = 1;
const IS_ANDROID = Platform.OS === 'android';

String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, "");
};

   
export default class ExploreScreen extends Component<Props> {
   constructor (props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            indexName: null,
            docs: null,
            isLoading: true,
            booksOffline: null,
            connection_Status : "offline"
        };
        this._onDocPress = this._onDocPress.bind(this);
        this._renderDocs = this._renderDocs.bind(this);
    }
    componentDidMount(){
      // Create Index
      this._syncDocs();
      this._renderDocs();
          
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
              tags += doks[x].tags+',';
            }
            
            this.setState({covers: covers})
            let booksOffline = _.filter(doks, function(item){
                            if(item.offline){
                                             return item.offline == true;
                                         }
                         });

            let counts = tags.split(',').reduce(function(map, word){
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
        if(books && books.length){
                //console.log("Docs!", docs)
                //console.log("docs length", this.state.docs.length)
              
        return (
            <View style={styles.exampleContainer} key={title}>
                <Text style={styles.title}>{`${title}`}</Text>
                <Text style={styles.subtitle}>{books.length} {Languages.booksFound[getLang()]}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={books}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={false}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  autoplay={false}
                  autoplayDelay={2000}
                  autoplayInterval={5000}
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
        return this.mainExample(this.state.offlineBooks, '1', 'Offline');
      }

    }
    _renderOnline = () => {
       const example1 = this.mainExample(this.state.docs, 1, 'First section');
        const example2 = this.momentumExample(2, 'Second');
        const example3 = this.layoutExample(3, 'third', 'stack');
        const example4 = this.layoutExample(4, 'four', 'tinder');
        const example5 = this.customExample(5, 'five', 1, this._renderItem);
        const example6 = this.customExample(6, Languages.firstTitleSection[getLang()], 2, this._renderLightItem);
        const example7 = this.customExample(7, 'seventh', 3, this._renderDarkItem);
        const example8 = this.customExample(8, 'eight', 4, this._renderLightItem);
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
          { example6 }

          {example.map((key, i) => {
                          for(let k in key){
                            return this.mainExample(key[k], i, k)
                          }
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
                    
                      {this.state.connection_Status === 'online' && this._renderOnline()}
                        {this.state.connection_Status === 'offline' && this._renderOffline()}
                        {this.state.connection_Status === 'offline' && 
                          <Text style={{fontSize: 20, textAlign: 'center', marginBottom: 20}}> You are { this.state.connection_Status } </Text>
                        }
                         
                        {/* example4 }
                        { example5 }
                        
                        { example7 }
                        { example8 */}
                       
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
    }
}