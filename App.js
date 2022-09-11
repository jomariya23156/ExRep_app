import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Welcome from './screens/welcome'
import Login from './screens/login'
import Register from './screens/register'
import Homepage from './screens/homepage'
import ChooseExerciseForm from './screens/chooseexerciseform'
import ChoosePremadePlan from './screens/choosepremadeplan'
import History from "./screens/history";
import More from "./screens/more";
import ChooseTime from "./screens/choosetime";
import PremadeDetails from "./screens/premadeplandetails";
import Exercise from "./screens/Exercise";
import About from "./screens/about";
import Account from "./screens/account";

import { Feather ,AntDesign,MaterialCommunityIcons} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

function Homes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={{
          headerShown: false ,
          tabBarLabel: "Homepage",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          headerShown: false ,
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="More"
        component={More}
        options={{
          headerShown: false ,
          tabBarLabel: "More",
          tabBarIcon: ({ color, size }) => (
            <Feather name="more-horizontal" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        
        <Stack.Screen name="Home"  component={Welcome} />
        <Stack.Screen name="Login"  component={Login} />
        <Stack.Screen name="Register"  component={Register} />
        <Stack.Screen name="Homes"  component={Homes} />
        <Stack.Screen name="Choose Exercise Form"  component={ChooseExerciseForm} />
        <Stack.Screen name="Choose Premade Plan"  component={ChoosePremadePlan} />
        <Stack.Screen name="ChooseTime"  component={ChooseTime} />
        <Stack.Screen name="PremadeDetails"  component={PremadeDetails} />
        <Stack.Screen name="Exercise"  component={Exercise} />
        <Stack.Screen name="About"  component={About} />
        <Stack.Screen name="Account"  component={Account} />
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

