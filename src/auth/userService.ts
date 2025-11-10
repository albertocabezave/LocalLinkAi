import { doc, getDoc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { User } from "firebase/auth";

/**
 * Crea el documento del usuario en Firestore si no existe.
 * Si ya existe, puede actualizar algunos datos (como el rol).
 */
export const ensureUserDoc = async (user: User) => {
  if (!user?.uid) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // 🔹 Si el usuario no existe, lo creamos
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      displayName: user.displayName || "Nuevo usuario",
      createdAt: serverTimestamp(),
      verified: !!user.phoneNumber,
      role: "user", // 👈 rol por defecto
    });
    console.log("✅ Documento de usuario creado con rol 'user':", user.uid);
  } else {
    // 🔹 Si ya existe, actualizamos info básica
    await updateDoc(userRef, {
      email: user.email || null,
      phoneNumber: user.phoneNumber || null,
      verified: !!user.phoneNumber,
    });
    console.log("⚙️ Usuario existente actualizado:", user.uid);
  }
};

/**
 * Permite cambiar el rol de un usuario manualmente.
 */
export const setUserRole = async (uid: string, role: string) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, { role });
  console.log(`🔑 Rol actualizado para ${uid}: ${role}`);
};
