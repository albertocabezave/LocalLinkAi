// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGDjKEXDQ7NPFB1YDK663g8NA87VEo3Us",
  authDomain: "locallinkai-6eead.firebaseapp.com",
  projectId: "locallinkai-6eead",
  storageBucket: "locallinkai-6eead.firebasestorage.app",
  messagingSenderId: "455984814615",
  appId: "1:455984814615:web:0fb502b07d29387b5f1a52",
  measurementId: "G-9CF3WT6PX1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Add this line to export the authentication service
export const auth = getAuth(app);

// Optionally export app and analytics if needed later
export { app, analytics };
