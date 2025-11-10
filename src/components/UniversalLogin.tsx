import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

export default function UniversalLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [identifier, setIdentifier] = useState(""); // correo o teléfono
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Detectar si es correo o teléfono
  const isEmail = identifier.includes("@");

  // 🔹 Inicializar el reCAPTCHA invisible (para SMS)
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  // 🚀 Iniciar sesión o registrar
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEmail) {
        // 📨 Autenticación por correo
        const userCredential = isRegister
          ? await createUserWithEmailAndPassword(auth, identifier, password)
          : await signInWithEmailAndPassword(auth, identifier, password);

        onLogin(userCredential.user);
      } else {
        // 📱 Autenticación por teléfono
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, identifier, appVerifier);
        setConfirmationResult(confirmation);
        alert("Código SMS enviado al número " + identifier);
      }
    } catch (error: any) {
      alert("❌ Error: " + error.message);
    }
    setLoading(false);
  };

  // ✅ Confirmar código SMS
  const verifyCode = async () => {
    if (!confirmationResult) return alert("Primero debes enviar el código");
    try {
      const result = await confirmationResult.confirm(code);
      const user = result.user;
      alert("✅ Teléfono verificado: " + user.phoneNumber);
      onLogin(user);
    } catch (error: any) {
      alert("❌ Código incorrecto o expirado");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h2>

      <input
        type="text"
        placeholder="Correo o número (+58...)"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />

      {isEmail && (
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded mb-2 w-64"
        />
      )}

      {!confirmationResult ? (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {loading ? "Procesando..." : isRegister ? "Registrarse" : "Entrar"}
        </button>
      ) : (
        <>
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
            Verificar código
          </button>
        </>
      )}

      <p
        onClick={() => setIsRegister(!isRegister)}
        className="text-blue-600 mt-4 cursor-pointer hover:underline"
      >
        {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
      </p>

      <div id="recaptcha-container" className="mt-4"></div>
    </div>
  );
}
