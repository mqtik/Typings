import React, { Component } from 'react';

import {
  Platform,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Animated,
  StatusBar,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-fa-icons';
import Icono from 'react-native-vector-icons/Ionicons';

var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  current_page: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '400',
    flex: 8,
    color: '#65256f',
    ...Platform.select({
      ios: {
        fontFamily: "Baskerville",
      },
      android: {
        fontFamily: "serif"
      },
    }),
  },
  total_pages: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '400',
    flex: 8,
    color: 'rgba(133, 64, 144, 0.71)',
    ...Platform.select({
      ios: {
        fontFamily: "Baskerville",
      },
      android: {
        fontFamily: "serif"
      },
    }),
  },
  header: {
    backgroundColor: "transparent",
    ...Platform.select({
      ios: {
        paddingTop: 3,
      },
      android: {
        paddingTop: 3,
      },
    }),
    top: 0,
    ...Platform.select({
      ios: {
        height: 50,
      },
      android: {
        height: 50,
      },
    }),
    right: 0,
    left: 0,
    borderBottomWidth: 0,
    borderBottomColor:"#f3e2d7",
    position: 'absolute',
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
    flex: 14,
    color: '#fff'
  },
  backButton: {
    width: 34,
    height: 34,
    margin: 16,
    flex: 1,
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  NextPrevButton: {
    width: 20,
    height: 28,
    margin: 10,
    flex: 1,
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  backButtonImage: {
    width: 30,
    height: 30,
  }
});


class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(1),
    };


    this.barsShown = true;
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.shown) {
        this.show();
      } else {
        this.hide();
      }
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.shown !== this.props.shown) {
      if (this.props.shown) {
        this.show();
      } else {
        this.hide();
      }
    }
  }

  show() {
    const timing = Animated.timing;

    timing( this.state.fadeAnim, {
      toValue: 1,
      duration: 20
    }).start();

    this.barsShown = true;
  }

  hide() {
    const timing = Animated.timing;

    timing( this.state.fadeAnim, {
      toValue: 0,
      duration: 20
    }).start();


    this.barsShown = false;
  }

  render() {
    return (
      
      <Animated.View style={[styles.header, { opacity: this.state.fadeAnim }]}>
         <LinearGradient
        colors={['#a243b1', 'rgba(162, 67, 177, .5)', 'rgba(162, 67, 177, .3)', 'rgba(162, 67, 177, .1)', 'rgba(162, 67, 177, 0)']}
        style={{height: 50, width: ancho, top: 0, position: 'absolute'}}
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
        
       </LinearGradient>
        <TouchableOpacity style={styles.backButton}
          onPress={this.props.onLeftButtonPressed}>
          <Icono name="ios-albums" style={{fontSize: 24, color: '#65256f'}} />
        </TouchableOpacity>
        <Text style={styles.current_page}>
          {!isNaN(this.props.navigation.getParam('Location', '')) ? this.props.navigation.getParam('Location', '') : ''}
          /{this.props.navigation.getParam('TotalPages', '0')}
        </Text>
        
        <TouchableOpacity style={styles.NextPrevButton}
          onPress={this.props.onFontSmaller}>
          <Icono name="ios-remove-circle-outline" style={{fontSize: 24, color: '#65256f'}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.NextPrevButton}
          onPress={this.props.onFontBigger}>
          <Icono name="ios-add-circle-outline" style={{fontSize: 24, color: '#65256f'}} />
        </TouchableOpacity>
        {/*
        <TouchableOpacity style={styles.backButton}
          onPress={this.props.onRightButtonPressed}>
          <Icon name="lightbulb-o" size={40} />
        </TouchableOpacity>
        */}
      </Animated.View>
      
    );
  }
}

export default TopBar;
