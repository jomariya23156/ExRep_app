import  React,{useEffect,useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,Image,TouchableHighlight, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Welcome({ navigation }) {
  // const db =  firestore().collection('test')

  // const [wow,setName] = useState();

  // async function callData(){
  // const user = await db.get()
  // const sth = [];

  // user.forEach(ele=>{
  //   sth.push(ele.data())
  //   //console.log(ele.data())
  // })

  // setName(sth[0].email)
  // //console.log(sth[0].email)

  //   return await db.get()
  // }
  
  // useEffect(() => {
  //   callData()
  
    
  // }, []);

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('userKey', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  async function tryNow(){
    // AsyncStorage.clear()
    let value = await AsyncStorage.getItem('userKey');
    if (value != null){
      AsyncStorage.clear()
    }
    storeData({email:'Please sign in'})
    navigation.navigate('Homes')
  }
  
  return (
    <View style={styles.container}>
      
      <LinearGradient
        // Background Linear Gradient
        colors={['#4F78E3', '#634FE3']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}
      >
        <Image style={styles.logo} source={require('../assets/images/logo.png')} />
        <View style={styles.buttonSpace}>
          <TouchableHighlight
            marginTop= '20%'
            style={styles.button}
            onPress={tryNow}
            underlayColor='#fff'>
              <Text style={styles.buttonText}>Try now</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={() => navigation.navigate('Login')}
            underlayColor='#fff'>
              <Text style={styles.buttonText}>Sign In</Text>
          </TouchableHighlight>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width:'100%'
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
  
  logo:{
    width: '70%',
    height: "30%"
  },
  button: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    borderRadius: 30,
    width: '75%',
  },
  buttonText: {
    color: '#634FE3',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '400'
  },
  buttonSpace :{
    marginTop:'30%',
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
