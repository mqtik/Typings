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
  StatusBar
} from 'react-native';

import Icon from 'react-native-fa-icons';

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '400',
    flex: 8,
    color: '#000',
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
    backgroundColor: "#f7ebe3",
    ...Platform.select({
      ios: {
        paddingTop: 5,
      },
      android: {
        paddingTop: 5,
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
    borderBottomWidth: 1,
    borderBottomColor:"#f3e2d7",
    position: 'absolute',
    display: 'flex',
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row',
    flex: 14
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
    height: 34,
    margin: 16,
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
        <TouchableOpacity style={styles.backButton}
          onPress={this.props.onLeftButtonPressed}>
          <Icon name="map-signs" style={{fontSize: 20}} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {this.props.navigation.getParam('Location', '')}
        </Text>

        <TouchableOpacity style={styles.NextPrevButton}
          onPress={this.props.onFontSmaller}>
          <Icon name="minus-circle" style={{fontSize: 20}} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.NextPrevButton}
          onPress={this.props.onFontBigger}>
          <Icon name="plus-circle" style={{fontSize: 20}} />
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
