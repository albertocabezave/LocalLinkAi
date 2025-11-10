import React, { useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";

export default function UniversalLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const isEmail = identifier.includes("@");

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEmail) {
        const userCredential = isRegister
          ? await createUserWithEmailAndPassword(auth, identifier, password)
          : await signInWithEmailAndPassword(auth, identifier, password);
        onLogin(userCredential.user);
      } else {
        setupRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const confirmation = await signInWithPhoneNumber(auth, identifier, appVerifier);
        setConfirmationResult(confirmation);
        alert("📱 Código SMS enviado al número " + identifier);
      }
    } catch (error: any) {
      alert("❌ " + error.message);
    }
    setLoading(false);
  };

  const verifyCode = async () => {
    if (!confirmationResult) return alert("Primero envía el código");
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-80 text-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        <input
          type="text"
          placeholder="Correo o número (+58...)"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-blue-400"
        />

        {isEmail && (
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-4 focus:outline-blue-400"
          />
        )}

        {!confirmationResult ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mb-4 transition"
          >
            {loading ? "Procesando..." : isRegister ? "Registrarse" : "Entrar"}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Código SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-3 focus:outline-blue-400"
            />
            <button
              onClick={verifyCode}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg mb-4 transition"
            >
              Verificar código
            </button>
          </>
        )}

        <p
          onClick={() => setIsRegister(!isRegister)}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </p>

        <div id="recaptcha-container" className="mt-4"></div>
      </div>
    </div>
  );
}
