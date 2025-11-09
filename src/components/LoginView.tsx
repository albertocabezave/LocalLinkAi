import React, { useState } from "react";
import { loginUser } from "../auth/authService";
import RegisterView from "./RegisterView";

export default function LoginView({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <RegisterView
        onRegisterSuccess={(user) => {
          onLogin(user);
        }}
      />
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col">
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
            Entrar
          </button>
	<button
  onClick={async () => {
    const { loginWithGoogle } = await import("../auth/authService");
    try {
      const user = await loginWithGoogle();
      onLogin(user);
    } catch (error) {
      console.error("Error al iniciar con Google:", error);
    }
  }}
  className="w-full mt-3 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2"
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    className="w-5 h-5"
  />
  Entrar con Google
</button>
        </form>

        {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

        <p className="text-gray-600 text-center mt-4">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => setShowRegister(true)}
            className="text-blue-600 hover:underline"
          >
            Crear una
          </button>
        </p>
      </div>
    </div>
  );
}
