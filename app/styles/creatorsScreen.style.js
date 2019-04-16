import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

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
      width: 150,
      backgroundColor: '#692569',
      borderRadius: 30,
      margin: 110,
      shadowColor: '#222',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 2,
      position: 'absolute',
      top: 50,
      alignItems: 'center',
  },
  readDocIcon: {
      color: '#c5c5c5',
      fontSize: 30,
      width: 70,
      position: 'absolute',
      left: 15,
      top: 17
  },
  readDocIconCircle: {
      color: '#922a92',
      fontSize: 50,
      width: 50,
      position: 'absolute',
      left: 3,
      top: 1
  },
  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});
