import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

// Registrar nuevo usuario
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error al registrar usuario:", error.message);
    throw error;
  }
};

// Iniciar sesión
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error al iniciar sesión:", error.message);
    throw error;
  }
};

// Cerrar sesión
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Error al cerrar sesión:", error.message);
    throw error;
  }
};
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error: any) {
    console.error("Error al iniciar sesión con Google:", error.message);
    throw error;
  }
};
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Guarda o actualiza un usuario en Firestore después de registrarse o verificar su teléfono.
 */
export const saveUserToFirestore = async (user: any, phoneNumber?: string) => {
  if (!user) return;

  try {
    await setDoc(
      doc(db, "users", user.uid),
      {
        email: user.email || null,
        phoneNumber: phoneNumber || user.phoneNumber || null,
        verified: true,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log("✅ Usuario guardado o actualizado en Firestore");
  } catch (error) {
    console.error("❌ Error guardando usuario en Firestore:", error);
  }
};
