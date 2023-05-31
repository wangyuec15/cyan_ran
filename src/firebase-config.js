/**
 * To find your Firebase config object:
 * 
 * 1. Go to your [Project settings in the Firebase console](https://console.firebase.google.com/project/_/settings/general/)
 * 2. In the "Your apps" card, select the nickname of the app for which you need a config object.
 * 3. Select Config from the Firebase SDK snippet pane.
 * 4. Copy the config object snippet, then add it here.
 */


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyChjQ6LcomFGYbPE3gpuiL6t7X4mp27yP8",
  authDomain: "cyan-ran.firebaseapp.com",
  projectId: "cyan-ran",
  storageBucket: "cyan-ran.appspot.com",
  messagingSenderId: "594871630206",
  appId: "1:594871630206:web:0add5a46929abd81f41b2f",
  measurementId: "G-9Q8MC3L81G"
};

// Initialize Firebase
const app = initializeApp(config);
const analytics = getAnalytics(app);

export function getFirebaseConfig() {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
    'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}