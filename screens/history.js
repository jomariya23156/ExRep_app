import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View ,FlatList,TouchableHighlight, Alert, TextInput,TouchableOpacity} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import {firestore} from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function History({ navigation }) {

  const db =  firestore().collection('History')

  const [his,setHis] = useState({});
  const [key,setKey] = useState('Please sign in');
  const [date, setDate] = useState(currentDate);
  const [currentDate, setCurrentDate] = useState('');
  const [DateToShow, setDateToShow] = useState('');
  const [total, setTotal] = useState('');
  const totalarray =[];

  function dateToString(date,month,year){
    const montharr = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec']
    const monthText = montharr[month-1]
    setDateToShow(date + ' ' + monthText + ' ' + year);
  }

  async function setHistory(date){
    const exerciseArray = [];
    const history = await db.where('user', '==', key ).where('date', '==', date ).get().then(querySnapshot => {
      console.log('Exercise found: ', querySnapshot.size);
      querySnapshot.forEach(documentSnapshot => {
        exerciseArray.push(documentSnapshot.data())
      });
      
    });
    if(exerciseArray.length==0){
      setHis([])
    }
    else{
      var allexerciseHistory = [];
      var index=1;
      for(var i=0;i<exerciseArray.length;i++){
        console.log(exerciseArray[i])
        allexerciseHistory.push(exerciseArray[i])
        
        for(var j=0;j<exerciseArray[i].exercise.score.length;j++){
          
          var result = totalarray.findIndex(  (element)  => element.class === exerciseArray[i].exercise.score[j].class )
          
          // console.log('result = ' + result  )
          
          if(result==-1){
            totalarray.push(
              {
                id: index,
                class: exerciseArray[i].exercise.score[j].class,
                rep: exerciseArray[i].exercise.score[j].rep,
              })
              console.log(index)
              index++;
          }
          else{
            // console.log("In the total array " + totalarray[result].class + " : " + totalarray[result].rep)
            // console.log("In the ij array " + exerciseArray[i].exercise.score[j].class + " : " + exerciseArray[i].exercise.score[j].rep)
            
            var newRep = exerciseArray[i].exercise.score[j].rep + totalarray[result].rep
            totalarray.splice(result,1)
            totalarray.push(
              {
                id: index,
                class: exerciseArray[i].exercise.score[j].class,            
                rep: newRep,
              })
              index++;

          }
            
        }
      }
      console.log(totalarray)
      allexerciseHistory.push(
        {
          date: "2022-03-22",
          exercise: {
            duration: "90 s",
            score:  totalarray,
            "timestamp": "Total",
          },
          "user": "test@gmail.com",
        })
      
      //  console.log(allexerciseHistory)
      setHis(allexerciseHistory)
    }
    
  }

  async function getHistoryDate(){
    const exerciseDateArray = [];
    const history = await db.where('user', '==', key ).get().then(querySnapshot => {
      console.log('Exercise found: ', querySnapshot.size);
      querySnapshot.forEach(documentSnapshot => {
        exerciseDateArray.push(documentSnapshot.data().date)
      });
    });
    console.log(exerciseDateArray)
    setmarkDays(exerciseDateArray)
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userKey')
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch(e) {
      // error reading value
    }
  }

  const [markDays,setmarkDays] = useState([]);

  let markDaysObject = {};
  markDays.forEach((day) => {
    markDaysObject[day] = {
        marked: true
    };
  });

  async function load(){
    const localStorage = await getData();
    if (localStorage != null){
      setKey(localStorage.email)
      console.log("load "+localStorage.email+" history")
      return localStorage;
    }    
  } 

  useEffect(() => {

    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    
    setCurrentDate(
         year + '-'  + month+ '-' + date  
    );
    setHistory(currentDate);
    setDate(
      currentDate
    );
    dateToString(date,month,year);
    //Load dotted
    load();
      
  }, []);

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
            <Text style={styles.textheader}>History</Text>       
        </View>
        
        <View style={styles.content}>
        <Calendar
          // Specify style for calendar container element. Default = {}
          onDayPress={day => {
            console.log(day.dateString);
            setDate(
              day.dateString   
            );
            getHistoryDate()
            setHistory(day.dateString );
            dateToString(day.day,day.month,day.year);
          }}
          markedDates={
            markDaysObject
          }
        
          style={{
            borderWidth: 0,
            borderRadius: 20,
            height: 300,
            width: 400,
            margin: 20,
            backgroundColor: 'grey'
          }}
          // Specify theme properties to override specific styles for calendar parts. Default = {}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: '#00adf5',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#00adf5',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            dotColor: '#00adf5',
            selectedDotColor: '#ffffff',
            arrowColor: 'orange',
            disabledArrowColor: '#d9e1e8',
            monthTextColor: 'blue',
            indicatorColor: 'blue',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 16
          }}
        />
        </View>

        <View style={{alignItems: 'flex-end', marginRight:15, marginBottom:20}}>
        
          <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:25,color:'white'}}>Refresh</Text>
          <TouchableOpacity onPress={getHistoryDate}>
            <Ionicons name="refresh-circle-outline" size={30} color="white" style={{alignItems: 'flex-end',}}/>
          </TouchableOpacity>
          </View>
          
        </View>

        <View style={styles.box}>
            <Text style={styles.text}>{DateToShow}</Text>
            <FlatList
              keyExtractor={(item) => item.exercise.timestamp.toString()}
              data={his}
              style={styles.list}
              renderItem={({ item }) => (
            
              <View>
                <Text style={styles.text1}>{item.exercise.timestamp}</Text>
                
                <FlatList
                  keyExtractor={(item) => item.id.toString()}
                  data={item.exercise.score}
                  style={styles.list}
                  renderItem={({ item }) => (
                
                  <View style={styles.row}>
                    <Text style={styles.text2}>{item.class}</Text>
                    <Text style={styles.text2}>{item.rep}</Text>
                  </View>  
                  )}
                />
                

              </View>
              
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
  box:{
    backgroundColor: 'white',
    borderRadius: 30,
    height:220,
    width:'90%',
    marginLeft:'5%',
    padding: 10,
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
    marginLeft:'3%',
    fontSize: 35,
    color: '#634FE3',
  },
  text1:{
    fontWeight: '500',
    fontSize: 20,
    color: '#634FE3',
    textAlign:'right',
    marginRight: 5,
  },
  text2:{
    fontWeight: '300',
    fontSize: 20,
    color: '#634FE3',
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
    borderRadius: 30,
    justifyContent:'space-between',
},
});
