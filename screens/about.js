import  React,{useEffect,useState} from 'react';
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View ,FlatList,Image,TouchableHighlight, Alert, TextInput,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function About({ navigation }) {


  return (
      
    <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#4F78E3', '#634FE3']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}
        >

        <View style={styles.title}>
          <Text style={styles.textheader}>About</Text>
        </View>

        <View>
          <Text style={styles.text}></Text>
        </View>
        
        <View style={styles.content}>
          <Text>According to the current situation, we confront the COVID-19 pandemic. Nowadays, the amount of people who give value to exercise and health is dramatically increasing at a high rate. The result from the Dusit poll shows that 68.10% of respondents value more health care, 67.75% of respondents have more health concerns and 59.38% of respondents have more healthy expenses. From these statistics, we can see that Thai people emphasize more about health care and are ready to invest in it. These problems and trends inspired us to create innovation to solve these problems most people are facing. For example, exercise with the wrong form causes injury, or exercising is ineffective. Another problem is lacking an auto-track assistant to keep tracking. Sometimes,  if the exerciser records exercise statistics by themselves, it will cause a statistics fault. Also, it is hard to keep track. More than that, it makes them give up on workouts and lack the motivation to exercise.
The project is aware of these problems and has intention to invent the application to help users to exercise appropriately and correctly. It also comes with an automatic repetition counting system and helps users to track their exercise stats as well.
</Text>
        </View>

        <View style={styles.floatRight}>
        <TouchableOpacity onPress={()=> navigation.pop()}>
              <View style={styles.logoutbutton}>
                <Text style={styles.mode}>Back</Text>
              </View>
            </TouchableOpacity>
        </View>

      </LinearGradient>
        
    </View>



    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',   
  },
  title:{
    alignItems: 'flex-end',
  },
  content:{
    alignItems: 'center',
    margin: '5%',
    padding: '5%',
    borderRadius: 20,
    backgroundColor: 'white'
  },
  mode:{
    color: '#634FE3',
    fontSize: 20,
  },
  floatRight:{
    alignSelf: 'flex-end'
  },
  background: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  
  head:{
    height:'60%'
  },
  button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#634FE3',
    borderRadius: 30,
    width: '75%',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400'
  },
  textheader :{
    fontSize: 35,
    color: '#FFFFFF',
    paddingTop:'20%',
    paddingRight:'5%',
    textAlign:'right',
  },
  inputbox:{
    width:'80%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: '3%',
    marginBottom:'5%',
  },
  text:{
    marginLeft: '10%',
    fontWeight: '400',
    color: 'white',
    fontSize:18,
  },
  logoutbutton:{
    alignItems: 'center',
    backgroundColor: 'white',
    marginRight: 30,
    margin: 10,
    padding: 10,
    width:100,
    borderRadius: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 10,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 35,
    paddingRight: 35,
    width:330,
    borderRadius: 30,
    justifyContent:'space-between',
    
},
});
