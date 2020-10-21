import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBxAd8oCbLfq1FM-6oXm9_MLxi3W6Y1gaE",
    authDomain: "instagram-clone-react-4c169.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-4c169.firebaseio.com",
    projectId: "instagram-clone-react-4c169",
    storageBucket: "instagram-clone-react-4c169.appspot.com",
    messagingSenderId: "356640939200",
    appId: "1:356640939200:web:1a22fc6e485b307cf7e125",
    measurementId: "G-89FVGDZW26"
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
