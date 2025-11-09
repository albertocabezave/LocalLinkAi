import React, { useState } from "react";
import { registerUser } from "../auth/authService";

export default function RegisterView({ onRegisterSuccess }: { onRegisterSuccess: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await registerUser(email, password);
      onRegisterSuccess(user);
    } catch (err: any) {
      setError(err.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Crear cuenta
        </h2>
        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-3"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 transition"
          >
            Registrarme
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
