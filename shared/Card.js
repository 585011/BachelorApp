import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const Card = ({item}) => {
   const event = item;

  const optTid = { 
    timeZone: 'Europe/Oslo',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit'
  };

  const optDate = {
    weekday: 'short',
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }


  // Formaterer dato
  const dato = event.event_start.toDate().toLocaleDateString('nb', optDate);
  //Formaterer tiden til riktig tidssone og klokkevisning
  const tid = new Intl.DateTimeFormat('nb', optTid).format(event.event_start.toDate());


  return (
      <View style={styles.card}>
        <Image style={styles.imageStyle} source={{uri: event.picture_thumb}} />
        
        <View style={styles.textContent}>
          
          <View style={styles.timeDate}>
            <MaterialCommunityIcons name="calendar-clock" style={styles.icon} />
            <Text style={styles.textStyle}>{dato}</Text>
            <Text style={styles.textStyle}>{tid}</Text>
          </View>
          
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.location}>
            <Entypo name="location-pin" style={styles.icon}/>
            <Text style={[styles.textStyle, {color: '#999999'}]}>{event.location}</Text>
          </View>
        
        </View>
      
      </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    elevation: 1,
    backgroundColor: 'white',
    marginHorizontal: 11,
    marginVertical: 6,
    height: Dimensions.get('screen').height * 0.18,
  },
  textContent: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    marginVertical: 5,
    marginLeft: 12,
  },
  timeDate:{
    flex: 1,
    flexDirection: 'row',
    marginTop: 6,
  },
  title: {
    flex: 4,
    marginTop: 14,
    marginLeft: 22,
    marginEnd: 48,
    fontSize: 18,
    color: '#444444',
    fontFamily: 'NunitoSans-SemiBold'
  },
  location: {
    flex: 1,
    flexDirection: 'row',
  },
  imageStyle: {
    height: 80,
    width: 80,
    borderRadius: 10,
    alignSelf: 'center',
    marginLeft: 9,
    // overflow: 'hidden'
  },
  textStyle: {
    color: '#fec28e',
    marginTop: -2,
    marginRight: 10,
  },
  icon: {
    fontSize: 17,
    marginRight: 5,
    color: 'grey'
  }
});
