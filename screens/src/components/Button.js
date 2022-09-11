import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageComponent } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5'

export default function Button(props) {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={[{ backgroundColor: props.backgroundColor }, props.style, styles.button]}
      >
          <Icon style={{fontSize:60}} name={props.iconName} color='white' size={20}/>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
        width: 120,
        height: 120,
        padding: 10,
        elevation: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
    },
});
