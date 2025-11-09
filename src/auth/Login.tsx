import React, { useState } from "react";
import { loginUser, registerUser, logoutUser } from "./authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isRegistering) {
        const newUser = await registerUser(email, password);
        setUser(newUser);
        alert("Usuario registrado correctamente ✅");
      } else {
        const loggedUser = await loginUser(email, password);
        setUser(loggedUser);
        alert("Inicio de sesión exitoso ✅");
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setUser(null);
      alert("Sesión cerrada correctamente 👋");
    } catch (error: any) {
      alert("Error al cerrar sesión: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">
          {isRegistering ? "Registrarse" : "Iniciar Sesión"}
        </h2>
        {user ? (
          <div className="text-center">
            <p className="mb-4">Bienvenido, {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {isRegistering ? "Registrarse" : "Ingresar"}
            </button>
          </form>
        )}

        {!user && (
          <p className="text-center mt-4 text-sm">
            {isRegistering ? (
              <>
                ¿Ya tienes cuenta?{" "}
                <span
                  onClick={() => setIsRegistering(false)}
                  className="text-blue-600 cursor-pointer"
                >
                  Inicia sesión
                </span>
              </>
            ) : (
              <>
                ¿No tienes cuenta?{" "}
                <span
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-600 cursor-pointer"
                >
                  Regístrate
                </span>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
