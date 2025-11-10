import React, { useState } from "react";
import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  linkWithCredential,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export default function PhoneVerification({ onVerified }: { onVerified: () => void }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ⚙️ Inicializa reCAPTCHA invisible solo una vez
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  // 📲 Enviar código SMS para vincular número
  const sendCode = async () => {
    if (!auth.currentUser) {
      alert("Primero inicia sesión antes de verificar el teléfono.");
      return;
    }

    try {
      setLoading(true);
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;

      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phone, appVerifier);
      setVerificationId(id);

      alert("✅ Código enviado al número: " + phone);
    } catch (error: any) {
      console.error("❌ Error al enviar el código:", error);
      alert("❌ Error al enviar el código: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Confirmar el código de verificación y vincular el número con el usuario
  const verifyCode = async () => {
    if (!verificationId) return alert("Primero debes enviar el código.");

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await linkWithCredential(auth.currentUser!, credential);

      alert("✅ Teléfono verificado y vinculado correctamente.");
      onVerified();
    } catch (error: any) {
      console.error("❌ Error al verificar el código:", error);
      alert("❌ Código incorrecto o ya vinculado a otra cuenta.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        Verificación por Teléfono
      </h2>

      <input
        type="tel"
        placeholder="+584xxxxxxxxx"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />

      <button
        onClick={sendCode}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {loading ? "Enviando..." : "Enviar código"}
      </button>

      <input
        type="text"
        placeholder="Código de verificación"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />

      <button
        onClick={verifyCode}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Verificar
      </button>

      <div id="recaptcha-container" className="mt-4"></div>
    </div>
  );
}	

