import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const clientCredentials = {
    apiKey: "AIzaSyAwKTKPP682EQhscF2jHKCK5PyWASrJgPg",
    authDomain: "fir-apprecia.firebaseapp.com",
    projectId: "fir-apprecia",
    storageBucket: "fir-apprecia.appspot.com",
    messagingSenderId: "861697370360",
    appId: "1:861697370360:web:a94dc5bc1b92c300b6330d"
};

if (!firebase.apps.length) {
    firebase.initializeApp(clientCredentials);
}

export default firebase;