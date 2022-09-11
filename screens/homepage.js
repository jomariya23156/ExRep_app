import React from 'react';
import { StyleSheet, Text, View ,FlatList,Image,TouchableHighlight, Alert, TextInput,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function Homepage({ navigation }) {

  const mode = [
    {
      id: '1',
      title: 'Choose Exercise Form',
      text: 'Exercise Form'
    },
    {
      id: '2',
      title: 'Choose Premade Plan',
      text: 'Premade Plan'
    },
  ]

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
          <Text style={styles.textheader}>Homepage</Text>
        </View>
        
        <View style={styles.content}>
          <FlatList
          keyExtractor={(item) => item.id.toString()}
          data={mode}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate(item.title)}>
              <View style={styles.row}>
                <Text style={styles.mode}>{item.text}</Text>
                <Ionicons name="caret-forward" size={20} color="#634FE3" />
              </View>
            </TouchableOpacity>
          )}
          />
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
