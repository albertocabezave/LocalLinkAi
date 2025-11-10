// src/auth/userService.ts
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// 🔧 Crea o actualiza el documento del usuario en Firestore
export async function ensureUserDoc(user: any) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  // 📞 Si el "correo" es virtual (registrado con número)
  const phoneMatch = user.email?.match(/^(\d+)@phone\.locallinkai\.app$/);
  const phoneFromEmail = phoneMatch ? `+${phoneMatch[1]}` : null;

  const userData = {
    uid: user.uid,
    email: phoneMatch ? null : user.email || null,
    phoneNumber: user.phoneNumber || phoneFromEmail || null,
    createdAt: new Date(),
  };

  if (!snap.exists()) {
    // 🆕 Si no existe, lo creamos
    await setDoc(userRef, userData);
    console.log("✅ Documento de usuario creado:", userData);
  } else {
    // 🔄 Si ya existe, actualizamos datos si algo cambió
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
