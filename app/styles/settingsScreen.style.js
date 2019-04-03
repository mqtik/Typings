import { StyleSheet } from 'react-native';

export const colors = {
    black: '#1a1917',
    gray: '#888888',
    background1: '#B721FF',
    background2: '#21D4FD'
};

export default StyleSheet.create({
   textStyle: {
    fontSize:20,
    color: '#ffffff',
    textAlign: 'center'
  },
  
  buttonStyle: {
    margin: 20,
    padding:10,
    backgroundColor: '#d23d3d',
    borderRadius:5
  },

  indicator: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80
  }
});
