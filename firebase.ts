import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbS4_BbSjo6P86Hw5Z1B8B59Sv4I7GXWo",
  authDomain: "am-impact-hub.firebaseapp.com",
  projectId: "am-impact-hub",
  storageBucket: "am-impact-hub.firebasestorage.app",
  messagingSenderId: "878373297289",
  appId: "1:878373297289:web:d7229d46490060b333fa58",
  measurementId: "G-KYXHNC3MVX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);