// src/auth/authService.ts
import { auth } from "../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Normaliza el número a formato +<country><rest>, por ejemplo +584141234567
 */
function normalizePhone(input: string, defaultCountry = "+1") {
  let v = input.trim();
  // si el usuario escribe con espacios o guiones los quitamos
  v = v.replace(/[\s\-()\.]/g, "");
  // si empieza con 0 y no con +, podrías transformarlo (opcional)
  if (!v.startsWith("+")) {
    // si empieza con 0, lo removemos
    if (v.startsWith("0")) v = v.replace(/^0+/, "");
    v = `${defaultCountry}${v}`;
  }
  return v;
}

/**
 * Busca en Firestore un usuario cuyo phoneNumber coincida exactamente.
 * Devuelve el email real si lo encuentra (userDoc.email), o null si no.
 */
export async function findEmailByPhone(phoneInput: string, defaultCountry = "+1"): Promise<string | null> {
  const phone = normalizePhone(phoneInput, defaultCountry);
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phoneNumber", "==", phone));
    const snap = await getDocs(q);
    if (!snap.empty) {
      // devuelve el primer doc con phoneNumber
      const docData = snap.docs[0].data() as any;
      // aseguramos que haya un email real guardado
      if (docData.email && typeof docData.email === "string" && docData.email.length > 3) {
        return docData.email;
      }
    }
    return null;
  } catch (err) {
    console.error("findEmailByPhone error:", err);
    return null;
  }
}

/**
 * Intenta loguear con input que puede ser email OR phoneNumber.
 * Si es número: primero intenta mapear a un email real en Firestore; si existe usa ese email + contraseña.
 * Si no existe mapping, convierte el número a email virtual y hace login con ese email virtual.
 *
 * Retorna el userCredential.user o lanza error para que el caller lo maneje.
 */
export async function loginWithPhoneOrEmail(input: string, password: string, defaultCountry = "+1") {
  const raw = input.trim();

  // Si parece un email, iniciar sesión por email directo
  if (raw.includes("@")) {
    return await signInWithEmailAndPassword(auth, raw.toLowerCase(), password);
  }

  // si parece número, primero normalizar y buscar mapping en Firestore
  const mappedEmail = await findEmailByPhone(raw, defaultCountry);

  if (mappedEmail) {
    // 🔐 existe un email real asociado: usarlo para el sign-in
    return await signInWithEmailAndPassword(auth, mappedEmail.toLowerCase(), password);
  }

  // ❗ si no hay mapping, usamos la estrategia actual de "email virtual"
  const normalizedPhone = normalizePhone(raw, defaultCountry); // +584...
  const virtualEmail = `${normalizedPhone}@phone.locallinkai.app`;
  return await signInWithEmailAndPassword(auth, virtualEmail, password);
}
