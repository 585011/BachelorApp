import React, { useLayoutEffect,} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import EventsScreen from '../screens/EventsScreen'
import DescriptionScreen from '../screens/DescriptionScreen';
import ProgramScreen from '../screens/ProgramScreen';
import UserScreen from '../screens/UserScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

const Stack = createNativeStackNavigator();

const EventsScreenNavigator = ({navigation, route}) => {

    //Om man ønsker å ikke vise navigeringsbar på visse sider
    // useLayoutEffect(() => {
    //     const routeName = getFocusedRouteNameFromRoute(route);
    //     if(routeName === "Description"){
    //         navigation.setOptions({tabBarStyle: {display: 'none'}});
    //     }else{
    //         navigation.setOptions({tabBarStyle: {display: 'flex'}});
    //     }
    // });

    return (
        <Stack.Navigator>
            <Stack.Screen 
            name="Events" 
            component={EventsScreen} 
            options={{headerShown: false ,title: 'Events',}}/>
        <Stack.Screen 
            name="Description" 
            component={DescriptionScreen} 
            options={{ headerTransparent: true, title: "Beskrivelse", animation: 'slide_from_right'}} 
            />
        <Stack.Screen
            name="Program"
            component={ProgramScreen}
            options={{headerTransparent: true, title: '', animation: 'simple_push'}} 
            />
      </Stack.Navigator>
    )
}

const UserScreenNavigation = ({navigation, route}) => {
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="Bruker"
            component={UserScreen}
            options={{headerTransparent: true, title: '', animation: 'simple_push'}}
             />
        </Stack.Navigator>
    )
}

const FavoriteScreenNavigation = ({navigation, route}) => {
    return(
        <Stack.Navigator>
            <Stack.Screen
            name="Favoritter"
            component={FavoriteScreen}
            options={{headerTransparent: true, title: '', animation: 'simple_push'}}
             />
        </Stack.Navigator>
    )
}

export {EventsScreenNavigator, UserScreenNavigation, FavoriteScreenNavigation};