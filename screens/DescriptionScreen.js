import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Fontisto';
import Icon2 from 'react-native-vector-icons/Entypo';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

function DescriptionScreen({route, navigation}) {
  const {key} = route.params;

  const [event, setEvent] = useState({
    picture_normal: '',
    title: '',
    location: '',
    description: '',
    address: null,
    datoStart: null,
    datoSlutt: null,
    tidStart: null,
    tidSlutt: null,
  });
  const [program, setProgram] = useState('');

  const nav = useNavigation();

  useEffect(() => {
    const sub = firestore()
      .collection('events')
      .doc(key)
      .onSnapshot(doc => {
        progChecker();
        setEvent({
          picture_normal: doc.data().picture_normal,
          title: doc.data().title,
          location: doc.data().location,
          description: doc.data().description,
          address: doc.data().address.address,
          // Henter dato for start og slutt, og formaterer til string med ukedag på norsk
          datoStart: doc
            .data()
            .event_start.toDate()
            .toLocaleDateString('nb', optDate),
          datoSlutt: doc
            .data()
            .event_end.toDate()
            .toLocaleDateString('nb', optDate),
          // Henter klokkeslett og formaterer tiden til riktig tidssone og klokkevisning
          tidStart: new Intl.DateTimeFormat('nb', optTid).format(
            doc.data().event_start.toDate(),
          ),
          tidSlutt: new Intl.DateTimeFormat('nb', optTid).format(
            doc.data().event_end.toDate(),
          ),
        });
        if(doc.data().event_program != null){
          setProgram(doc.data().event_program.path)
        };
      });
    return () => sub();
  }, [key]);

  const optTid = {
    timeZone: 'Europe/Oslo',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
  };

  const optDate = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  {/* Metode for å sjekke om det finnes en program collection */}
  const [checkProgram, setCheckProgram] = useState(false); 
  const progChecker = () =>{
    firestore().collection('events').doc(key).collection('program').limit(1).get()
    .then((snapshot) => {
      setCheckProgram(checkProgram => {
        if(snapshot.size != 0){
          checkProgram = true;
        } else {
          checkProgram = false;
        }
        return checkProgram;
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
    <ScrollView>
      <View>
        <Image
          style={styles.imageStyle}
          source={{uri: event.picture_normal ? event.picture_normal : null}}
        />
      </View>
      
      {/* tittel */}

      <View style={styles.titleViewBox}>
        <Text style={styles.titleStyle} adjustsFontSizeToFit={true}>{event.title}</Text>
      </View>

      {/* Dato/Tid og sted for arrangement */}

      <View style={styles.boxStyle}>
        <Icon name="date" size={30} style={styles.iconStyle} />
        <View style={styles.infoText}>
          <Text style={styles.smallInfoText}>
            {event.datoStart} {event.tidStart}
          </Text>
          <Text style={{marginTop: 10, color: '#a3a4b0'}}>
            {event.datoSlutt} {event.tidSlutt}
          </Text>
        </View>
      </View>

      <View style={styles.boxStyle}>
        <Icon2 name="location" size={30} style={styles.iconStyle} />
        <View style={styles.infoText}>
          <Text style={styles.smallInfoText}>{event.location}</Text>
          <Text style={{marginTop: 10, color: '#a3a4b0'}}>{event.address}</Text>
        </View>
      </View>

      {/* Knapp for å navigere til Program siden */}
      {/* Sjekker om checkProgram er true eller false*/}
      {checkProgram ?
        (
          <TouchableOpacity style={styles.opacityStyle} onPress={() => {
            nav.navigate('Program', {key: key, eventTitle: event.title})
          }}>
            <Text style={styles.seProgramStyle}>Se Program</Text>    
          </TouchableOpacity>

        ) : (
          <TouchableOpacity style={styles.opacityStyle} onPress={() => {
            Alert.alert('Program','Fant ikke et program',[{text:'OK'}]);
          }}>
            <Text style={styles.seProgramStyle}>Se Program</Text>    
          </TouchableOpacity>

        )}
      
      <View>
        <Text style={styles.aboutTitle}>Om arrangement</Text>
      </View>

      <View style={{flex: 1}}>
        <Text style={styles.aboutText}>
          {event.description} - ipsum dolor sit amet, consectetur adipiscing
          elit. Nam nec diam in augue iaculis fermentum sed a elit. Phasellus
          odio enim, mollis ut auctor eu, facilisis vitae dui. Nullam quis
          rhoncus ipsum, id fringilla ante. Sed in vulputate nisi. Vivamus
          pharetra ornare purus, sollicitudin facilisis orci commodo id. Mauris
          ac laoreet ipsum. Donec varius ipsum velit, tincidunt hendrerit tellus
          venenatis pretium. Nullam finibus tortor ac pretium dapibus. Integer
          tincidunt, lacus at tempus laoreet, justo erat tristique lectus, sit
          amet volutpat urna urna non libero. Orci varius natoque penatibus et
          magnis dis parturient montes, nascetur ridiculus mus. Aenean non
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
export default DescriptionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('screen').height * 0.25,
    resizeMode: 'stretch',
  },
  titleStyle: {
    color: '#444444',
    fontSize: 25,
    fontFamily: 'NunitoSans-ExtraBold',
    marginHorizontal: 15,
  },
  titleViewBox: {
    flex: 0.5,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  // Ikkje i bruk atm
  infoStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  iconStyle: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#b1ddee',
  },
  infoText: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 30,
  },
  smallInfoText: {
    fontWeight: 'bold',
    color: '#444444',
  },
  boxStyle: {
    padding: 10,
    marginLeft: 5,
    flexDirection: 'row',
  },
  aboutTitle: {
    padding: 10,
    marginLeft: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444444',
  },
  aboutText: {
    flex: 1,
    color: '#444444',
    padding: 10,
    fontSize: 20,
    marginLeft: 10,
    marginTop: -15,
  },
  visKnapp: {
    display: 'flex',
    height: 55, 
    borderRadius: 6, 
    alignSelf: 'center', 
    justifyContent: 'center',
    backgroundColor: 'orange', 
    width: '30%'
  },
  opacityStyle: {
    marginRight: 10, 
    justifyContent: 'center', 
    alignSelf: 'center' , 
    elevation: 8, 
    backgroundColor: 'coral', 
    borderRadius: 20,
    padding: 12,
    width: 300,
  },
  seProgramStyle: {
    color: 'black', 
    alignSelf: 'center'
  },
});