import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  LayoutAnimation,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

function ProgramScreen({route, navigation}) {
  const {key, eventTitle} = route.params;

  const [program, setProgram] = useState([]);

  const db = firestore().collection('events').doc(key).collection('program');
  if (db != null) {
    useEffect(() => {
      const prog = firestore()
        .collection('events')
        .doc(key)
        .collection('program')
        .doc('elements')
        .onSnapshot(doc => {
          setProgram(doc.data().program);
        });
      return () => prog();
    }, []);
  } else {
    return (
      <View>
        <Text>Program finnes ikke</Text>
      </View>
    );
  }

  // useStates for å kunne expande og collapse program objekt
  const [expandId, setExpandId] = useState(new Set());

  // -- Metode for å expande/collapse --
  const toggleExpand = i => {
    setExpandId(expandId => {
      expandId = new Set(expandId);
      if (expandId.has(i)) {
        expandId.delete(i);
      } else {
        expandId.add(i);
      }
      return expandId;
    });
  };


  const [starred, setStarred] = useState(new Set());

  // -- Metode for favoritt ikon som fylt/ikke fylt --
  const toggleStar = i => {
    setStarred(starred => {
      starred = new Set(starred);
      if(starred.has(i)){
        starred.delete(i);
      } else {
        starred.add(i);
      }
      return starred;
    });
  };

  {
    /* Lager en ny liste med alle object keys i sortert rekkefølge (etter pri'en) */
  }
  {
    /* Kan då bruke den videre, f.eks : cc.forEach(key => { nokke med program[key] }) */
  }
  const cc = Object.keys(program).sort((a, b) => {
    return program[a].pri - program[b].pri;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Mapper hvert objekt i program, med sjekk om info finnes i program objekt */}
        <View style={styles.mainTitle}>
          <Text style={styles.eventStyle} numberOfLines={2} adjustsFontSizeToFit={true}>{eventTitle}</Text>
        </View>
        {cc.map((el,index) => {
          return program[el].info ? (
            // -------------------dersom et program objekt har .info-------------------
            <View key={index} style={styles.boxStyle}>
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                  toggleExpand(el);
                }}>
                <View style={styles.titleNStart}>
                  <Text style={styles.titleStyle}>{program[el].title}</Text>
                  
                  {/* Sjekker om box'en er åpen */}
                  {expandId.has(el) ? 
                    (<AntDesign name="up" size={20}></AntDesign>) : 
                    (<AntDesign name="down" size={20}></AntDesign>)
                  }
                </View>

                {/* Sjekker om info_left og info_right er tom eller ikke */}
                {(() => {
                  if(program[el].info_left !== "" && program[el].info_right == ""){
                    return(
                    <Text style={styles.infoLeft}>{program[el].info_left}</Text>
                    )
                  }
                  else if (program[el].info_left == "" && program[el].info_right != ""){
                    return(
                    <View style={{alignSelf: 'flex-end'}}>
                      <Text style={styles.infoLeft}>{program[el].info_right}</Text>
                    </View>
                    )
                  } 
                  else if (program[el].info_left !== "" && program[el].info_right !== ""){
                    return(
                      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.infoLeft}>{program[el].info_left}</Text>
                        <Text style={styles.infoLeft}>{program[el].info_right}</Text>
                      </View>
                    )
                  }
                })()}
              </TouchableOpacity>
            
              {/* mapper alt inne i "info" listen for hvert objekt, med sjekk for hvert element */}
              {program[el].info.map((item,index) => {
                return (
                  expandId.has(el) && (
                    <View key={index} style={{marginTop: 10, marginLeft: 10}}>
                      <Text style={{fontWeight: 'bold', color: 'white'}}>
                        Tittel - {item.title}
                      </Text>

                      <Text style={styles.infoText}>{item.subtitle}</Text>

                      {item.subsubtitle ? (
                        <Text style={styles.infoText}>{item.subsubtitle}</Text>
                      ) : (
                        <View></View>
                      )}

                      {item.subsubsubtitle ? (
                        <Text style={styles.infoText}>{item.subsubsubtitle}</Text>
                      ) : (
                        <View></View>
                      )}
                    </View>
                  )
                );
              })}
              {expandId.has(el) && (
                  <Text style={{fontWeight: 'bold', marginTop: 5, color: '#444444'}}>Start: {program[el].time_readable.start}</Text>
              )}

              {/* Trykkbart stjerneikon */}
              <TouchableOpacity style={styles.starBox} onPress={() => {
                    toggleStar(el);
                  }}>
                    {starred.has(el) ? 
                      (<Entypo size={20} name="star"></Entypo>) : 
                      (<Entypo size={20} name="star-outlined"></Entypo>)
                    }
                  </TouchableOpacity>
            </View>
          ) : (
            // -------------------dersom et program objekt ikke har .info-------------------

            <View key={index} style={styles.boxStyle}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.titleStyle}>{program[el].title}</Text>
                <Text style={{fontWeight: 'bold', color: '#444444'}}>
                  Start: {program[el].time_readable.start}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
export default ProgramScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  eventStyle: {
    color: '#444444',
    fontFamily: 'NunitoSans-ExtraBold',
    fontWeight: 'bold',
    fontSize: 28,
    alignSelf: 'center',
  },
  mainTitle: {
    justifyContent: 'center', 
    alignSelf: 'center',
    marginTop: 10, 
    marginBottom: 20, 
    marginLeft: 45, 
    marginRight: 45
  },
  titleNStart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleStyle: {
    color: '#444444',
    fontFamily: 'NunitoSans-ExtraBold',
    fontWeight: 'bold',
    fontSize: 22,
  },
  boxStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'orange',
    elevation: 2,
  },
  infoLeft: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
    color: '#444444',
  },
  infoText: {
    color: 'white',
  },
  starBox: {
    justifyContent: 'flex-end', 
    alignSelf: 'flex-end', 
    marginTop: -20
  },
});
