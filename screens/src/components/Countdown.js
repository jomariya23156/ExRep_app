import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import { colors } from "../utils/colors";
import { fontSizes, spacing } from "../utils/sizes";
import * as voices from '../utils/voices';

// Interval in JS is use to do repetitive tasks
// setInterval()

// in JS and Interval, normally time works in millisecond
// so we need to convert minute to milli here
const minutesToMillis = (min) => min * 1000 * 60;
const formatTime = (time) => (time < 10 ? `0${time}` : time);

export const Countdown = ({ minutes, exerciseList, currentExerciseIdx, isPaused, onProgress, onEnd, bgColor, timerSession }) => {
  const [millis, setMillis] = useState(null);

  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  const interval = useRef(null);
  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        // do something
        clearInterval(interval.current);
        return time;
      }
      // 1000 milli is 1 sec
      const timeLeft = time - 1000;

      return timeLeft;
    });
  };

  useEffect(() => {
    if (timerSession === 'Onset'){
      voices.boxingBell()
      voices.startExercise()
    }

    if (timerSession === "Rest" && currentExerciseIdx === exerciseList.length - 2) {
      voices.lastExercise(exerciseList[currentExerciseIdx+1])
    }
    else if (timerSession === "Rest" && currentExerciseIdx < exerciseList.length - 2) {
      voices.nextExercise(exerciseList[currentExerciseIdx+1])
    }
  }, [])

  useEffect(() => {
    // report progress
    onProgress(millis / minutesToMillis(minutes));
    if (millis === 0) {
      voices.boxingBell()
      onEnd();
    }
    if (millis) {

      if (millis.toFixed(3) === (2/60).toFixed(3) && timerSession === "Rest") {
        console.log('playing bePrepared in Countdown')
        voices.bePrepared()
      }

      if (millis.toFixed(3) === (minutesToMillis(minutes) / 2).toFixed(3) && timerSession === "Onset") {
        console.log('playing halfway in Countdown')
        voices.halfway()
      }
      else if (millis.toFixed(3) === minutesToMillis(20 / 60).toFixed(3) && timerSession === "Onset") {
        console.log('playing last20Sec in Countdown')
        voices.last20Sec()
      }
      else if (millis.toFixed(3) === minutesToMillis(10 / 60).toFixed(3) && timerSession === "Onset") {
        console.log('playing last10Sec in Countdown')
        voices.last10Sec()
      }
      else if (millis.toFixed(3) === minutesToMillis(3 / 60).toFixed(3) && timerSession === "Onset") {
        console.log('playing readyToBreak in Countdown')
        voices.readyToBreak()
      }
    }
  }, [millis]);

  useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  useEffect(() => {
    // if it is paused, we're not going to count down
    if (isPaused) {
      if (interval.current) {
        clearInterval(interval.current);
      }
      return;
    }

    // every sec with run the countDown
    interval.current = setInterval(countDown, 1000);
    // this is call clean up function
    // the clean up function will be called only component will unmount
    // so, this is equal to componentWillUnmount
    return () => clearInterval(interval.current);
  }, [isPaused]);

  return (
    <View style={{position:'absolute'}}>
    <Text style={styles(bgColor).text}>
      {formatTime(minute)}:{formatTime(seconds)}
    </Text>
    </View>
  );
};

const styles = (bgColor) => StyleSheet.create({
  text: {
    marginTop: 10,
    fontSize: fontSizes.xxxl,
    fontWeight: "bold",
    color: colors.white,
    // padding: spacing.lg,
    padding: 10,
    backgroundColor: bgColor,
  },
});
