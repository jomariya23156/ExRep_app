// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHHV-Y_410_YmUYXH-WeyTkABi2gvMdQM",
  authDomain: "ezfit-c93bb.firebaseapp.com",
  projectId: "ezfit-c93bb",
  storageBucket: "ezfit-c93bb.appspot.com",
  messagingSenderId: "736280116493",
  appId: "1:736280116493:web:011a44982c3ec2362f8444",
  measurementId: "G-PXD7FZ3JRZ"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
export const firestore = firebase.firestore; 
export default firebase;
