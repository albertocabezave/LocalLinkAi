import React, { useState } from "react";
import { loginUser, registerUser } from "../auth/authService";
import PhoneVerification from "./PhoneVerification";

export default function LoginView({ onLogin }: { onLogin: (user: any) => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [userTemp, setUserTemp] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Iniciar sesión
  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      onLogin(user);
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  // Registrar usuario
  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);
      setUserTemp(user); // Guardamos el usuario temporal
      setShowPhoneVerification(true); // Mostramos la verificación
    } catch (error: any) {
      alert("Error al registrar: " + error.message);
    }
  };

  // Si debe verificar teléfono, mostramos ese componente
  if (showPhoneVerification && userTemp) {
    return (
      <PhoneVerification
        onVerified={() => {
          alert("✅ Usuario verificado completamente");
          onLogin(userTemp);
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">
        {isRegistering ? "Crear cuenta" : "Iniciar sesión"}
      </h2>

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded mb-2 w-64"
      />

      <button
        onClick={isRegistering ? handleRegister : handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded w-64 mb-4"
      >
        {isRegistering ? "Registrarse" : "Entrar"}
      </button>

      <p
        onClick={() => setIsRegistering(!isRegistering)}
        className="text-sm text-gray-600 underline cursor-pointer"
      >
        {isRegistering
          ? "¿Ya tienes cuenta? Inicia sesión"
          : "¿No tienes cuenta? Regístrate"}
      </p>
    </div>
  );
}
