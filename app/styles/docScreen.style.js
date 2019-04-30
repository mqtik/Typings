import { StyleSheet, Dimensions } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};
var ancho = Dimensions.get('window').width; //full width
var alto = Dimensions.get('window').height; //full height

export default StyleSheet.create({
    docScreenCover: {
        width: 200,
        height: 300,
    },
    
    container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',//TODO: Importate para que la imagen abarque toda la pantalla
    backgroundColor : 'transparent',
    height: 400
  },
  contentContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingVertical: 20,
    overflow:'visible',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 400
  },
  readDoc: {
      height: 50,
      width: 130,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      borderRadius: 30,
      shadowColor: '#222',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
     alignItems: 'center',
     marginTop: alto  / 2
  },
  readDocIcon: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: 18,
      width: 50,
      position: 'absolute',
      left: 15,
      top: 17
  },
  readDocIconCircle: {
      color: 'rgba(255, 255, 255, 0.3)',
      fontSize: 50,
      width: 50,
      position: 'absolute',
      left: 3,
      top: 1
  },
  titleContainer: {
    marginTop: -50,
    position: 'absolute',
    fontSize: 24,
    marginLeft: 15,
    fontWeight: '500',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10
  },
  descriptionContainer: {
    fontSize: 18,
    padding: 15,
    paddingTop: 20,
    flex:1,
    color: 'rgba(255,255,255,.6)',
    backgroundColor: '#333'
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  },
  authorContainer: {
    color: '#000'
  },
  statsContainer: {
    width: ancho,
    height: 80,
    borderBottomWidth: 1,
    padding: 20,
    fontSize: 20,
    color: '#fff',
    backgroundColor: '#222',
    borderColor: 'rgba(0,0,0,.2)'
  }
});
