// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmbbPSNXOdmBvD1PkTFpOnLP6c5SUzkj8",
  authDomain: "studio-7534691633-a3633.firebaseapp.com",
  databaseURL: "https://studio-7534691633-a3633.firebaseio.com",
  projectId: "studio-7534691633-a3633",
  storageBucket: "studio-7534691633-a3633.appspot.com",
  messagingSenderId: "92050366243",
  appId: "1:92050366243:web:ec1511c14c949214057696"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Firebase initialization error", e);
  }
} else {
  app = getApp();
}

const db = app ? getDatabase(app) : null;

export { app, db };
