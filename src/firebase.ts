import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DITT_PROJECT.firebaseapp.com",
  projectId: "DITT_PROJECT_ID",
  storageBucket: "DITT_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
