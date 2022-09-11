import React from "react"
import { Center, NativeBaseProvider ,Pressable, ScrollView,Heading} from "native-base"
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function Play({navigation}) {
  return (
    <NativeBaseProvider>
      <ScrollView>
      <Center flex='1'> 
      <Heading padding='10' paddingTop='20'> GAME PLAY</Heading>
          <View style={styles.fieldSet}>
          <Text style={styles.legend}>MODE</Text>
            <Pressable 
            onPress={() => navigation.navigate("Exercise")}
            backgroundColor="#ef4836" width="300px" padding="10%" rounded="lg" margin="1%" flexDirection= 'row' justifyContent= 'space-between'
            >
            <Text color="white" textAlign='center' style={styles.textstyles}>
                Challenge
            </Text>
            <AntDesign name="arrowright" color="white"  justifyContent="center"/>
            </Pressable>

            <Pressable 
            onPress={() => navigation.navigate("Exercise")}
            backgroundColor="#ef4836" width="300px" padding="10%" rounded="lg" margin="1%" flexDirection= 'row' justifyContent= 'space-between'
            >
            <Text color="white" textAlign='center' style={styles.textstyles}>
                1 VS 1
            </Text>
            <AntDesign name="arrowright" color="white"  justifyContent="center"/>
            </Pressable>

            <Pressable 
            onPress={() => navigation.navigate("Exercise")}
            backgroundColor="#ef4836" width="300px" padding="10%" rounded="lg" margin="1%" flexDirection= 'row' justifyContent= 'space-between'
            >
            <Text color="white" textAlign='center' style={styles.textstyles}>
                Team VS Team
            </Text>
            <AntDesign name="arrowright" color="white"  justifyContent="center"/>
            </Pressable>

            <Pressable 
            onPress={() => navigation.navigate("Exercise")}
            backgroundColor="#ef4836" width="300px" padding="10%" rounded="lg" margin="1%" flexDirection= 'row' justifyContent= 'space-between'
            >
            <Text color="white" textAlign='center' style={styles.textstyles}>
                Group
            </Text>
            <AntDesign name="arrowright" color="white"  justifyContent="center"/>
            </Pressable>
          </View>

          <View style={styles.fieldSet}>
          <Text style={styles.legend}>Stats</Text>
            <Pressable 
            onPress={() => navigation.navigate("LeaderboardPage")}
            backgroundColor="#ef4836" width="300px" padding="10%" rounded="lg" margin="1%" flexDirection= 'row' justifyContent= 'space-between'
            >
            <Text color="white" textAlign='center' style={styles.textstyles}>
                LeaderBoard
            </Text>
            <AntDesign name="arrowright" color="white"  justifyContent="center"/>
            </Pressable>

            <Pressable 
            onPress={() => navigation.navigate("LeaderboardPage")}
            backgroundColor="#ef4836" width="300px" padding="10%" rounded="lg" margin="1%" flexDirection= 'row' justifyContent= 'space-between'
            >
            <Text color="white" textAlign='center' style={styles.textstyles} >
                Achievement
            </Text>
            <AntDesign name="arrowright" color="white"  justifyContent="center"/>
            </Pressable>
          </View>
    </Center>
    </ScrollView>
    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  fieldSet:{
      margin: 10,
      paddingHorizontal: 10,
      padding: 10,
      borderRadius: 5,
      borderWidth: 2,
      alignItems: 'center',
      borderColor: '#000'
  },
  legend:{
      position: 'absolute',
      top: -10,
      left: 10,
      fontWeight: 'bold',
      backgroundColor: '#ECECEC',
      padding: 2,
  },
  textstyles:{
    color: 'white',
    fontWeight: 'bold',
  }
});
