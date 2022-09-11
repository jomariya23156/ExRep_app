import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View ,Button,ScrollView, Keyboard, TextInput,TouchableOpacity,TouchableWithoutFeedback, Alert,FlatList} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Video, AVPlaybackStatus } from 'expo-av';

export default function PremadeDetails({ route, navigation }) {
  const { id, title } = route.params;

  const [para, setPara] = useState('');
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const vidLink = {
    "squat": '../assets/video/squat.mp4',
    "pushup": '../assets/video/pushup.mp4',
    "jumpingJack": '../assets/video/jumpingjack.mp4',
    "legraise": '../assets/video/legraise.mp4',
    "halfburpee": '../assets/video/halfburpee.mp4',
  }

  const [state,setState]= useState({
    id: '1',
    title: 'beginnerFullbody',
    TextShow: 'Beginner Full-body',
    exercise:[
      {
        posture: 'Push-up',
        video: require('../assets/video/pushup.mp4'),
        time: 30,
      },
      {
        posture: 'Squat',
        video: require('../assets/video/squat.mp4'),
        time: 30,
      },
      {
        posture: 'Jumping-jack',
        video: require('../assets/video/jumpingjack.mp4'),
        time: 30,
      },
      
    ]
  }
  )
  
  const plan = [
    {
      id: '1',
      title: 'beginnerFullbody',
      TextShow: 'Beginner Full-body',
      posture1: 'Push-up',
      vid1:'../assets/video/pushup.mp4',
      time1: '30',
      posture2: 'Squat',
      vid2:'../assets/video/squat.mp4',
      time2: '30',
      posture3: 'Jumping-jack',
      vid3:'../assets/video/jumpingjack.mp4',
      time3: '30',
      
    },
    {
      id: '2',
      title: 'fullBody',
      TextShow: 'Full-body',
      posture1: 'Push-up',
      vid1:'../assets/video/pushup.mp4',
      time1: '30',
      posture2: 'Squat',
      vid2:'../assets/video/squat.mp4',
      time2: '30',
      posture3: 'Jumping-jack',
      vid3:'../assets/video/jumping-jack.mp4',
      time3: '30',
      posture4: 'Leg-raise',
      vid4:'../assets/video/legraise.mp4',
      time4: '30',
      posture5: 'Half-burpee',
      vid5:'../assets/video/halfburpee.mp4',
      time5: '30',
    },
  ]


  useEffect(() => {
    if( title== plan[0].title){
        setPara('beginnerFullbody'),
        setState({
          id: '1',
          title: 'beginnerFullbody',
          TextShow: 'Beginner Full-body',
          exercise:[
            {
              posture: 'Push-up',
              video: require('../assets/video/pushup.mp4'),
              time: 30,
            },
            {
              posture: 'Squat',
              video: require('../assets/video/squat.mp4'),
              time: 30,
            },
            {
              posture: 'Jumping-jack',
              video: require('../assets/video/jumpingjack.mp4'),
              time: 30,
            },
          ]
        })     
    }
    else if( title== plan[1].title){
        setPara('fullBody'),
        setState({
          id: '2',
          title: 'fullBody',
          TextShow: 'Full-body',
          exercise:[
            {
              posture: 'Push-up',
              video: require('../assets/video/pushup.mp4'),
              time: 30,
            },
            {
              posture: 'Squat',
              video: require('../assets/video/squat.mp4'),
              time: 30,
            },
            {
              posture: 'Jumping-jack',
              video: require('../assets/video/jumpingjack.mp4'),
              time: 30,
            },
            {
              posture: 'Leg-raise',
              video: require('../assets/video/legraise.mp4'),
              time: 30,
            },
            {
              posture: 'Half-burpee',
              video: require('../assets/video/halfburpee.mp4'),
              time: 30,
            },
          ]
        }) 
    }
    
    
  }, []);
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    
    <View style={styles.container}>
        <LinearGradient
        // Background Linear Gradient
        colors={['#4F78E3', '#634FE3']}
        start={{x: 1, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.container}
        >


        <View style={styles.title}>
          <View style={styles.headerrow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={30} color="#FFFFFF" />
            </TouchableOpacity>           
            <Text style={styles.textheader}>{title}</Text>
          </View> 
        </View>
        
        <Text style={styles.textheaderleft}>Tutorials</Text>    
          <View style={styles.containera}>

          <FlatList
          keyExtractor={(item) => item.posture}
          data={state.exercise}
          style={styles.list}
          renderItem={({ item }) => (
            <View>
              <View style={styles.row}>
                <Text >{item.posture}</Text> 
                <Text>{item.time} s</Text>              
              </View>  
              <Video
              ref={video}
              style={styles.video}
              source={item.video}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
              />
              <View style={styles.buttons}>
              <Button
                title={item.posture}
                
              />
              </View>
            </View>        
          )}
          />

          </View>
          
        <View style={styles.floatingbutton}>
          <TouchableOpacity style={styles.button} onPress={()=>  navigation.navigate('Exercise',{plan: para,time:30})}>
            <Text>Start</Text>
          </TouchableOpacity>
        </View>
      
      </LinearGradient>  
      </View>
      
    </TouchableWithoutFeedback>  


    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width:'100%',   
  },
  video: {
    marginTop: '5%',
    alignSelf: 'center',
    width: 320,
    height: 200,
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
  circle: {
    
    width: 300,
    height: 300,
    borderRadius: 300 / 2,
    backgroundColor: 'white',
    borderWidth: 0
  },
  center:{
    margin:'10%',
    justifyContent:'center',
    alignItems:'center',
  },
  containera: {
    flex: 1,
    
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    width: '25%',
    alignItems: 'center'
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  textheaderleft :{
    fontSize: 35,
    color: '#FFFFFF',
    paddingTop:'10%',
    paddingLeft:'5%',
    textAlign:'left',
  },
  inputbox:{
    alignContent:'center',
  },
  input:{
    fontSize: 80
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
  headerrow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent:'space-between',
    marginLeft:'8%'
},
  floatingbutton:{
    alignItems:'flex-end'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',  
    paddingTop: 30,   
    paddingLeft: 35,
    paddingRight: 35,
    justifyContent:'space-between',
    
},
});
