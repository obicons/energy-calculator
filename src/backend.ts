// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { addDoc, collection, FieldValue, getFirestore, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcC6tBuapaZSYpKAderA0N1V6XZhOHcm8",
  authDomain: "energy-supplier.firebaseapp.com",
  projectId: "energy-supplier",
  storageBucket: "energy-supplier.appspot.com",
  messagingSenderId: "794453141661",
  appId: "1:794453141661:web:6823ae79fcfb29406e4c74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export const getTimestamp = (): FieldValue  => serverTimestamp();

export const addUserData = (data: any) => {
  addDoc(collection(db, 'managedClients'), data).then(() => console.log('Added document.'));
};