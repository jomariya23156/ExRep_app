import  React,{useEffect,useState} from 'react';
import { StyleSheet, Text, View ,Image,TouchableHighlight, Alert, TextInput,TouchableOpacity} from 'react-native';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {hash,verify} from 'argon2'

export default function Login({ navigation }) {

  //Database
  const db =  firestore().collection('Users')

  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [name,setName] = useState('')
  const [gender,setGender] = useState('')

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
  
  async function checkCredit(){
    const user = await db.where('email', '==', email ).where('password', '==', password ).get()

    const user2 = await db.where('email', '==', email ).where('password', '==', password ).get().then(querySnapshot => {
      console.log('Total users: ', querySnapshot.size);
  
      querySnapshot.forEach(documentSnapshot => {
        console.log( documentSnapshot.data());
        setName(documentSnapshot.data().fname +' '+documentSnapshot.data().lname)
        setGender(documentSnapshot.data().gender)
        saveLocalStorage(documentSnapshot.data().fname +' '+documentSnapshot.data().lname,documentSnapshot.data().gender)
      });
      
    });
    
    if(user.size==0){
      Alert.alert('Please recheck your account and password')
    }
    else{
      console.log("welcome "+ email + name+ gender)    
      navigation.navigate('Homes')
    }
  }

  async function saveLocalStorage(name,gender){
    const localStorage = await getData();
      console.log("welcome " + name) 
      storeData({email:email,password:password,name:name,gender:gender})
  }

  return (
      
    <View>
        <Image style={styles.head} source={require('../assets/images/Vector1.png')} />
        <Text style={styles.teaxtheader}>Welcome</Text>
        <View style={styles.container}>
        <View style={styles.inputbox}>
            <TextInput
            style={styles.input}    
            placeholder="Username"
            value={email}
            onChangeText={text=>setEmail(text)}
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
        
        <TouchableHighlight
            style={styles.button}
            onPress={checkCredit}
            underlayColor='#fff'>
              
              <Text style={styles.buttonText}>Sign In</Text>
          </TouchableHighlight>

        <View style={styles.row}>
            <Text style={styles.text} >Dont have account yet?</Text>
            <TouchableOpacity style={styles.text} onPress={() => navigation.navigate('Register')}>
              <Text style={styles.register} >Register</Text>
            </TouchableOpacity>  
        </View>
          
          
      </View>
    </View>



    
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
  teaxtheader :{
    fontSize: 35,
    color: '#634FE3',
    textAlign: 'left',
    marginTop: '10%',
    marginLeft: '10%',
    marginBottom: '15%',
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
    marginTop: '3%',
    fontWeight: '400',
    marginRight:'3%',
  },
  register:{
    marginTop: '3%',
    fontWeight: '400',
    marginRight:'3%',
    color: '#634FE3',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
},
});
