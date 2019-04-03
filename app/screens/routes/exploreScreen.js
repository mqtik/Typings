import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView, ActivityIndicator } from 'react-native';
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
import styles, { colors } from '../../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../../static/entries';
import { scrollInterpolators, animatedStyles } from '../../utils/animations';
import { createBottomTabNavigator, createStackNavigator, createAppContainer, HeaderBackButton } from 'react-navigation';


PouchDB.plugin(APIAuth);
PouchDB.plugin(APIFind);
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
let APIBooks = PouchDB(API_URL+':'+PORT_API_DIRECT+'/'+DB_BOOKS, {skip_setup: true});
let APILocal = PouchDB(LOCAL_DB_NAME);
const SLIDER_1_FIRST_ITEM = 1;
const IS_ANDROID = Platform.OS === 'android';
export default class ExploreScreen extends Component<Props> {
   constructor (props) {
        super(props);

        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
            indexName: null,
            docs: null,
            isLoading: true
        };
        this._onDocPress = this._onDocPress.bind(this);
        this._renderDocs = this._renderDocs.bind(this);
        this._renderDocsByTagName = this._renderDocsByTagName.bind(this);
    }
    componentDidMount(){
      // Create Index
      this._syncDocs();
      this._renderDocs();
      this._renderDocsByTagName('fiction')
        console.log("this props signed", this.props)
    }

    _syncDocs = event => {
      APIBooks.replicate.to(APILocal, {
        filter: function (doc) {
          return doc.public === true;
        }
      }).then(res => {
        console.log("SYNCED!", res)
          APILocal.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
            console.log("ALL DOCS")
            console.log(result);
            var doks = result.rows.map(function (row) { return row.doc; });  
            
                        //console.log('find - result ' + result);
                        //console.log(JSON.stringify(res));

                       // console.log('JSON' + JSON.stringify(result, undefined, 2));

                        //console.log(res);
                        this.setState({docs: doks})

            let docresult = _.filter(result.rows, function(item){
                if(item.doc.tags){
                                 return item.doc.tags.toLowerCase().includes('fiction') == true;
                             }
             });
            console.log("Synced!")
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
            var doks = result.rows.map(function (row) { return row.doc; });  
            
                        //console.log('find - result ' + result);
                        //console.log(JSON.stringify(res));

                       // console.log('JSON' + JSON.stringify(result, undefined, 2));

                        //console.log(res);
                        this.setState({docs: doks})

          
           // this.setState({docs: docresult});
           // console.log("state of", this.state.fiction)
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
    _renderDocsByTagName = tags => {
        console.log("calling!")
        APILocal.allDocs({
            include_docs: true,
            attachments: true
          }).then(result => {
              var doks = result.rows.map(function (row) { return row.doc; });  
             
  
                        //console.log('find - result ' + result);
                        //console.log(JSON.stringify(res));

                       // console.log('JSON' + JSON.stringify(result, undefined, 2));

                        //console.log(res);
                        let docresult = _.filter(doks, function(item){
                            if(item.tags){
                                             return item.tags.toLowerCase().includes(tags) == true;
                                         }
                         });
                        this.setState({[tags]: docresult, isLoading: false});
            }).catch(err => {
            console.log(err);
              return null;
          });
                  

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

    mainExample (number, title) {
        const { slider1ActiveSlide, docs } = this.state;
        if(this.state.docs && this.state.docs.length){
                //console.log("Docs!", docs)
                //console.log("docs length", this.state.docs.length)
              
        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>{`Mas leídos - ${number}`}</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={this.state.docs}
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
            console.log("LOGS MOMENTUM!", this.state.fiction)
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
        if(this.state.fiction && this.state.fiction.length){
        const isEven = refNumber % 2 === 0;

        // Do not render examples on Android; because of the zIndex bug, they won't work as is
        return !IS_ANDROID ? (
            <View style={[styles.exampleContainer, isEven ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{`Sección ${number}`}</Text>
                <Text style={[styles.subtitle, isEven ? {} : styles.titleDark]}>{title}</Text>
                <Carousel
                  data={isEven ? this.state.fiction : this.state.fiction}
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

    render () {
        const example1 = this.mainExample(1, 'Historias | Cuentos | Comedia | Romance | Horror | Guiones | Ciencia');
        const example2 = this.momentumExample(2, 'Cursos');
        const example3 = this.layoutExample(3, 'Recomendados', 'stack');
        const example4 = this.layoutExample(4, 'Escritores en Typings', 'tinder');
        const example5 = this.customExample(5, 'Originales de Typings', 1, this._renderItem);
        const example6 = this.customExample(6, 'Fantasía', 2, this._renderLightItem);
        const example7 = this.customExample(7, 'Nuevos', 3, this._renderDarkItem);
        const example8 = this.customExample(8, 'Tu biblioteca', 4, this._renderLightItem);
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
                      backgroundColor={'rgba(0, 0, 0, 0.3)'}
                      barStyle={'light-content'}
                    />
                    { this.gradient }
                    <ScrollView
                      style={styles.scrollview}
                      scrollEventThrottle={200}
                      directionalLockEnabled={true}
                    >
                        { example6 }
                        { example1 }
                        { example2 }
                        { example3 } 
                        
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