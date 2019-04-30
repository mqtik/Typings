import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD',
    white: '#fff'
};
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export default StyleSheet.create({
    docScreenCover: {
        width: 200,
        height: 300,
    },
    tagGender: {
      borderRadius: 8,
      margin: 10,
      height: 80
    },
    slideInnerContainer: {
        height: 180,
        paddingBottom: 0 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: 8
    },
    imageContainer: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        resizeMode: "stretch"
    },
    imageContainerEven: {
        backgroundColor: colors.black,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 8,
        resizeMode: "stretch"
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: 8
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 8,
        borderRadius: 8,
        backgroundColor: 'transparent'
    },
    radiusMaskEven: {
        backgroundColor: colors.white
    },
    textContainer: {
        justifyContent: 'center',
        //paddingTop: 20 - entryBorderRadius,
        //paddingBottom: 20,
        //paddingHorizontal: 16,
        backgroundColor: 'transparent',
        color: 'white',
        position: 'absolute',
        padding: 10,
        borderRadius: 8,
          bottom:-3
    },
    textContainerEven: {
        backgroundColor: colors.white
    },
    title: {
        color: colors.white,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    contentContainer: {
        borderRadius: 7,
        flex: 1,
        justifyContent: 'flex-end',
      },
});
