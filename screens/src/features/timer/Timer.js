import React, { useState, useEffect,useRef } from "react";
import { View, StyleSheet, Text, Vibration, Platform } from "react-native";
import { ProgressBar } from "react-native-paper";
import { useKeepAwake } from "expo-keep-awake";
import { colors } from "../../utils/colors";
import { spacing } from "../../utils/sizes";
import { Countdown } from "../../components/Countdown";

const DEFAULT_TIME = 0.1;
export const Timer = ({ session, exerciseList, currentExerciseIdx, minute, onTimerEnd, start, progress, onProgress, progressColor, countdownBgColor }) => {
  useKeepAwake();
  const [minutes, setMinutes] = useState(minute);
  const [isStarted, setIsStarted] = useState(start);
  // const [progress, setProgress] = useState(1);

  // this function receive progress value from Coundown.js
  // and set to the current value in this file
  // const onProgress = (new_progress) => {
  //   setProgress(new_progress);
  // };

  const vibrate = () => {
    if (Platform.OS == "ios") {
      // Vibrate every second
      const interval = setInterval(() => Vibration.vibrate(), 1000);
      // stop vibrate after 10 seconds
      setTimeout(() => clearInterval(interval), 1000);
    } else {
      // 10 secs (remember its millisecond)
      Vibration.vibrate(1000);
    }
  };

  const onEnd = () => {
    vibrate();
    // setMinutes(DEFAULT_TIME);
    // setProgress(1);
    // setIsStarted(false);
    onTimerEnd();
  };

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
    setIsStarted(false);
  };

  return (
    <View style={styles.container}>

      {/* <View style={{ paddingTop: spacing.xxxl }}> */}
      <View style={{}}>
          <ProgressBar
            // progress range from 0.1 to 1
            progress={progress}
            color={progressColor}
            style={{ height: 10 }}
          />
        </View>
      <View style={styles.countdownContainer}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          exerciseList={exerciseList}
          currentExerciseIdx={currentExerciseIdx}
          bgColor={countdownBgColor}
          onProgress={onProgress}
          onEnd={onEnd}
          timerSession={session}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  title: {
    color: colors.white,
    textAlign: "center",
  },
  task: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "bold",
  },
  countdownContainer: {
    flex: 1,
    alignItems: "center",
    bottom: 5
    // justifyContent: "center",
  },
  buttonContainer: {
    flex: 0.3,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  clearSubject: {
    paddingBottom: 5,
    paddingLeft: 25,
  },
});
