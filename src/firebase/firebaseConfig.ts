// Importar las funciones necesarias de Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // 👈 Importa Firestore

// Configuración de tu app Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCGDjKEXDQ7NPFB1YDK663g8NA87VEo3Us",
  authDomain: "locallinkai-6eead.firebaseapp.com",
  projectId: "locallinkai-6eead",
  storageBucket: "locallinkai-6eead.firebasestorage.app",
  messagingSenderId: "455984814615",
  appId: "1:455984814615:web:0fb502b07d29387b5f1a52",
  measurementId: "G-9CF3WT6PX1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Servicios principales
export const auth = getAuth(app);
export const db = getFirestore(app); // 👈 Agregado correctamente

// Exportaciones opcionales
export { app, analytics };
