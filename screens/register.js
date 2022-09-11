import React, { useState } from 'react';
import { StyleSheet, Text, View ,Image,TouchableHighlight, TouchableOpacity, TextInput,ScrollView, Alert} from 'react-native';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {hash,verify} from 'argon2'



export default function Register({ navigation }) {
  
  const [email,setEmail] = useState('')
  const [fname,setFName] = useState('')
  const [lname,setLName] = useState('')
  
  const [gender,setGender] = useState('')
  
  const [password,setPassword] = useState('')
  const [cfpassword,setcfPassword] = useState('')

  //Database
  const db =  firestore().collection('Users')

  

  async function addUser(){
    const user = await db.where('email', '==', email ).get()
    console.log(user.size)
    
    if(password!=cfpassword){
      Alert.alert("Password not match")
    }
    else if(user.size!=0){
      Alert.alert('This email already used')
    }
    else{
      // const hashPassword = await hash(password)

      const user = await db.add({
        email: email,
        fname: fname,
        lname: lname,
        gender: gender,
        
        password: password,
      })
      .then(() => {
        console.log('User added! welcome ' + email);
      });
      storeData({email:email,password:password,name: fname + ' ' +lname, gender: gender})
      const localStorage = await getData();
      console.log('Localstorage = ' + localStorage.email)
      navigation.navigate('Homes')
    }
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem('userKey', jsonValue)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userKey')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  return (
    <ScrollView style={styles.scrollView}>  
    <View style={styles.container}>
        
        <Image style={styles.head} source={require('../assets/images/Vector1.png')} />
        <Text style={styles.teaxtheader}>Register</Text>
        
        
        <View style={styles.buttonSpace}>
        <View style={styles.inputbox}>
            <TextInput
            style={styles.input}    
            placeholder="Name"
            value={fname}
            onChangeText={text=>setFName(text)}
            keyboardType="default"
            />
        </View>
        <View style={styles.inputbox}>
            <TextInput
            style={styles.input}    
            placeholder="Lastname"
            value={lname}
            onChangeText={text=>setLName(text)}
            keyboardType="default"
            />
        </View>
        <View style={styles.inputbox}>
            <TextInput
            style={styles.input}    
            value={email}
            onChangeText={text=>setEmail(text)}
            placeholder="E-mail"
            keyboardType="email-address"
            />
        </View>
        <View style={styles.inputbox}>
            <TextInput
            style={styles.input}    
            placeholder="gender"
            value={gender}
            onChangeText={text=>setGender(text)}
            keyboardType="default"
            />
        </View>
       
        <View style={styles.inputbox}>
            <TextInput
            secureTextEntry={true}
            style={styles.input}    
            value={password}
            onChangeText={text=>setPassword(text)}
            placeholder="Password"
            keyboardType="default"
            />
        </View>
        <View style={styles.inputbox}>
            <TextInput
            secureTextEntry={true}
            style={styles.input}   
            value={cfpassword} 
            onChangeText={text=>setcfPassword(text)}
            placeholder="Confirm Password"
            keyboardType="default"
            />
        </View>
        
        
        <TouchableHighlight
            style={styles.button}
            onPress={addUser}
            underlayColor='#fff'>
              
              <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableHighlight>
          <View style={styles.row}>
            <Text style={styles.text} >Already have account</Text>
            <TouchableOpacity style={styles.text} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.login} >Login</Text>
            </TouchableOpacity>  
        </View>
          
          </View>  
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    
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
    height:'40%'
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
  teaxtheader :{
    fontSize: 35,
    color: '#634FE3',
    textAlign: 'left',
    margin: '10%'
  },
  inputbox:{
    width:'80%',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    padding: '3%',
    marginBottom:'5%',
  },
  scrollView: {
    width:'100%',
  },
  buttonSpace :{
    width:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  login:{
    marginTop: '3%',
    fontWeight: '400',
    marginRight:'3%',
    color: '#634FE3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    },
    text:{
        marginTop: '3%',
        fontWeight: '400',
        marginRight:'3%',
    },
});
