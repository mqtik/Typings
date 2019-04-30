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
  Dimensions,
  Slider
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-fa-icons';

let ancho = Dimensions.get('window').width; //full width
let alto = Dimensions.get('window').height; //full height

const styles = StyleSheet.create({
  footer: {
    backgroundColor: "transparent",
    paddingTop: 0,
    bottom: 0,
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
    borderTopWidth: 0,
    borderTopColor:"#f3e2d7",
    position: 'absolute',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  slider: {
    height: 30,
    width: 200,
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
    flex: 1,
    marginLeft: 50,
    marginRight: 50
  },
  thumb: {
        width: 50,
        height: 80,
        backgroundColor: '#000',
        borderBottomRightRadius: 100,
        borderTopRightRadius: 100,

    },
    track:{
        borderRadius: 30 / 2,
        backgroundColor: 'orange',
        shadowColor: 'red',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 2,
        shadowOpacity: 0.35,
        height: 50,
        borderBottomRightRadius: 20,
        borderTopRightRadius: 20,
    }
});

var sliderStyles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: 4,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 1,
    shadowOpacity: 0.15,
  },
  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#f8a1d6',
    borderColor: '#a4126e',
    borderWidth: 5,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 2,
    shadowOpacity: 0.35,
  }
});


class BottomBar extends Component {
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

    Animated.sequence([
      timing( this.state.fadeAnim, {
        toValue: 1,
        duration: 20
      })
    ]).start();

    this.barsShown = true;
  }

  hide() {
    const timing = Animated.timing;

    Animated.sequence([
      timing( this.state.fadeAnim, {
        toValue: 0,
        duration: 20
      })
    ]).start();


    this.barsShown = false;
  }

  render() {
    return (
      <Animated.View style={[styles.footer, { opacity: this.state.fadeAnim }]}>
      <LinearGradient
        colors={['#a243b1', 'rgba(162, 67, 177, .5)', 'rgba(162, 67, 177, .3)', 'rgba(162, 67, 177, .1)', 'rgba(162, 67, 177, 0)']}
        style={{height: 50, width: ancho, bottom: 0, position: 'absolute'}}
        
         start={{ x: 0, y: 1 }}
         end={{ x: 0, y: 0 }}

        // Horizontal Gradient
        // start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 0 }}

        // Diagonal Gradient
        // start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 1 }}
      >
        
       </LinearGradient>
        <Slider
            style={styles.slider}
            disabled={this.props.disabled}
            value={this.props.value}
            maximumTrackTintColor='rgba(0,0,0,.3)'
            minimumTrackTintColor='#55c583'
            thumbStyle={sliderStyles.thumb}
            trackStyle={sliderStyles.track}
            onSlidingComplete={this.props.onSlidingComplete} />

      </Animated.View>
    );
  }
}

export default BottomBar;