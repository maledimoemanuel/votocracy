// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBw7pZDPcySChkhXVPwKoSqYh05G37-ejg",
  authDomain: "votocracy-b43a0.firebaseapp.com",
  projectId: "votocracy-b43a0",
  storageBucket: "votocracy-b43a0.appspot.com",
  messagingSenderId: "883726884668",
  appId: "1:883726884668:web:ea6e47e729c591dfb4c839",
  measurementId: "G-N8V5BMRY3H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
export { app, auth, db, storage, database };
const analytics = getAnalytics(app);