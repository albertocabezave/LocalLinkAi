// src/components/UniversalLogin.tsx
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";
import { ensureUserDoc } from "../auth/userService";

export default function UniversalLogin({
  onLogin,
}: {
  onLogin: (user: any, requirePhoneVerification?: boolean) => void;
}) {
  const [identifier, setIdentifier] = useState(""); // correo o teléfono
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      let userCredential;
      const isPhone = /^\+?\d+$/.test(identifier.trim());

      if (isPhone) {
        // 🧩 Crear un correo virtual basado en el número
        const virtualEmail = identifier.replace("+", "") + "@phone.locallinkai.app";

        if (isRegister) {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            virtualEmail,
            password
          );
          const user = userCredential.user;
          await ensureUserDoc(user);

          // 🚀 Mandar a verificación de teléfono antes de continuar
          onLogin(user, true);
          return;
        } else {
          // Iniciar sesión con "correo virtual"
          userCredential = await signInWithEmailAndPassword(
            auth,
            virtualEmail,
            password
          );
        }
      } else {
        // ✉️ Autenticación normal por correo
        if (isRegister) {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            identifier,
            password
          );
        } else {
          userCredential = await signInWithEmailAndPassword(
            auth,
            identifier,
            password
          );
        }
      }

      const user = userCredential.user;
      await ensureUserDoc(user);
      onLogin(user, false);
    } catch (error: any) {
      console.error(error);
      alert("❌ Error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h2>

      <input
        type="text"
        placeholder="Correo o número de teléfono"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value.trim())}
        className="border p-2 rounded mb-2 w-72"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-4 w-72"
      />

      <button
        onClick={handleAuth}
        disabled={loading}
        className={`px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading
          ? "Procesando..."
          : isRegister
          ? "Registrarse"
          : "Iniciar sesión"}
      </button>

      <button
        onClick={() => setIsRegister(!isRegister)}
        className="mt-4 text-blue-600 underline"
      >
        {isRegister
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </button>
    </div>
  );
}
