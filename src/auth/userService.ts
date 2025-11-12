// 🗓️ 2025-11-11
// Contexto: Vincula el correo real y el número virtual de teléfono para permitir login dual.

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { auth } from "../firebase/firebaseConfig";
import { linkWithCredential, EmailAuthProvider } from "firebase/auth";

// 🔧 Crea o actualiza el documento del usuario en Firestore
export async function ensureUserDoc(user: any) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const phoneMatch = user.email?.match(/^(\d+)@phone\.locallinkai\.app$/);
  const phoneFromEmail = phoneMatch ? `+${phoneMatch[1]}` : null;

  const userData = {
    uid: user.uid,
    email: phoneMatch ? null : user.email || null,
    phoneNumber: user.phoneNumber || phoneFromEmail || null,
    createdAt: new Date(),
  };

  // 🪄 Si el usuario tiene teléfono y correo, vincula ambos para login dual
  try {
    if (user.phoneNumber && user.email) {
      const fakeEmail = `${user.phoneNumber.replace("+", "")}@phone.locallinkai.app`;
      const password = "defaultPass123"; // No se usa realmente, es solo para el vínculo

      const credential = EmailAuthProvider.credential(fakeEmail, password);
      await linkWithCredential(user, credential);
      console.log("✅ Usuario vinculado para login por teléfono o correo.");
    }
  } catch (err: any) {
    if (err.code !== "auth/credential-already-in-use") {
      console.warn("⚠️ No se pudo vincular el correo virtual:", err.message);
    }
  }

  // 📘 Guardar o actualizar documento
  if (!snap.exists()) {
    await setDoc(userRef, userData);
    console.log("✅ Documento de usuario creado:", userData);
  } else {
    const existing = snap.data();
    const updates: any = {};

    if (userData.phoneNumber && userData.phoneNumber !== existing.phoneNumber) {
      updates.phoneNumber = userData.phoneNumber;
    }

    if (userData.email && userData.email !== existing.email) {
      updates.email = userData.email;
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(userRef, updates);
      console.log("🔄 Documento de usuario actualizado:", updates);
    }
  }
}
