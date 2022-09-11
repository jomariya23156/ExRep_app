import { Audio } from "expo-av";
import _ from "underscore";

// Exercise voices
export const squat = async () => {
  console.log("Loading Squat Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/Squat.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Squat Voice");
  await sound.playAsync();
};

export const lunge = async () => {
  console.log("Loading Lunge Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/Lunge.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Lunge Voice");
  await sound.playAsync();
};

export const pushup = async () => {
  console.log("Loading Pushup Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/PushUp.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Pushup Voice");
  await sound.playAsync();
};

export const legRaise = async () => {
  console.log("Loading LegRaise Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/LegRaise.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing LegRaise Voice");
  await sound.playAsync();
};

export const mountainClimber = async () => {
  console.log("Loading MountainClimber Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/MountainClimber.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing MountainClimber Voice");
  await sound.playAsync();
};

export const bicycleCrunch = async () => {
  console.log("Loading BicycleCrunch Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/BicycleCrunch.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing BicycleCrunch Voice");
  await sound.playAsync();
};

export const jumpingJack = async () => {
  console.log("Loading JumpingJack Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/JumpingJack.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing JumpingJack Voice");
  await sound.playAsync();
};

export const halfBurpee = async () => {
  console.log("Loading HalfBurpee Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/HalfBurpee.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing HalfBurpee Voice");
  await sound.playAsync();
};

export const plankToPushup = async () => {
  console.log("Loading PlankToPushUp Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/PlankToPushUp.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing PlankToPushUp Voice");
  await sound.playAsync();
};

const exerciseMapping = {
  'squat': squat,
  'lunge': lunge,
  'pushup': pushup,
  'jumping-jack': jumpingJack,
  'mountain-climber': mountainClimber,
  'leg-raise': legRaise,
  'half-burpee': halfBurpee,
  'plank-to-pushup': plankToPushup,
  'bicycle-crunch': bicycleCrunch
};

// util voices
export const bgSound = async (soundRef) => {
  console.log("Loading BG Sound");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/TestSound(Uncut).mp3"),
    { volume: 0.45, isLooping: true }
  );
  soundRef.current = sound;
  console.log("Playing BG Sound");
  await sound.playAsync();
};

export const boxingBell = async () => {
  console.log("Loading BoxingBell Sound");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/BoxingBell.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing BoxingBell Sound");
  await sound.playAsync();
};

// instruction voices
export const startExercise = async () => {
  console.log("Loading StartExercise Voice");
  // randomly pick the voice
  const selected = _.sample(["LetsGo", "Start"]);
  if (selected === "LetsGo") {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/LetsGo.mp3")
    );
  } else {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/Start.mp3")
    );
  }
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing StartExercise Voice");
  await sound.playAsync();
};

export const bePrepared = async () => {
  console.log("Loading BePrepared Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/BePrepared.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing BePrepared Voice");
  await sound.playAsync();
};

export const last20Sec = async () => {
  console.log("Loading Last20Sec Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/Last20Sec.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Last20Sec Voice");
  await sound.playAsync();
};

export const last10Sec = async () => {
  console.log("Loading Last10Sec Voice");
  // randomly pick the voice
  const selected = _.sample([1, 2, 3]);
  if (selected === 1) {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/Last10Sec1.mp3")
    );
  } else if (selected === 2) {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/Last10Sec2.mp3")
    );
  } else {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/Last10Sec3.mp3")
    );
  }
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Last10Sec Voice");
  await sound.playAsync();
};

export const readyToBreak = async () => {
  console.log("Loading ReadyToBreak Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/321_rest.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing ReadyToBreak Voice");
  await sound.playAsync();
};

export const nextExercise = async (exercise) => {
  console.log("Loading NextExercise Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/NextExercise(new).mp3")
  );
  // when the first voice is done, play another one
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      exerciseMapping[exercise]();
      sound.unloadAsync()
    }
  });
  console.log("Playing NextExercise Voice");
  await sound.playAsync();
};

export const firstExercise = async (exercise) => {
  console.log("Loading FirstExercise Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/FirstExercise.mp3")
  );
  // when the first voice is done, play another one
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      exerciseMapping[exercise]();
      sound.unloadAsync()
    }
  });
  console.log("Playing FirstExercise Voice");
  await sound.playAsync();
};

export const lastExercise = async (exercise) => {
  console.log("Loading LastExercise Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/LastExercise.mp3")
  );
  // when the first voice is done, play another one
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      exerciseMapping[exercise]();
      sound.unloadAsync()
    }
  });
  console.log("Playing LastExercise Voice");
  await sound.playAsync();
};

// Motivation voices
export const congratulations = async () => {
  console.log("Loading Congrats Voice");
  const { sound } = await Audio.Sound.createAsync(
    require("../../../assets/SoundTrack/Congratulation.mp3")
  );
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Congrats Voice");
  await sound.playAsync();
};

export const halfway = async () => {
  console.log("Loading Halfway Voice");
  // randomly pick the voice
  const selected = _.sample(["Halfway", "AlmostDone"]);
  console.log('Randomly pick: "' + selected + '" from halfway tracks')
  if (selected === "AlmostDone") {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/AlmostDone(new).mp3")
    );
  } else {
    var { sound } = await Audio.Sound.createAsync(
      require("../../../assets/SoundTrack/Halfway.mp3")
    );
  }
  sound.setOnPlaybackStatusUpdate((status) => {
    if (status.didJustFinish) {
      sound.unloadAsync()
    }
  });
  console.log("Playing Halfway Voice");
  await sound.playAsync();
};
