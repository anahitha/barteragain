import firebase from 'firebase'
require ('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyBFZZd59o7ymdjvSZxXgt45mYC48LY0DPI",
  authDomain: "barter-d3106.firebaseapp.com",
    databaseURL: "https://barter-d3106.firebaseio.com",
  projectId: "barter-d3106",
  storageBucket: "barter-d3106.appspot.com",
  messagingSenderId: "407831935234",
  appId: "1:407831935234:web:ea2a5170ce7e34e2176a1b"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()