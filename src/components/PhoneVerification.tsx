import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  RecaptchaVerifier,
  linkWithPhoneNumber,
} from "firebase/auth";

export default function PhoneVerification({ onVerified }: { onVerified: () => void }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // ⚙️ Inicializa el reCAPTCHA
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

    setLoading(true);
    setupRecaptcha();

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await linkWithPhoneNumber(auth.currentUser, phone, appVerifier);
      setConfirmationResult(confirmation);
      alert("✅ Código enviado al número: " + phone);
    } catch (error: any) {
      console.error(error);
      alert("❌ Error al enviar el código: " + error.message);
    }

    setLoading(false);
  };

  // ✅ Confirmar el código de verificación
  const verifyCode = async () => {
    if (!confirmationResult) return alert("Primero debes enviar el código.");

    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      alert("✅ Teléfono verificado y vinculado: " + user.phoneNumber);
      onVerified();
    } catch (error: any) {
      console.error(error);
      alert("❌ Código incorrecto o expirado.");
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
