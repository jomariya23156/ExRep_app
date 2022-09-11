import * as tf from "@tensorflow/tfjs";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { Camera } from "expo-camera";
import {
  cameraWithTensors,
  bundleResourceIO,
} from "@tensorflow/tfjs-react-native";
import * as poseDetection from "@tensorflow-models/pose-detection";
import Svg, { Circle, Rect, G, Line } from "react-native-svg";
import "@mediapipe/pose";
import { Audio } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { DeviceMotion } from "expo-sensors";
import RepCountBar from "./src/components/RepCountBar";
import _ from "underscore";
import Button from "./src/components/Button";
import LottieView from "lottie-react-native";
import { ProgressBar } from "react-native-paper";
import { Countdown } from "./src/components/Countdown";
import { Timer } from "./src/features/timer/Timer";
import * as voices from "./src/utils/voices";
import * as workoutRoutines from "./src/utils/workoutRoutines";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { StackActions } from "@react-navigation/native";
import { firestore } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

tf.env().set("WEBGL_PACK_DEPTHWISECONV", false);

const TensorCamera = cameraWithTensors(Camera);
const inputTensorWidth = 152; //default from lib doc
const inputTensorHeight = 200; //default from lib doc
// const imageSize = { width: inputTensorWidth, height: inputTensorHeight };
const estimationConfig = {
  flipHorizontal: Platform.OS === "ios" ? false : true,
};
// var orientation = 'portrait'
var rafID;

// function useForceUpdate() {
//   const [value, setValue] = useState(0); // integer state
//   return () => setValue((value) => value + 1); // update the state to force render
// }

export default function Exercise({ route, navigation }) {
  // const forceUpdate = useForceUpdate();
  // function toHomepage(){
  //   soundRef.current.stopAsync();
  //   navigation.dispatch(StackActions.pop(3));
  // }

  const workoutMapping = {
    squat: workoutRoutines.squat,
    pushup: workoutRoutines.pushup,
    jumpingJack: workoutRoutines.jumpingJack,
    lunge: workoutRoutines.lunge,
    legraise: workoutRoutines.legraise,
    halfburpee: workoutRoutines.halfburpee,
    bicyclecrunch: workoutRoutines.bicyclecrunch,
    mountainclimber: workoutRoutines.mountainclimber,
    beginnerFullbody: workoutRoutines.beginnerFullbody,
    fullBody: workoutRoutines.fullBody,
  };

  // flags
  const disable_animation = true;
  const lockL = false;
  const disable_pred = false;

  // model
  const SEQ_LEN = 8;
  var seq_count = 0;
  var stackedTensor = null;
  // var numFrame = 0;
  const numFrame = useRef(0);
  const hardVote = useRef([]);
  const windowSize = 5; // # of class for hard voting (need tuning) // depend on smartphone performance

  const { plan, time } = route.params;

  const exerciseList = workoutMapping[plan];

  const [isPoseLoading, setPoseLoading] = useState(true);
  const [isCustomLoading, setCustomLoading] = useState(true);
  const [isTfReady, setIsTfReady] = useState(false);
  const [permission, setPermission] = useState(false);
  const [poseDetector, setPoseDetector] = useState(null);
  const [selectedPoseModel, setSelectedPoseModel] = useState(null);
  const [poseResult, setPoseResult] = useState(null);
  // const [responsiveScreen, setResponsiveScreen] = useState(null);
  // const [customModel, setCustomModel] = useState(null);
  const [customModels, setCustomModels] = useState({});
  const [predictedClass, setPredictedClass] = useState(null);
  const [predictedProb, setPredictedProb] = useState(null);
  const [rep, setRep] = useState(0);
  const classResult = [];
  const repResult = [];
  const [key, setKey] = useState("Please sign in");

  // screen states
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height
  );
  const orientation = useRef("portrait");
  // const orientation = useRef("landscape");
  // default value is for portrait
  const [ratio, setRatio] = useState({ width: 9, height: 16 - 2 });
  const [ratioMultiple, setRatioMultiple] = useState(screenWidth / ratio.width);
  // const [isRatioSet, setIsRatioSet] = useState(false);
  const [cameraPadding, setCameraPadding] = useState(0);

  // time control
  const [progress, setProgress] = useState(1);
  const [minute, setMinute] = useState(time / 60); // value 1 here is equal to 1 min / 60 sec
  const [runOnsetTimer, setRunOnsetTimer] = useState(true);
  const [runRestTimer, setRunRestTimer] = useState(false);

  // Exercise controls
  const [startCountdown, setStartCountdown] = useState(false);
  // const [isPlaying, setIsPlaying] = useState(false);
  const [matchEnd, setMatchEnd] = useState(false);
  const [repCounts, setRepCounts] = useState({});
  const isPlaying = useRef(false);
  // const isPlaying = useRef(true); //temp for testing
  const prevClass = useRef(null);
  const currentExerciseIdx = useRef(0);
  const currentSeq = useRef([]);
  const seqArray = useRef([]);
  // const exerciseList = useRef([]);
  const isRest = useRef(false);

  //Database
  const db = firestore().collection("History");

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userKey");
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  function getMostFrequent(arr) {
    const hashmap = arr.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(hashmap).reduce((a, b) =>
      hashmap[a] > hashmap[b] ? a : b
    );
  }

  async function load() {
    const localStorage = await getData();
    if (localStorage != null) {
      setKey(localStorage.email);
      return localStorage;
    }
  }

  async function addHistory() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var hours = new Date().getHours();
    var min = new Date().getMinutes();

    var durationtime = time;

    if (plan == "beginnerFullbody") {
      durationtime = time * 3;
    } else if (plan == "fullBody") {
      durationtime = time * 5;
    }

    var score = {
      timestamp: addZeroDate(hours) + ":" + addZeroDate(min),
      score: buildReport(),
      duration: durationtime + " s",
    };

    function addZeroDate(num) {
      if (num < 10) {
        return "0" + num;
      } else return num;
    }

    console.log("The account is " + key);
    if (key == "Please sign in") {
      console.log("Please sign in to store history");
    } else {
      const exerciseScore = await db
        .add({
          user: key,
          date: year + "-" + addZeroDate(month) + "-" + addZeroDate(date),
          exercise: score,
        })
        .then(() => {
          console.log(
            year +
              "-" +
              addZeroDate(month) +
              "-" +
              addZeroDate(date) +
              " History added"
          );
        });
    }
    soundRef.current.stopAsync();
    navigation.dispatch(StackActions.pop(3));
  }

  buildReport = () => {
    const report = [];
    var i = 0;
    for (let repCount in repCounts) {
      report.push({ class: classResult[i], id: i + 1, rep: repResult[i] });
      i++;
    }
    return report;
  };

  // Tensor
  // const [inputTensorSize, setInputTensorSize] = useState({
  //   width: inputTensorWidth,
  //   height: inputTensorHeight,
  // });
  const inputTensorSize = useRef({
    width: inputTensorWidth,
    height: inputTensorHeight,
  });

  const checkTfReady = async () => {
    // Wait for tf to be ready.
    await tf.ready();
    // Signal to the app that tensorflow.js can now be used.
    setIsTfReady(true);
    console.log("[INFO] TF is ready.");
  };

  const loadPoseModel = async () => {
    console.log("[INFO] Loading BlazePose");
    const model = poseDetection.SupportedModels.BlazePose;
    setSelectedPoseModel(model);
    const detectorConfig = {
      runtime: "tfjs",
      enableSmoothing: true,
      modelType: "full",
      // solutionPath: './node_modules/@mediapipe/pose/'
      // solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/'
    };
    const blazeposeDetector = await poseDetection.createDetector(
      model,
      detectorConfig
    );
    setPoseDetector(blazeposeDetector);
    setPoseLoading(false);
    console.log("[INFO] Pose detector model loaded");
  };

  const loadCustomModels = async () => {
    // we can't use loop to automate this part
    // because React Native doesn't support Dynamic names (name containing variables) in require()
    let modelJson = require(`./assets/custom-models/pushup_kps_seq/model.json`);
    let modelWeights = require(`./assets/custom-models/pushup_kps_seq/group1-shard1of1.bin`);
    const loadedPushupModel = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    );

    modelJson = require(`./assets/custom-models/squat_kps_seq/model.json`);
    modelWeights = require(`./assets/custom-models/squat_kps_seq/group1-shard1of1.bin`);
    const loadedSquatModel = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    );

    modelJson = require(`./assets/custom-models/jumping-jack_kps_seq/model.json`);
    modelWeights = require(`./assets/custom-models/jumping-jack_kps_seq/group1-shard1of1.bin`);
    const loadedJumpingJackModel = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    );

    modelJson = require(`./assets/custom-models/leg-raise_kps_seq/model.json`);
    modelWeights = require(`./assets/custom-models/leg-raise_kps_seq/group1-shard1of1.bin`);
    const loadedLegRaiseModel = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    );

    modelJson = require(`./assets/custom-models/half-burpee_kps_seq/model.json`);
    modelWeights = require(`./assets/custom-models/half-burpee_kps_seq/group1-shard1of1.bin`);
    const loadedHalfBurpeeModel = await tf.loadLayersModel(
      bundleResourceIO(modelJson, modelWeights)
    );

    // count_order is the right order for counting 1 rep used in count logic
    setCustomModels({
      pushup: {
        model: loadedPushupModel,
        classes: ["idle", "others", "pushup-down", "pushup-up"],
        count_order: ["pushup-down", "pushup-up"],
      },
      squat: {
        model: loadedSquatModel,
        classes: ["idle", "others", "squat-down", "squat-up"],
        count_order: ["squat-down", "squat-up"],
      },
      "leg-raise": {
        model: loadedLegRaiseModel,
        classes: ["idle", "leg-raise-down", "leg-raise-up", "others"],
        count_order: ["leg-raise-up", "leg-raise-down"],
      },
      "jumping-jack": {
        model: loadedJumpingJackModel,
        classes: ["idle", "jumping-jack-down", "jumping-jack-up", "others"],
        count_order: ["jumping-jack-up", "jumping-jack-down"],
      },
      "half-burpee": {
        model: loadedHalfBurpeeModel,
        classes: ["half-burpee-in", "half-burpee-out", "idle", "others"],
        count_order: ["half-burpee-in", "half-burpee-out"],
      },
    });

    setCustomLoading(false);
    console.log("[INFO] Successfully loaded custom models");
  };

  const preprocessKeypoints = (normalizedKP) => {
    const extractedKP = normalizedKP.map(({ x, y, score }) => {
      return [x, y, score];
    });
    // we add [] for an extra dim, the model accepts input as batch
    return tf.tensor([tf.util.flatten(extractedKP)]);
  };

  const renderPose = () => {
    const MIN_KEYPOINT_SCORE = 0.2;
    if (poseResult[0]) {
      // get only 1 person's pose
      const kp_array = poseResult[0].keypoints;
      const keypoints = kp_array
        .filter((v) => v.score > MIN_KEYPOINT_SCORE)
        .map((v, i) => {
          return (
            <Circle
              key={`skeletonkp_${i}`}
              cx={v.x}
              cy={v.y}
              r="2"
              strokeWidth="0"
              fill="blue"
            />
          );
        });

      const adjacentKeypoints =
        poseDetection.util.getAdjacentPairs(selectedPoseModel);

      const skeleton = adjacentKeypoints.map(([from, to], i) => {
        return (
          <Line
            key={`skeletonls_${i}`}
            x1={kp_array[from].x}
            y1={kp_array[from].y}
            x2={kp_array[to].x}
            y2={kp_array[to].y}
            stroke="magenta"
            strokeWidth="1"
          />
        );
      });

      // correct
      // console.log('[DEBUGGING] inputTensorSize in renderPose: ', inputTensorSize)

      return (
        <Svg
          key={inputTensorSize.current.width}
          height="100%"
          width="100%"
          // +10 for adjusted position
          viewBox={`0 0 ${inputTensorSize.current.width} ${inputTensorSize.current.height+10}`}
          // viewBox={`0 0 ${inputTensorHeight} ${inputTensorWidth}`}
          style={{
            transform: [{ rotateY: Platform.OS === "ios" ? "0deg" : "180deg" }],
          }}
          // viewBox={'0 0 720 1280'}
        >
          {skeleton}
          {keypoints}
        </Svg>
      );
    } else {
      return null;
    }
  };

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      const nextImageTensor = images.next().value;
      // do something with tensor

      // console.log('Images data:', images)
      // console.log('Image next:', images.next())
      // console.log('Tensor Data:', nextImageTensor)

      const pose = await poseDetector.estimatePoses(
        nextImageTensor,
        estimationConfig
      );
      // console.log("Poses results:", pose);
      setPoseResult(pose);
      if (!disable_pred) {
        if (pose[0]) {
          // console.log('[DEBUGGING] inputTensorSize in handle: ', inputTensorSize.current)

          const kp = pose[0].keypoints;
          const normalizedKP =
            poseDetection.calculators.keypointsToNormalizedKeypoints(
              kp,
              // there might be a problem here inputTensor will always have a initial value (portrait mode)
              inputTensorSize.current
            );
          // console.log("Normalized Poses results:", normalizedKP);
          // make a prediction
          const preprocessedKP = preprocessKeypoints(normalizedKP);
          // console.log("[DEBUG] preprocessedKP type:", typeof preprocessedKP);
          // console.log("[DEBUG] preprocessedKP data:", preprocessedKP);

          // if (seqArray.current.length === SEQ_LEN) {
          if (seq_count === SEQ_LEN) {
            var inputTensor = stackedTensor.slice(1, 7); // shape (8, 99)
            inputTensor = tf.concat([inputTensor, preprocessedKP]);
            stackedTensor = inputTensor;

            inputTensor = tf.expandDims(inputTensor); // add batch dim
            // inputTensor = stackedTensor.reshape([-1, 8 * 99]);
            // console.log("[DEBUG] inputTensor type", typeof inputTensor);
            // console.log("[DEBUG] inputTensor", inputTensor);
            var pred = await customModels[
              exerciseList[currentExerciseIdx.current]
            ]["model"]
              .predict(inputTensor)
              .data();
            // console.log("[DEBUG] pred", pred);
            // console.log("[DEBUG] pred type", typeof pred);
            var pred_class = await tf.argMax(pred).data(); // get the class in number
          } else {
            var pred_class = 0;
            if (preprocessedKP) {
              if (seq_count === 0) {
                stackedTensor = preprocessedKP;
              } else {
                stackedTensor = tf.concat([stackedTensor, preprocessedKP]);
              }
              // seqArray.current.push(preprocessedKP);
              seq_count += 1;
            }
          }
          // count logic
          // if the sequence of actions matches the correct order of count_order, count + 1
          // if the user is not playing, don't skip this part
          // console.log('Prediction:',customModels[exerciseList[currentExerciseIdx.current]]["classes"][
          //   pred_class
          // ]);
          // the state values here will be fixed to their values before
          // calling this function for the first time
          // so, we need to useRef variable here
          const className =
            customModels[exerciseList[currentExerciseIdx.current]]["classes"][
              pred_class
            ];
          if (isPlaying.current) {
            // for FPS counting
            numFrame.current++;
            console.log("numFrame:", numFrame.current);
          }
          if (isPlaying.current && !isRest.current) {
            // hard vote logic
            console.log("[DEBUG] new class:", className);
            hardVote.current.push(className);
            if (hardVote.current.length > windowSize) {
              // pop out first element
              hardVote.current.shift();
            }
            // console.log('[DEBUG] hardVote arr:', hardVote.current)
            var votedClass = getMostFrequent(hardVote.current);
            console.log("[DEBUG] votedClass:", votedClass);

            if (
              currentSeq.current.length <
              customModels[exerciseList[currentExerciseIdx.current]][
                "count_order"
              ].length
            ) {
              // push current class to list of sequence
              currentSeq.current.push(votedClass);
            } else {
              // if current sequence does not contain the current class
              if (
                votedClass != currentSeq.current[currentSeq.current.length - 1]
              ) {
                // pop out first element
                currentSeq.current.shift();
                // push current class to list of sequence
                currentSeq.current.push(votedClass);
                // count logic
                // if the current sequence is in the correct order of 1 rep, count it
                if (
                  // for array == will compare whether the arrays point to the same memory in ESMAscript
                  _.isEqual(
                    currentSeq.current,
                    customModels[exerciseList[currentExerciseIdx.current]][
                      "count_order"
                    ]
                  )
                ) {
                  console.log("Adding Rep");
                  setRep((prevRep) => prevRep + 1);
                }
              }
            }
          }

          // prevClass.current = votedClass;
          setPredictedClass(votedClass);
          if (pred) {
            setPredictedProb(pred[pred_class].toFixed(4));
          } else {
            setPredictedProb(0);
          }
        }
      } else {
        // disable custom models prediction (only pose)
        if (isPlaying.current){
          numFrame.current++;
          console.log("numFrame:", numFrame.current);
          setPredictedClass("No Prediction Model");
          setPredictedProb(0);
        }
      }
      tf.dispose(nextImageTensor);
      rafID = requestAnimationFrame(loop);
    };
    loop();
  };

  const requestCamera = async () => {
    // ask camera permission
    const { status } = await Camera.requestCameraPermissionsAsync();
    setPermission(status === "granted");
  };

  // helper functions

  // set progress bar
  const onProgress = (new_progress) => {
    setProgress(new_progress);
  };

  const checkSensors = async () => {
    const status = await DeviceMotion.isAvailableAsync();
    console.log("[INFO] Device Sensors availability: ", status);
  };

  const lockLandscape = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
    orientation.current = "landscape"; // *IMPORTANT*: This must be changed after lockAsync happened
    setRatio({ width: 16 - 3, height: 9 });
    // get new width and height
    setScreenWidth(Dimensions.get("window").width);
    setScreenHeight(Dimensions.get("window").height);
  };

  const lockPortrait = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
    orientation.current = "portrait"; // *IMPORTANT*: This must be changed after lockAsync happened
    setRatio({ width: 9, height: 16 - 2 });
    // get new width and height
    setScreenWidth(Dimensions.get("window").width);
    setScreenHeight(Dimensions.get("window").height);
  };

  const startMatch = () => {
    setStartCountdown(true);
    voices.firstExercise(exerciseList[currentExerciseIdx.current]);
    // countDownRef.current.play()
    // setIsPlaying(true)
  };

  const [sound, setSound] = React.useState();
  const soundRef = useRef(null);

  // useEffect(() => {
  //   console.log('[DEBUG] predictedClass:', predictedClass)
  // });

  const nextExercise = () => {
    seq_count = 0;
    // if it's already the last exercise
    if (currentExerciseIdx.current === exerciseList.length - 1) {
      isPlaying.current = false;
      // add rep to the object to store value before changing to the next exercise
      setRepCounts({
        ...repCounts,
        [exerciseList[currentExerciseIdx.current]]: rep,
      });
      setRep(0);
      setMinute(30 / 60);
      setProgress(1);
      setRunOnsetTimer(true);
      setRunRestTimer(false);
      isRest.current = false;

      setStartCountdown(false);
      setMatchEnd(true);
      voices.congratulations();
    } else {
      // add rep to the object to store value before changing to the next exercise
      setRepCounts({
        ...repCounts,
        [exerciseList[currentExerciseIdx.current]]: rep,
      });
      currentExerciseIdx.current += 1;
      currentSeq.current = [];
      setRep(0);
      setMinute(30 / 60);
      setProgress(1);
      setRunOnsetTimer(true);
      setRunRestTimer(false);
      isRest.current = false;
    }
  };

  buildResultReport = () => {
    const report = [];
    for (let repCount in repCounts) {
      classResult.push(repCount);
      repResult.push(repCounts[repCount]);
      report.push(
        <Text key={`rep_${repCount}`} style={{ fontSize: 26 }}>
          {repCount}: {repCounts[repCount]}
        </Text>
      );
    }
    return report;
  };

  useEffect(() => {
    load();

    if (orientation.current === "portrait") {
      // setInputTensorSize({ width: 152, height: 200 });
      inputTensorSize.current = {
        width: inputTensorWidth,
        height: inputTensorHeight,
      };
      // forceUpdate();
    } else {
      // setInputTensorSize({ width: 200, height: 152 });
      inputTensorSize.current = {
        width: inputTensorHeight,
        height: inputTensorWidth,
      };
      // forceUpdate();
    }
  }, [orientation.current]);

  // // use for tracking some value
  // useEffect for model and Camera things
  useEffect(() => {
    requestCamera();
    console.log("[INFO] Model preparation");
    loadPoseModel();

    // initailize exercise
    // exerciseList.current = ["pushup", "squat", "lunge"];
    // currentExerciseIdx.current = 0;

    // we do this beause we want to make sure tf.ready() must be finished first (in checkTfReady)
    checkTfReady().then(() => loadCustomModels());
    voices.bgSound(soundRef);

    return () => {
      if (rafID) {
        cancelAnimationFrame(rafID);
      }
    };
  }, []);

  // useEffect didMount for Sensor and Responsive Screen
  useEffect(() => {
    // add listener to Device Motion
    console.log("[INFO] Initial screen width: ", screenWidth);
    console.log("[INFO] Initial screen height: ", screenHeight);
    checkSensors();

    if (lockL) {
      lockLandscape();
    }
    // DeviceMotion.addListener((deviceMotionData) => {
    //   // sometimes at the beginning rotation.alpha is undefined
    //   // so this first if is to prevent that
    //   // if (deviceMotionData.rotation) {
    //   //   // console.log(
    //   //   //   "alpha value: ",
    //   //   //   deviceMotionData.rotation.alpha.toFixed(3)
    //   //   // );
    //   //   // console.log(
    //   //   //   "beta value: ",
    //   //   //   deviceMotionData.rotation.beta.toFixed(3)
    //   //   // );

    //   //   // change to landscape
    //   //   // use beta < 1 here in case of holding phone in portrait mode and leaning toward body
    //   //   // (this case can cause alpha value go under 0)
    //   //   if (
    //   //     (deviceMotionData.rotation.alpha >= 2.2 ||
    //   //       deviceMotionData.rotation.alpha <= 0) &&
    //   //     deviceMotionData.rotation.beta < 0.5 &&
    //   //     orientation.current === "portrait"
    //   //   ) {
    //   //     console.log("[INFO] Changing to landscape");
    //   //     // lockLandscape();
    //   //     lockLandscape().then(() => {
    //   //       // use ratio of height in Portrait mode
    //   //       setRatioMultiple(screenHeight / ratio.height);
    //   //       // setInputTensorSize({ width: 200, height: 152 });
    //   //       // forceUpdate();
    //   //     });
    //   //   } else if (
    //   //     deviceMotionData.rotation.alpha < 2.2 &&
    //   //     deviceMotionData.rotation.alpha > 0 &&
    //   //     deviceMotionData.rotation.beta > 0.2 &&
    //   //     orientation.current === "landscape"
    //   //   ) {
    //   //     console.log("[INFO] Changing to portrait");
    //   //     // lockPortrait();
    //   //     lockPortrait().then(() => {
    //   //       // use ratio of width in Portrait mode
    //   //       setRatioMultiple(screenWidth / ratio.width);
    //   //       // setInputTensorSize({ width: 152, height: 200 });
    //   //       // forceUpdate();
    //   //     });
    //   //   }
    //   // }
    //   // console.log("Device Orientation: ", deviceMotionData.orientation);
    // });

    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  let textureDims;
  if (Platform.OS === "ios") {
    textureDims = {
      height: 1920,
      width: 1080,
    };
  } else {
    textureDims = {
      height: 1200,
      width: 1600,
    };
  }
  if (matchEnd) {
    const fps = (numFrame.current / time).toFixed(2);
    // console.log('[INFO] numFrame:', numFrame);
    // console.log("[INFO] Average FPS:", fps);

    if (Platform.OS != "ios") {
      soundRef.current.stopAsync();
    }
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          // Background Linear Gradient
          colors={["#4F78E3", "#634FE3"]}
          start={{ x: 1, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, width: "100%" }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 35,
                color: "#FFFFFF",
                paddingTop: "20%",
                paddingRight: "5%",
                textAlign: "right",
              }}
            >
                 Score {/*{numFrame.current} {fps} */}
            </Text>
          </View>

          <View
            style={{
              alignItems: "center",
              margin: "5%",
              padding: "5%",
              borderRadius: 20,
              backgroundColor: "white",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                margin: 10,
              }}
            >
              Congratulations
            </Text>

            <Text
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bold",
                margin: 10,
              }}
            >
              Finished
            </Text>
            {buildResultReport()}
            <View style={{ alignSelf: "center" }}></View>
          </View>
          <TouchableOpacity
            onPress={addHistory}
            style={{ alignItems: "center" }}
          >
            <View
              style={{
                alignItems: "center",
                backgroundColor: "white",
                margin: 10,
                padding: 10,
                width: "90%",
                borderRadius: 30,
              }}
            >
              <Text style={{ color: "#634FE3", fontSize: 20 }}>
                Back to Homepage
              </Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }
  if (permission === null) {
    return <View />;
  }
  if (permission === false) {
    return <Text>No access to camera</Text>;
  } else {
    return (
      <View>
        {isPoseLoading || isCustomLoading ? (
          <View
            style={{
              marginTop: 350,
              // flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 70,
                color: '#4F78E3',
              }}
            >
              Loading...
            </Text>
            <View style={styles.loadingIndicator}>
              {/* <ActivityIndicator size="large" color="#FF0266" /> */}
              <LottieView
                style={{ position: "relative" }}
                key="loader"
                source={require("./assets/animations/dumbbell_loader.json")}
                autoPlay
                loop
              />
            </View>
          </View>
        ) : (
          <View style={{ backgroundColor: "black" }}>
            {startCountdown ? (
              disable_animation ? (
                (isPlaying.current = true)
              ) : (
                <LottieView
                  style={{ position: "absolute", zIndex: 100, bottom: 100 }}
                  key="countdown"
                  source={require("./assets/animations/count_down_5.json")}
                  autoPlay={true}
                  loop={false}
                  onAnimationFinish={() => {
                    isPlaying.current = true;
                  }}
                />
              )
            ) : !isPlaying.current ? (
              <View
                style={{
                  position: "absolute",
                  // bottom: 170,
                  bottom: 0.28 * screenHeight,
                  // marginHorizontal: 168,
                  marginHorizontal: 0.35 * screenWidth,
                  zIndex: 200,
                }}
              >
                <View style={styles.startButtonContainer}>
                  <Button
                    size="40"
                    iconName="dumbbell"
                    backgroundColor="#4F78E3"
                    onPress={startMatch}
                  />
                </View>
              </View>
            ) : (
              <></>
            )}

            {isPlaying.current ? (
              <View style={{ zIndex: 200, top: 0.88 * screenHeight }}>
                {runOnsetTimer ? (
                  <Timer
                    key="Onset"
                    session="Onset"
                    exerciseList={exerciseList}
                    currentExerciseIdx={currentExerciseIdx.current}
                    minute={minute}
                    start={true}
                    progress={progress}
                    onProgress={onProgress}
                    progressColor="#634FE3"
                    countdownBgColor="#4F78E3"
                    onTimerEnd={() => {
                      setRunOnsetTimer(false);
                      setRunRestTimer(true);
                      setProgress(1);
                      isRest.current = true;
                      // if it's already the last exercise, we force to skip rest timer
                      // cuz we don't want rest time at the end
                      // and this can also prevent error in running inference
                      if (
                        currentExerciseIdx.current ===
                        exerciseList.length - 1
                      ) {
                        nextExercise();
                      }
                    }}
                  />
                ) : runRestTimer ? (
                  <>
                    <View style={{}}>
                      <LottieView
                        key="next"
                        style={{
                          position: "absolute",
                          // zIndex: 200,
                          bottom: 200,
                        }}
                        source={require("./assets/animations/next.json")}
                        autoPlay={true}
                        loop={false}
                      />
                    </View>
                    <Timer
                      key="Rest"
                      session="Rest"
                      exerciseList={exerciseList}
                      currentExerciseIdx={currentExerciseIdx.current}
                      // 5 sec
                      minute={7 / 60}
                      start={true}
                      progress={progress}
                      onProgress={onProgress}
                      progressColor="#5E84E2"
                      countdownBgColor="#634FE3"
                      onTimerEnd={nextExercise}
                    />
                  </>
                ) : (
                  <View></View>
                )}
              </View>
            ) : (
              <View></View>
            )}

            <View style={styles.RepCountBar}>
              <RepCountBar
                currentExercise={exerciseList[currentExerciseIdx.current]}
                predictedClass={predictedClass}
                predictedProb={predictedProb}
                rep={rep}
                screenWidth={screenWidth}
                screenHeight={screenHeight}
                orientation={orientation.current}
              />
              <View style={styles.cameraContainer}>
                <TensorCamera
                  // Standard Camera props
                  style={[displayStyles(ratio, ratioMultiple).camera]}
                  type={Camera.Constants.Type.front}
                  // Tensor related props
                  cameraTextureHeight={textureDims.height}
                  cameraTextureWidth={textureDims.width}
                  resizeHeight={inputTensorSize.current.height}
                  resizeWidth={inputTensorSize.current.width}
                  resizeDepth={3}
                  onReady={handleCameraStream}
                  autorender={true}
                />
                {poseResult ? (
                  <View
                    style={displayStyles(ratio, ratioMultiple).modelResults}
                  >
                    {renderPose()}
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  startButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    // bottom: 30,
    // zIndex: 100,
  },
  cameraContainer: {
    display: "flex",
    // flex:1,
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    zIndex: 0,
  },
  loadingIndicator: {
    marginTop: 100,
    flex: 1,
    justifyContent: "center",
    width: 200,
    height: 200,
    // top: 20,
    // right: 20,
  },
  RepCountBar: {
    marginLeft: 10,
    marginTop: 40,
  },
  buttonText: {
    fontSize: 64,
    width: "100%",
  },
  StartButon: {
    width: "100%",
    padding: 50,
  },
});

const displayStyles = (ratio, ratioMultiple) =>
  StyleSheet.create({
    camera: {
      position: "absolute",
      width: ratio.width * ratioMultiple,
      height: ratio.height * ratioMultiple,
      // width: '100%',
      // height: '100%',
      zIndex: 1,
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 0,
    },
    modelResults: {
      position: "absolute",
      width: ratio.width * ratioMultiple,
      height: ratio.height * ratioMultiple,
      // width: '100%',
      // height: '100%',
      zIndex: 20,
      borderWidth: 1,
      borderColor: "black",
      borderRadius: 0,
    },
  });
