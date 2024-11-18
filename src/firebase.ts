import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA4hfkxRE3RssoAmzAJCYhYPCgci6e_hwg",
  authDomain: "voice-to-text-clone.firebaseapp.com",
  projectId: "voice-to-text-clone",
  storageBucket: "voice-to-text-clone.firebasestorage.app",
  messagingSenderId: "948744190990",
  appId: "1:948744190990:web:ec5aa97782a652403a905f",
  measurementId: "G-DF6T7KFT4P"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };