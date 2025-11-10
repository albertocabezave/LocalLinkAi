// src/auth/phoneAuth.ts
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

/**
 * 1️⃣ Inicializa el reCAPTCHA de Firebase
 * Esta función debe ejecutarse una sola vez antes de enviar el SMS.
 * Firebase requiere un reCAPTCHA para evitar abusos automáticos (bots).
 */
export const initRecaptcha = () => {
  // Creamos un verificador de reCAPTCHA invisible
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {
        console.log("reCAPTCHA verificado correctamente");
      },
    });
  }
};

/**
 * 2️⃣ Envía el SMS al número indicado.
 * Retorna un "confirmationResult" que usaremos para verificar el código.
 */
export const sendVerificationCode = async (phoneNumber: string) => {
  try {
    const appVerifier = window.recaptchaVerifier;
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    console.log("SMS enviado a:", phoneNumber);
    return confirmationResult; // se usa luego para verificar el código
  } catch (error: any) {
    console.error("Error enviando SMS:", error.message);
    throw error;
  }
};

/**
 * 3️⃣ Confirma el código enviado por SMS
 * Recibe el "confirmationResult" del paso anterior y el código que el usuario ingresó.
 */
export const confirmVerificationCode = async (confirmationResult: any, code: string) => {
  try {
    const result = await confirmationResult.confirm(code);
    console.log("Teléfono verificado:", result.user.phoneNumber);
    return result.user;
  } catch (error: any) {
    console.error("Error verificando código:", error.message);
    throw error;
  }
};
