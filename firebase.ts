
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "brotech-web-solutions.firebaseapp.com",
  projectId: "brotech-web-solutions",
  storageBucket: "brotech-web-solutions.appspot.com",
  messagingSenderId: "288226787153",
  appId: "1:288226787153:web:1be0e4aea819074dbe5d70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { db };