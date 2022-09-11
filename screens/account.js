import  React,{useEffect,useState} from 'react';
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View ,FlatList,Image,TouchableHighlight, Alert, TextInput,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account({ navigation }) {

  const userData = []

  const [email,setEmail] = useState('')
  const [name,setName] = useState('')
  const [gender,setGender] = useState('')
  

  const db =  firestore().collection('Users')

  async function callData(){
    const user = await db.where('email','==', key).get()
    if(user.size==1){
      user.forEach(ele=>{
        userData.push(ele.data())
      })
      console.log(userData[0])
      setEmail(userData[0].email)
      setFName(userData[0].fname)
      setLName(userData[0].lname)
      setGender(userData[0].gender)
    
    }
    return await db.get()
  }

  const [key,setKey] = useState('')

  useEffect(() => {
    // Update the document title using the browser API
    load();
    async function load(){
      const localStorage = await getData();
      if (localStorage != null){
        setKey(localStorage.email)
        setName(localStorage.name)
        setGender(localStorage.gender)
        return localStorage;
      }
      
    }
  callData(key);
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userKey')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
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

        <View style={styles.title}>
          <Text style={styles.textheader}>Accout</Text>
        </View>

        <View>
          <Text style={styles.text}></Text>
        </View>
        
        <View style={styles.content}>
            <View style={styles.row}>
                <Text>Name: </Text>
                <Text>{name}</Text>
            </View>
            
            <View style={styles.row}>
                <Text>Email: </Text>
                <Text>{key} </Text>
            </View>
            
            <View style={styles.row}>
                <Text>Gender: </Text>
                <Text>{gender} </Text>
            </View>
          
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
    paddingLeft: 20,
    paddingRight: 20,
    width:330,
    borderRadius: 30,
    justifyContent:'space-between',
    
},
});
