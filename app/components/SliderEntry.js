import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { API_URL, API_STATIC, PORT_API_DIRECT, PORT_API, DB_BOOKS, INDEX_NAME } from 'react-native-dotenv'

type Props = { navigation: Function, onDocPress: Function }
export default class SliderEntry extends Component {
   constructor(props) {
        super(props);
    }
    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object,
        navigation: PropTypes.any
    };

    get image () {
        const { data: { cover }, parallax, parallaxProps, even } = this.props;
        //console.log("Cover!", API_STATIC+'/covers/'+cover);
        return parallax ? (
            <ParallaxImage
              source={{ uri: API_STATIC+'/covers/'+cover }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: API_STATIC+'/covers/'+cover }}
              style={styles.image}
            />
        );
    }


    onDocPress = (doc) => {
      this.props.navigation.navigate('Details',{
                                        dataDoc: doc
                                      });
   }

    render () {
        const { data: { title, description }, even } = this.props;
        const uppercaseTitle = title ? (
            <Text
              style={styles.title}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { this.onDocPress(this.props);  }}
              >
                <View style={styles.shadow} />
                <View style={styles.imageContainer}>
                    { this.image }
                    <View style={styles.radiusMask} />
                </View>
                <View style={styles.textContainer}>
                    { uppercaseTitle }
                    <Text
                      style={styles.description}
                      numberOfLines={2}
                    >
                        { description }
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}
