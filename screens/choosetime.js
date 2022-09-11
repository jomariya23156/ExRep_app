import React,{ useState,useEffect } from 'react';
import { StyleSheet, Text, View ,Button,ScrollView,TouchableHighlight, Keyboard, TextInput,TouchableOpacity,TouchableWithoutFeedback, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Video, AVPlaybackStatus } from 'expo-av';




export default function ChooseTime({ route, navigation }) {
  const { id, title } = route.params;
  const [second, setsecond] = useState('30');
  const [minute, setminute] = useState('0');
  
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const videolink = {
    "squat": require('../assets/video/squat.mp4'),
    "pushup": require('../assets/video/pushup.mp4'),
    "jumpingJack": require('../assets/video/jumpingjack.mp4'),
    // "lunge": require('../assets/video/lunge.mp4'),
    "legraise": require('../assets/video/legraise.mp4'),
    // "bicyclecrunch": require('../assets/video/bicycle.mp4'),
    // "mountainclimber": require('../assets/video/mountain.mp4'),
    "halfburpee": require('../assets/video/halfburpee.mp4'),
  }
  
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
        <ScrollView>

        <View style={styles.title}>
          <View style={styles.headerrow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back-outline" size={30} color="#FFFFFF" />
            </TouchableOpacity>           
            <Text style={styles.textheader}>{title}</Text>
          </View> 
        </View>
        
        <View style={styles.center}>
          <View style={styles.circle}> 
            <View style={styles.row}>
            <View style={styles.inputbox}>
                <TextInput
                style={styles.input}    
                keyboardType="number-pad"
                onChangeText={minute=> setminute(minute)}
                defaultValue={minute}
                placeholderTextColor ='white'
                />
              </View >
              <Text  style={styles.input}> : </Text>
              <View style={styles.inputbox}>
                <TextInput
                style={styles.input}    
                keyboardType="number-pad"
                onChangeText={second => setsecond(second)}
                defaultValue={second}
                placeholderTextColor ='white'
                />
              </View >
              
            </View>
          </View>
        </View>
        <View style={styles.floatingbutton}>
          <TouchableOpacity style={styles.button} onPress={()=>  navigation.navigate('Exercise',{plan: title,time:parseInt(minute*60)+parseInt(second)})}>
            <Text>Start</Text>
          </TouchableOpacity>
        </View>

        <View>
      <Text style={styles.textheaderleft}>Tutorials</Text>    
          <View style={styles.containera}>
            <Video
              ref={video}
              style={styles.video}
              source={videolink[title]}
              useNativeControls
              resizeMode="contain"
              isLooping
              onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
            <View style={styles.buttons}>
              <Button
                title={status.isPlaying ? 'Pause' : 'Play'}
                onPress={() =>
                  status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                }
              />
            </View>
          </View>
        </View>
      </ScrollView>
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
    borderBottomWidth: 1,
  },
  input:{
    fontSize: 65  
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
    paddingTop: 110,
    justifyContent:'center',
    
},
});
