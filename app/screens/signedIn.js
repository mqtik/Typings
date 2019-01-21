/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, TextInput, View, Button, Alert, TouchableOpacity, Image, ImageBackground, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import Icon from 'react-native-fa-icons';
import PouchDB from 'pouchdb-react-native'
import PouchDBAuth from 'pouchdb-authentication'
import Toast, {DURATION} from 'react-native-easy-toast'
import { API_URL, PORT_API_DIRECT, PORT_API } from 'react-native-dotenv'
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1, ENTRIES2 } from '../static/entries';
import { scrollInterpolators, animatedStyles } from '../utils/animations';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';

PouchDB.plugin(PouchDBAuth)
let url = "http://mqserv.com";
let API = PouchDB(API_URL+':'+PORT_API_DIRECT, {skip_setup: true});
const SLIDER_1_FIRST_ITEM = 1;
const IS_ANDROID = Platform.OS === 'android';


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};


/*  db.sync('https://'userID':'userPASS'@'serverIP':6984/DBname', {
      live: true
    }).on('change', function (change) {
      console.log(change);
    }).on('error', function (err) {
      console.log(err);
    }).on('complete', function (info) {
      console.log(info);
    });
  }*/

  export default class SignedIn extends React.Component {
    render() {
        const TabNavigation = createBottomTabNavigator({
            Library: {
             screen: ExploreScreen,
                 navigationOptions: {
                    tabBarLabel:"Explore",
                    tabBarIcon: ({ tintColor }) => (
                       <Icon name="flash" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Creators: { 
              screen: CreatorsScreen,
              navigationOptions: {
                    tabBarLabel:"Creators",
                    tabBarIcon: ({ tintColor }) => (
                       <Icon name="plus-circle" size={20} style={{color: tintColor}} />
                    )
                  }
             },
            Settings: { 
              screen: SettingsScreen,
              navigationOptions: {
                    tabBarLabel:"Settings",
                    tabBarIcon: ({ tintColor }) => (
                       <Icon name="cogs" size={20} style={{color: tintColor}} />
                    )
                  }, 
             }
        },{
            swipeEnabled: true,
  animationEnabled: true,
  tabBarOptions: {
    activeBackgroundColor: '#333',
    inactiveBackgroundColor: '#111',
    activeTintColor: '#fff',
    inactiveTintColor: '#fff'
  },
        });
        const MainNavigator = createAppContainer(TabNavigation);
        // return (
        //     <View style={styles.container}>
        //       <MainNavigator/>
        //     </View>
        // );

        return <MainNavigator/>
    }
}


class CreatorsScreen extends Component<Props>{
    render(){
        return(
            <View>
                <Text>
                    AuthScreen Works!
                </Text>
            </View>
        );
    }
}

class SettingsScreen extends Component<Props>{
    render(){
        return(
            <View>
                <Text>
                    Hello this is working!
                </Text>
            </View>
        );
    }
}
class ExploreScreen extends Component<Props> {
   constructor (props) {
        super(props);
        this.state = {
            slider1ActiveSlide: SLIDER_1_FIRST_ITEM
        };
    }

    _renderItem ({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
        return (
            <SliderEntry
              data={item}
              even={(index + 1) % 2 === 0}
              parallax={true}
              parallaxProps={parallaxProps}
            />
        );
    }

    _renderLightItem ({item, index}) {
        return <SliderEntry data={item} even={false} />;
    }

    _renderDarkItem ({item, index}) {
        return <SliderEntry data={item} even={true} />;
    }

    mainExample (number, title) {
        const { slider1ActiveSlide } = this.state;

        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>{`Mas leídos - ${number}`}</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Carousel
                  ref={c => this._slider1Ref = c}
                  data={ENTRIES1}
                  renderItem={this._renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  firstItem={SLIDER_1_FIRST_ITEM}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  // inactiveSlideShift={20}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  loop={true}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={500}
                  autoplayInterval={3000}
                  onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                />
                <Pagination
                  dotsLength={ENTRIES1.length}
                  activeDotIndex={slider1ActiveSlide}
                  containerStyle={styles.paginationContainer}
                  dotColor={'rgba(255, 255, 255, 0.92)'}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._slider1Ref}
                  tappableDots={!!this._slider1Ref}
                />
            </View>
        );
    }

    momentumExample (number, title) {
        return (
            <View style={styles.exampleContainer}>
                <Text style={styles.title}>{`Gratuitos - ${number}`}</Text>
                <Text style={styles.subtitle}>{title}</Text>
                <Carousel
                  data={ENTRIES2}
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

    layoutExample (number, title, type) {
        const isTinder = type === 'tinder';
        return (
            <View style={[styles.exampleContainer, isTinder ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Text style={[styles.title, isTinder ? {} : styles.titleDark]}>{`Recomendados ${number}`}</Text>
                <Text style={[styles.subtitle, isTinder ? {} : styles.titleDark]}>{title}</Text>
                <Carousel
                  data={isTinder ? ENTRIES2 : ENTRIES1}
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

    customExample (number, title, refNumber, renderItemFunc) {
        const isEven = refNumber % 2 === 0;

        // Do not render examples on Android; because of the zIndex bug, they won't work as is
        return !IS_ANDROID ? (
            <View style={[styles.exampleContainer, isEven ? styles.exampleContainerDark : styles.exampleContainerLight]}>
                <Text style={[styles.title, isEven ? {} : styles.titleDark]}>{`Sección ${number}`}</Text>
                <Text style={[styles.subtitle, isEven ? {} : styles.titleDark]}>{title}</Text>
                <Carousel
                  data={isEven ? ENTRIES2 : ENTRIES1}
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

    get gradient () {
        return (
            <LinearGradient
              colors={[colors.background1, colors.background2]}
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
                        { example1 }
                        { example2 }
                        { example3 } 
                        { example4 }
                        { example5 }
                        { example6 }
                        { example7 }
                        { example8 }
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }
}
 
module.exports = SignedIn;

