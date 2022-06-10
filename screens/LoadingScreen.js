import {ActivityIndicator} from 'react-native';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import React from 'react';


function LoadingScreen () {

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/picture/program_no_logo_icon_smal.png')}
        style={styles.imageStyle}
        resizeMethod='scale'
      />
      <ActivityIndicator size='large' />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageStyle: {
    height: 240,
    width: 240,
    marginBottom: 50,
    // width: Dimensions.get('window').width * 0.8,
    alignSelf: 'center',
  },
});
