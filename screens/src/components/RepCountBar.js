import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function RepCountBar({ currentExercise, predictedClass, predictedProb, rep, screenWidth, screenHeight, orientation }) {

  return (
    <View style={{minHeight: orientation==='portrait'?100:50}}>
      <View style={styles(screenWidth, screenHeight, orientation).responsiveBox}>
        <View style={styles(screenWidth, screenHeight, orientation).textBarBox}>
          <Text style={styles(screenWidth, screenHeight, orientation).classText}>{currentExercise}</Text>
          <View style={{width:50,borderRadius: '10%',height:50}}>
          
            <Text style={styles(screenWidth, screenHeight, orientation).text}>{rep}</Text>
          
          </View>
          
        </View>
      </View>
    </View>
  );
}

const styles = (screenWidth, screenHeight, orientation) => StyleSheet.create({
    responsiveBox: {
        // minHeight: 100,
        // display: 'flex',
        flex: 1,
        justifyContent: 'center',
        position: 'absolute',
        // zIndex: 30,
        width: screenWidth-20,
        height: orientation === 'portrait' ? 0.1*screenHeight:0.2*screenHeight,
        backgroundColor: '#4F78E3',
        borderRadius: 30,
},
      textBarBox: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginRight: 20,
      },
      text: {
          fontSize: 45,
          fontWeight: 'bold',
          padding: 0,
          textAlign:'center',
          justifyContent:'center',
          color: 'white',
      },
      classText: {
        fontSize: 40,
        fontWeight: 'bold',
        padding: 15,
        color: 'white',
      },
      RepBox:{
        borderRadius: 10,
        padding:30,
        width:'100%',
      }
});
