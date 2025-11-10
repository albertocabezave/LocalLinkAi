import React, { useState } from "react";
import LoginView from "./components/LoginView";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 👀 Escucha si hay un usuario autenticado
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Cargando...</p>
      </div>
    );
  }

  // 🧭 Si no hay usuario, muestra la pantalla de login
  if (!user) {
    return <LoginView onLogin={setUser} />;
  }

  // ✅ Si hay usuario logueado, muestra la app principal
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Bienvenido, {user.email}
      </h1>
      <p className="text-gray-600 mb-6">Ya estás dentro de LocalLink AI</p>
      <button
        onClick={() => {
          import("./auth/authService").then(({ logoutUser }) => logoutUser());
        }}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}	

