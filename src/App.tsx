import React, { useState, useEffect } from "react";
import UniversalLogin from "./components/UniversalLogin";
import PhoneVerification from "./components/PhoneVerification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebaseConfig";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  // 🔍 Escucha cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser?.phoneNumber) {
        setVerified(true);
      }
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

  // 🚪 Si no hay usuario autenticado, mostrar pantalla de login
  if (!user) {
    return <UniversalLogin onLogin={setUser} />;
  }

  // 📱 Si hay usuario pero no tiene teléfono verificado, mostrar pantalla de verificación
  if (!verified) {
    return (
      <PhoneVerification
        onVerified={() => {
          setVerified(true);
          window.location.reload();
        }}
      />
    );
  }

  // ✅ Si ya está autenticado y con teléfono verificado, mostrar la app principal
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Bienvenido, {user.email || user.phoneNumber}
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

