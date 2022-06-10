import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Modal,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Card from '../shared/Card';
import {useNavigation} from '@react-navigation/native';
import {SearchBar} from '@rneui/themed';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ioniocons from 'react-native-vector-icons/Ionicons';

import firestore from '@react-native-firebase/firestore';
import LoadingScreen from './LoadingScreen';

function EventsScreen() {

  //Liste av events
  const [events, setEvents] = useState([]);
  //Filtrerer søket en bruker gjør
  const [filterEvents, setFilterEvents] = useState(events);
  const [sokeText, setSokeText] = useState('');

  //Brukes for å vise / gjemme søkebar
  const [shouldShow, setShouldShow] = useState(false);

  //Brukes til å kunne navigere fra EventsScreen til DescriptionScreen
  const nav = useNavigation();

  //Angir om siden holder på å laste. True som default.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //Henter ut alle arrangementene fra databasen og legger de til i listen events
    const sub = firestore()
      .collection('events')
      .onSnapshot(querySnapsot => {
        const events = [];

        //Legger til alle arrangementene i events-listen
        querySnapsot.forEach(documentSnapshot => {
          events.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        //Setter events til å være lik
        setEvents(events);
        setFilterEvents(events);
        setLoading(false);
      });
    return () => sub();
  }, []);

  //Viser loadingScreen til EventsScreen er ferdig å laste
  if (loading) {
    return (
      <Modal visible={loading}>
        <LoadingScreen />
      </Modal>
    );
  }

  const sokeFilterFunksjon = text => {
    //Sjekker om text er tom
    if (text) {
      //Legger til events som matcher input text med tittel til arrangement
      const nyEvents = events.filter(function (item) {
        const itemData = item.title
          ? item.title.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilterEvents(nyEvents);
      setSokeText(text);
      //Om text er tom er filterEvents samme som alle events
    } else {
      setFilterEvents(events);
      setSokeText(text);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Om shouldShow er true vises søkebaren med mulighet for input, hvis ikke vises header og en søkeknapp */}
      {shouldShow ? (
        <View style={{flexDirection: 'row'}}>
          <Ioniocons
            name="arrow-back"
            style={styles.backButton}
            onPress={() => [setShouldShow(!shouldShow), sokeFilterFunksjon('')]}
          />
          <SearchBar
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            buttonTextStyle={styles.searchBarButton}
            inputStyle={styles.searchBarInput}
            //Fjerne ikoner som er standard men ikke skal vises
            searchIcon={null}
            clearIcon={null}
            round
            //funksjoner
            placeholder={'Søk etter arrangement'}
            onChangeText={text => sokeFilterFunksjon(text)}
            onClear={() => setShouldShow(!shouldShow)}
            value={sokeText}
          />
        </View>
      ) : (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShouldShow(!shouldShow)}>
            <AntDesign name="search1" style={styles.searchButton} />
          </TouchableOpacity>
          <Image
            source={require('../assets/picture/program_no.jpg')}
            style={styles.imageStyle}
          />
        </View>
      )}

      {/*Listen generer Cards som representerer events*/}
      <FlatList
        data={filterEvents}
        renderItem={({item}) => (
          //Navigerer til beskrivelses-skjermen når en trykker på et arrangement. Sender med dokument key
          <TouchableOpacity
            onPress={() =>
              nav.navigate('Description', {
                key: item.key,
              })
            }>
            {/* <Text>Hello {item.title}</Text> */}
            <Card item={item} />
          </TouchableOpacity>
        )}
        keyboardShouldPersistTaps="always"
      />
    </SafeAreaView>
  );
}

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fa',
  },
  imageStyle: {
    height: 50,
    width: Dimensions.get('window').width * 0.8,
    alignSelf: 'center',
  },
  searchButton: {
    fontSize: 25,
    color: 'black',
    padding: 10,
    marginTop: 8,
  },
  backButton: {
    fontSize: 25,
    alignSelf: 'center',
    color: 'black',
    padding: 6,
    marginRight: -8,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchBarInputContainer: {
    backgroundColor: '#EDEDED',
    alignSelf: 'flex-end',
    height: 42,
    width: Dimensions.get('window').width * 0.9,
  },
  searchBarButton: {
    color: 'black',
  },
  searchBarInput: {
    backgroundColor: '#EDEDED',
    borderRadius: 10,
    color: 'black',
  },
  header: {
    backgroundColor: 'white',
    height: 60, 
    flexDirection: 'row'},
});
