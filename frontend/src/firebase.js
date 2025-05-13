// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdTerOn5YiOgfpWkDhS5F9D-s8Q1tgR8k",
  authDomain: "hospital-management-71dc8.firebaseapp.com",
  projectId: "hospital-management-71dc8",
  storageBucket: "hospital-management-71dc8.app", // <- FIXED
  messagingSenderId: "353070336974",
  appId: "1:353070336974:web:1ecd401aef0002b02f399f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
