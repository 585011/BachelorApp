import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {EventsScreenNavigator, FavoriteScreenNavigation, UserScreenNavigation} from './CustomNavigation';

const Tab = createBottomTabNavigator();

const Tabs = () => {
    
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
            backgroundColor: '#f7f9fa',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
            borderTopColor: '#f7f9fa',
            marginTop: -10,
            
        },
      }}
      >
      <Tab.Screen
        name="Start"
        component={EventsScreenNavigator}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconContainer}>
              <MaterialIcons
                name="event"
                style={styles.imageStyle}
              />
              <Text
                style={styles.textStyle}>
                Event
              </Text>
            </View>
          ),
        }}
      />

<Tab.Screen
        name="Userprofile"
        component={UserScreenNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconContainer}>
              <AntDesign
                name="user"
                style={styles.imageStyle}
              />
              <Text
                style={styles.textStyle}>
                Profil
              </Text>
            </View>
          ),
        }}
      />

<Tab.Screen
        name="Favorites"
        component={FavoriteScreenNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={styles.tabBarIconContainer}>
              <MaterialIcons
                name="favorite-border"
                style={styles.imageStyle}
              />
              <Text
                style={styles.textStyle}>
                Favoritter
              </Text>
            </View>
          ),
        }}
      />

    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarIconContainer: {
  },
  imageStyle: {
    alignSelf: 'center',
    width: 30,
    height: 28,
    color: '#fec28e',
    fontSize: 30,
  },
  textStyle: {
    alignSelf: 'center',
    color: '#444444',
    fontSize: 12,
  },
});

export default Tabs;