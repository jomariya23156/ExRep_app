import  React,{useEffect,useState} from 'react';
import { StackActions } from '@react-navigation/native';
import { StyleSheet, Text, View ,FlatList,Image,TouchableHighlight, Alert, TextInput,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function More({ navigation }) {

  const allmode = []
  const data = [{
    "id": 1,
    "nav": "Account",
    "title": "Account Setting",
  },
  {
    "id": 2,
    "nav": "About",
    "title": "About EzFit",
  }
  ]

  // const [data,setData] = useState([])
  // const db =  firestore().collection('Mode')

  // async function callData(){
  // const mode = await db.orderBy('id', 'asc').get()
  
  // mode.forEach(ele=>{
  //   allmode.push(ele.data())
  // })
  // setData(allmode)
  //   return await db.get()
  // }

  
  const [key,setKey] = useState('Please sign in')

  useEffect(() => {
    // Update the document title using the browser API
    load();
    // callData();

    async function load(){
      const localStorage = await getData();
      if (localStorage != null){
        setKey(localStorage.email)
        return localStorage;
      }
      
  }
  },[]);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userKey')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  function clearAsyncStorage(){
    AsyncStorage.clear()
    navigation.dispatch(StackActions.popToTop());
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
          <Text style={styles.textheader}>More</Text>
        </View>

        <View>
          <Text style={styles.text}>{key}</Text>
        </View>
        
        <View style={styles.content}>
          <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={data}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate(item.nav)}>
              <View style={styles.row}>
                <Text style={styles.mode}>{item.title}</Text>
                <Ionicons name="caret-forward" size={20} color="#634FE3" />
              </View>
            </TouchableOpacity>
          )}
          />
        </View>

        <View style={styles.floatRight}>
        <TouchableOpacity onPress={clearAsyncStorage}>
              <View style={styles.logoutbutton}>
                <Text style={styles.mode}>Log out</Text>
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
    marginTop: '5%',
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
