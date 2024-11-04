import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";


const firebaseConfig = {
    apiKey: "AIzaSyAwvbL34ayx9DrXofSSapN-Vn012ANRwyA",
    authDomain: "gainbotio.firebaseapp.com",
    projectId: "gainbotio",
    storageBucket: "gainbotio.appspot.com",
    messagingSenderId: "1053139608936",
    appId: "1:1053139608936:web:cb2b650b409dacb6bf22dd",
    measurementId: "G-9LTXMXMM62"
  };
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export { firebase }



